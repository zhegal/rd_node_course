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

const INSTANCE_ID = uuid();
@WebSocketGateway({ path: "/ws", cors: true })
export class ChatGateway implements OnGatewayConnection, OnModuleDestroy {
  private readonly sub: Redis;
  private event$ = new Subject<{ ev: string; data: any; meta?: any }>();
  private chatMembers = new Map<string, Set<Socket>>();
  private socketChats = new Map<Socket, string>();

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

    this.event$.pipe(filter((e) => e.ev === "message")).subscribe((e) => {
      const { chatId } = e.data;
      const sockets = this.chatMembers.get(chatId);
      if (!sockets) return;
      for (const socket of sockets) {
        socket.emit("message", e.data);
      }
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
        for (const socket of sockets) {
          socket.emit("membersUpdated", { chatId, members });
        }
        for (const socket of sockets) {
          const user = socket.data.user;
          if (!members.includes(user)) {
            sockets.delete(socket);
            this.socketChats.delete(socket);
          }
        }
        if (sockets.size === 0) {
          this.chatMembers.delete(chatId);
        }
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

    // forward broadcast events belonging to this user
  }

  @SubscribeMessage("join")
  onJoin(
    @ConnectedSocket() client: Socket,
    @MessageBody() body: { chatId: string }
  ) {
    const { chatId } = body;
    if (!this.chatMembers.has(chatId)) {
      this.chatMembers.set(chatId, new Set());
    }
    this.chatMembers.get(chatId)!.add(client);
    this.socketChats.set(client, chatId);
  }

  @SubscribeMessage("leave")
  onLeave(
    @ConnectedSocket() client: Socket,
    @MessageBody() body: { chatId: string }
  ) {
    const { chatId } = body;
    this.chatMembers.get(chatId)?.delete(client);
    this.socketChats.delete(client);
  }

  @SubscribeMessage("send")
  async onSend(
    @ConnectedSocket() client: Socket,
    @MessageBody() body: { chatId: string; text: string }
  ) {
    const message = {
      id: uuid(),
      chatId: body.chatId,
      author: client.data.user,
      text: body.text,
      sentAt: new Date().toISOString(),
    };
    await this.store.add("messages", message);
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
    const { chatId, isTyping } = body;
    const sockets = this.chatMembers.get(chatId);
    if (!sockets) return;
    for (const s of sockets) {
      if (s !== client) {
        s.emit("typing", { chatId, isTyping });
      }
    }
  }
}
