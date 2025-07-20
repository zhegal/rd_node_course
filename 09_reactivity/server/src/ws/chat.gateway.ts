import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from "@nestjs/websockets";
import { Server, Socket } from "socket.io";
import { Subject, Subscription } from "rxjs";
import { filter } from "rxjs/operators";
import Redis from "ioredis";
import { v4 as uuid } from "uuid";
import { ForbiddenException, OnModuleDestroy } from "@nestjs/common";
import { Store } from "../store/store";
import { ChatDTO, MessageDTO } from "src/dto";

const INSTANCE_ID = uuid(); // 🎯 унікальний для кожної репліки
@WebSocketGateway({ path: "/ws", cors: true })
export class ChatGateway implements OnGatewayConnection, OnModuleDestroy {
  @WebSocketServer()
  private server!: Server;
  private readonly sub: Redis;
  private event$ = new Subject<{ ev: string; data: any; meta?: any }>();
  private subscriptions = new Map<Socket, Subscription>();

  constructor(private store: Store, private readonly redis: Redis) {
    this.sub = this.redis.duplicate();

    this.sub.subscribe("chat-events");
    this.sub.on("message", (_, raw) => {
      const parsed = JSON.parse(raw);
      if (parsed.src === INSTANCE_ID) return; // ⬅️ skip own
      console.log("Received event:", parsed);
      this.event$.next(parsed);
    });

    this.event$
      .pipe(filter((e) => e.meta?.local))
      .subscribe((e) =>
        this.redis.publish(
          "chat-events",
          JSON.stringify({ ...e, meta: undefined, src: INSTANCE_ID })
        )
      );
  }

  onModuleDestroy() {
    this.sub.disconnect();
    this.redis.disconnect();
  }

  handleConnection(client: Socket) {
    const user = client.handshake.auth?.user as string;

    if (!user) return client.disconnect(true);
    client.data.user = user;

    const sub = this.event$
      .pipe(
        filter(
          (e) =>
            ["chatCreated", "membersUpdated"].includes(e.ev) &&
            e.data?.members?.includes?.(client.data.user)
        )
      )
      .subscribe((e) => {
        client.emit(e.ev, e.data);
      });

    this.subscriptions.set(client, sub);
  }

  handleDisconnect(client: Socket) {
    this.subscriptions.get(client)?.unsubscribe();
    this.subscriptions.delete(client);
  }

  @SubscribeMessage("join")
  onJoin(
    @ConnectedSocket() client: Socket,
    @MessageBody() body: { chatId: string }
  ) {
    const user = client.data.user as string;
    const chat = this.store.find<ChatDTO>(
      "chats",
      (chat) => chat.id === body.chatId
    );

    if (!chat) throw new ForbiddenException("Chat not found");
    if (!chat.members.includes(user)) {
      throw new ForbiddenException("You are not a member of this chat");
    }

    client.join(chat.id);

    this.event$.next({
      ev: "join",
      data: { chatId: chat.id },
      meta: { local: true },
    });
  }

  @SubscribeMessage("leave")
  onLeave(
    @ConnectedSocket() client: Socket,
    @MessageBody() body: { chatId: string }
  ) {
    const user = client.data.user as string;
    const chat = this.store.find<ChatDTO>(
      "chats",
      (chat) => chat.id === body.chatId
    );

    if (!chat) throw new ForbiddenException("Chat not found");
    if (!chat.members.includes(user)) {
      throw new ForbiddenException("You are not a member of this chat");
    }

    client.leave(chat.id);

    this.event$.next({
      ev: "leave",
      data: { chatId: chat.id },
      meta: { local: true },
    });
  }

  @SubscribeMessage("send")
  async onSend(
    @ConnectedSocket() client: Socket,
    @MessageBody() body: { chatId: string; text: string }
  ) {
    const author = client.data.user as string;
    if (!author || !body.chatId || !body.text?.trim()) {
      throw new ForbiddenException("Invalid message payload");
    }
    const chat = this.store.find<ChatDTO>("chats", (c) => c.id === body.chatId);
    if (!chat) throw new ForbiddenException("Chat not found");
    if (!chat.members.includes(author)) {
      throw new ForbiddenException("You are not a member of this chat");
    }

    const message: MessageDTO = {
      id: uuid(),
      chatId: chat.id,
      author,
      text: body.text.trim(),
      sentAt: new Date().toISOString(),
    };

    this.store.add<MessageDTO>("messages", message);
    const updated: ChatDTO = {
      ...chat,
      updatedAt: message.sentAt,
    };
    const all = await this.store.list<ChatDTO>("chats");
    const next = all.map((c) => (c.id === chat.id ? updated : c));
    this.store.set("chats", next);
    this.server.to(chat.id).emit("message", message);
    this.event$.next({
      ev: "message",
      data: message,
      meta: { local: true },
    });
  }

  @SubscribeMessage("typing")
  onTyping(
    @ConnectedSocket() client: Socket,
    @MessageBody() body: { chatId: string; isTyping: boolean }
  ) {
    const user = client.data.user as string;
    const chat = this.store.find<ChatDTO>(
      "chats",
      (chat) => chat.id === body.chatId
    );

    if (!chat) throw new ForbiddenException("Chat not found");
    if (!chat.members.includes(user)) {
      throw new ForbiddenException("You are not a member of this chat");
    }

    client.to(chat.id).emit("typing", {
      chatId: chat.id,
      user,
      isTyping: body.isTyping,
    });

    this.event$.next({
      ev: "typing",
      data: {
        chatId: chat.id,
        user,
        isTyping: body.isTyping,
      },
      meta: { local: true },
    });
  }
}
