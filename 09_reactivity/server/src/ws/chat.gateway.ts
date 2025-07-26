import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  SubscribeMessage,
  WebSocketGateway,
} from "@nestjs/websockets";
import { Socket } from "socket.io";
import { Subject } from "rxjs";
import { filter } from "rxjs/operators";
import Redis from "ioredis";
import { v4 as uuid } from "uuid";
import { ForbiddenException, OnModuleDestroy } from "@nestjs/common";
import { Store } from "../store/store";
import { ChatDTO, MessageDTO } from "../dto";

const INSTANCE_ID = uuid(); // 🎯 унікальний для кожної репліки

@WebSocketGateway({ path: "/ws", cors: true })
export class ChatGateway implements OnGatewayConnection, OnModuleDestroy {
  private readonly sub: Redis;
  private event$ = new Subject<{
    ev: string;
    data: any;
    meta?: any;
    src?: string;
  }>();
  private chatMembers = new Map<string, Set<Socket>>();

  constructor(private store: Store, private readonly redis: Redis) {
    this.sub = this.redis.duplicate();
    this.sub.subscribe("chat-events");
    this.sub.on("message", (_, raw) => {
      const parsed = JSON.parse(raw);
      if (parsed.src === INSTANCE_ID) return;
      this.event$.next(parsed);
    });

    this.event$
      .pipe(filter((e) => e.meta?.local))
      .subscribe((e) =>
        this.redis.publish(
          "chat-events",
          JSON.stringify({ ...e, src: INSTANCE_ID, meta: undefined })
        )
      );

    this.event$.pipe(filter((e) => e.ev === "message")).subscribe((e) => {
      const msg = e.data as MessageDTO;
      const sockets = this.chatMembers.get(msg.chatId);
      sockets?.forEach((socket) => socket.emit("message", msg));
    });

    this.event$
      .pipe(filter((e) => e.ev === "membersUpdated"))
      .subscribe((e) => {
        const { chatId, members } = e.data as {
          chatId: string;
          members: string[];
        };
        const sockets = this.chatMembers.get(chatId);
        sockets?.forEach((socket) =>
          socket.emit("membersUpdated", { chatId, members })
        );
      });
  }

  onModuleDestroy() {
    this.sub.disconnect();
    this.redis.disconnect();
  }

  handleConnection(client: Socket) {
    const user = client.handshake.auth?.user as string;
    if (!user) return client.disconnect(true);
    client.data.user = user;
  }

  @SubscribeMessage("join")
  async onJoin(
    @ConnectedSocket() client: Socket,
    @MessageBody() body: { chatId: string }
  ) {
    const { chatId } = body;
    const user = client.data.user as string;
    const chats = await this.store.list<ChatDTO>("chats");
    const chat = chats.find((c) => c.id === chatId);
    if (!chat) throw new ForbiddenException("Chat not found");
    if (!chat.members.includes(user))
      throw new ForbiddenException("Not a member");
    const sockets = this.chatMembers.get(chatId) || new Set<Socket>();
    sockets.add(client);
    this.chatMembers.set(chatId, sockets);

    const msgs = await this.store.list<MessageDTO>("messages");
    msgs
      .filter((m) => m.chatId === chatId)
      .forEach((m) => client.emit("message", m));

    this.event$.next({
      ev: "membersUpdated",
      data: { chatId, members: chat.members },
      meta: { local: true },
    });
  }

  @SubscribeMessage("leave")
  async onLeave(
    @ConnectedSocket() client: Socket,
    @MessageBody() body: { chatId: string }
  ) {
    const { chatId } = body;
    const sockets = this.chatMembers.get(chatId);
    if (sockets) {
      sockets.delete(client);
      if (sockets.size === 0) this.chatMembers.delete(chatId);
    }
  }

  @SubscribeMessage("send")
  async onSend(
    @ConnectedSocket() client: Socket,
    @MessageBody() body: { chatId: string; text: string }
  ) {
    const { chatId, text } = body;
    const message: MessageDTO = {
      id: uuid(),
      chatId,
      author: client.data.user as string,
      text,
      sentAt: new Date().toISOString(),
    };
    await this.store.add("messages", message);
    this.event$.next({ ev: "message", data: message, meta: { local: true } });
  }

  @SubscribeMessage("typing")
  onTyping(
    @ConnectedSocket() client: Socket,
    @MessageBody() body: { chatId: string; isTyping: boolean }
  ) {
    const { chatId, isTyping } = body;
    const user = client.data.user as string;
    const sockets = this.chatMembers.get(chatId);
    sockets?.forEach((socket) => {
      if (socket !== client) socket.emit("typing", { chatId, isTyping, user });
    });
  }
}
