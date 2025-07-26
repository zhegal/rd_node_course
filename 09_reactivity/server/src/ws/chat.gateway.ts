import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
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

const INSTANCE_ID = uuid();

@WebSocketGateway({ path: "/ws", cors: true })
export class ChatGateway
  implements OnGatewayConnection, OnGatewayDisconnect, OnModuleDestroy
{
  private readonly sub: Redis;
  private readonly clients = new Set<Socket>();
  private readonly chatMembers = new Map<string, Set<Socket>>();
  private readonly chatUsers = new Map<string, Set<string>>();
  private readonly event$ = new Subject<{
    ev: string;
    data: any;
    meta?: any;
    src?: string;
  }>();

  constructor(private readonly store: Store, private readonly redis: Redis) {
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

    this.event$.pipe(filter((e) => e.ev === "chatCreated")).subscribe((e) => {
      const chat = e.data as ChatDTO;
      const newUsers = new Set(chat.members);
      const oldUsers = this.chatUsers.get(chat.id) || new Set<string>();

      for (const user of newUsers) {
        if (!oldUsers.has(user)) {
          for (const client of this.clients) {
            if (client.data.user === user) {
              client.emit("chatCreated", chat);
            }
          }
        }
      }

      this.chatUsers.set(chat.id, newUsers);
    });

    this.event$
      .pipe(filter((e) => e.ev === "membersUpdated"))
      .subscribe((e) => {
        const { chatId, members } = e.data as {
          chatId: string;
          members: string[];
        };
        const sockets = this.chatMembers.get(chatId);
        if (!sockets) return;

        for (const socket of Array.from(sockets)) {
          socket.emit("membersUpdated", { chatId, members });
        }

        for (const socket of Array.from(sockets)) {
          if (!members.includes(socket.data.user as string)) {
            sockets.delete(socket);
          }
        }

        if (sockets.size === 0) {
          this.chatMembers.delete(chatId);
        }

        this.chatUsers.set(chatId, new Set(members));
      });

    this.event$.pipe(filter((e) => e.ev === "message")).subscribe((e) => {
      const msg = e.data as MessageDTO;
      this.chatMembers.get(msg.chatId)?.forEach((s) => s.emit("message", msg));
    });

    this.event$.pipe(filter((e) => e.ev === "typing")).subscribe((e) => {
      const { chatId, isTyping, user } = e.data as {
        chatId: string;
        isTyping: boolean;
        user: string;
      };
      this.chatMembers.get(chatId)?.forEach((s) => {
        if (s.data.user !== user) {
          s.emit("typing", { chatId, isTyping, user });
        }
      });
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
    this.clients.add(client);
  }

  handleDisconnect(client: Socket) {
    this.clients.delete(client);
    for (const [chatId, sockets] of this.chatMembers) {
      sockets.delete(client);
      if (!sockets.size) {
        this.chatMembers.delete(chatId);
      }
    }
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
    if (!sockets) return;
    sockets.delete(client);
    if (!sockets.size) this.chatMembers.delete(chatId);
  }

  @SubscribeMessage("send")
  async onSend(
    @ConnectedSocket() client: Socket,
    @MessageBody() body: { chatId: string; text: string }
  ) {
    const message: MessageDTO = {
      id: uuid(),
      chatId: body.chatId,
      author: client.data.user as string,
      text: body.text,
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
    this.event$.next({
      ev: "typing",
      data: { chatId, isTyping, user },
      meta: { local: true },
    });
  }
}
