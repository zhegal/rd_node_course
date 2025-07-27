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
import { ChatDTO, MessageDTO } from "src/dto";

const INSTANCE_ID = uuid(); // 🎯 унікальний для кожної репліки
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
      .pipe(filter((e) => e.ev === "message"))
      .subscribe(({ data }) => this.messageEvent(data));

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

    // forward broadcast events belonging to this user
  }

  @SubscribeMessage("join")
  onJoin(
    @ConnectedSocket() client: Socket,
    @MessageBody() body: { chatId: string }
  ) {
    const { chatId } = body;
    if (!this.chatMembers.get(chatId)) {
      this.chatMembers.set(chatId, new Set());
    }
    this.chatMembers.get(chatId)?.add(client);
  }

  @SubscribeMessage("leave")
  onLeave(
    @ConnectedSocket() client: Socket,
    @MessageBody() body: { chatId: string }
  ) {
    const { chatId } = body;
    this.chatMembers.get(chatId)?.delete(client);
  }

  @SubscribeMessage("send")
  async onSend(
    @ConnectedSocket() client: Socket,
    @MessageBody() body: { chatId: string; text: string }
  ) {
    const { chatId, text } = body;
    const author = client.handshake.auth?.user as string;
    const chat = await this.store.find<ChatDTO>(
      "chats",
      (c) => c.id === chatId
    );
    if (chat && chat?.members.includes(author)) {
      const data = await this.store.add<MessageDTO>("messages", {
        chatId,
        author,
        text,
        sentAt: new Date().toISOString(),
      });
      this.redis.publish(
        "chat-events",
        JSON.stringify({
          ev: "message",
          data,
        })
      );
      return data;
    }
    console.log("send");
  }

  @SubscribeMessage("typing")
  onTyping(
    @ConnectedSocket() client: Socket,
    @MessageBody() body: { chatId: string; isTyping: boolean }
  ) {
    const user = client.handshake.auth?.user as string;
    const { chatId } = body;
    const chatMembers = Array.from(this.chatMembers.get(chatId) ?? []);
    chatMembers.forEach((socket) => {
      if (socket !== client) {
        socket.emit("typing", { ...body, user });
      }
    });
  }

  private messageEvent(data: MessageDTO) {
    const { chatId } = data;
    const chatMembers = Array.from(this.chatMembers.get(chatId) ?? []);
    chatMembers.forEach((client) => {
      client.emit("message", data);
    });
  }
}
