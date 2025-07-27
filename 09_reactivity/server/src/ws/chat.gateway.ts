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

const INSTANCE_ID = uuid(); // 🎯 унікальний для кожної репліки
@WebSocketGateway({ path: "/ws", cors: true })
export class ChatGateway implements OnGatewayConnection, OnModuleDestroy {
  private readonly sub: Redis;
  private event$ = new Subject<{ ev: string; data: any; meta?: any }>();
  private clients = new Map<string, Socket>();
  private chatMembers = new Map<string, Set<string>>();

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
      .pipe(filter((e) => e.ev === "join"))
      .subscribe(({ data }) => this.joinEvent(data));

    this.event$
      .pipe(filter((e) => e.ev === "leave"))
      .subscribe(({ data }) => this.leaveEvent(data));

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
    this.clients.set(user, client);

    // forward broadcast events belonging to this user
  }

  handleDisconnect(client: Socket) {
    const user = client.handshake.auth?.user as string;
    if (this.clients.has(user)) {
      this.clients.delete(user);
    }
  }

  @SubscribeMessage("join")
  onJoin(
    @ConnectedSocket() client: Socket,
    @MessageBody() body: { chatId: string }
  ) {
    const user = client.handshake.auth?.user as string;
    const data = { ...body, user };
    this.redis.publish(
      "chat-events",
      JSON.stringify({
        ev: "join",
        data,
      })
    );
  }

  @SubscribeMessage("leave")
  onLeave(
    @ConnectedSocket() client: Socket,
    @MessageBody() body: { chatId: string }
  ) {
    const user = client.handshake.auth?.user as string;
    const data = { chatId: body.chatId, user };
    this.redis.publish(
      "chat-events",
      JSON.stringify({
        ev: "leave",
        data,
      })
    );
  }

  @SubscribeMessage("send")
  onSend(
    @ConnectedSocket() client: Socket,
    @MessageBody() body: { chatId: string; text: string }
  ) {
    console.log("send");
  }

  @SubscribeMessage("typing")
  onTyping(
    @ConnectedSocket() client: Socket,
    @MessageBody() body: { chatId: string; isTyping: boolean }
  ) {
    console.log("typing");
  }

  private joinEvent(data: { chatId: string; user: string }) {
    const { chatId, user } = data;
    if (!this.chatMembers.get(chatId)) {
      console.log('not available');
      this.chatMembers.set(chatId, new Set());
    }
    const members = this.chatMembers.get(chatId);
    members?.add(user);
  }

  private leaveEvent(data: { chatId: string; user: string }) {
    const { chatId, user } = data;
    if (!this.chatMembers.get(chatId)) {
      this.chatMembers.set(chatId, new Set());
    }
    const members = this.chatMembers.get(chatId);
    if (members?.has(user)) {
      members.delete(user);
    }
  }
}
