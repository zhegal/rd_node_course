import {
  Body,
  Controller,
  Get,
  Headers,
  Param,
  Post,
  Query,
  ForbiddenException,
} from "@nestjs/common";
import { MessageDTO, ChatDTO } from "../dto";
import { Store } from "../store/store";
import Redis from "ioredis";

@Controller("/api/chats/:id/messages")
export class MessagesController {
  constructor(private store: Store, private redis: Redis) {}

  @Get()
  async list(
    @Headers("X-User") user: string,
    @Param("id") chatId: string,
    @Query("cursor") cursor?: string,
    @Query("limit") limit = "30"
  ) {
    const chat = this.store.find<ChatDTO>("chats", (c) => c.id === chatId);
    if (!chat || !chat.members.includes(user)) {
      throw new ForbiddenException("Access denied");
    }

    const messages = (await this.store.list<MessageDTO>("messages"))
      .filter((m) => m.chatId === chatId)
      .sort((a, b) => b.sentAt.localeCompare(a.sentAt));

    const start = cursor ? messages.findIndex((m) => m.id === cursor) + 1 : 0;

    const slice = messages.slice(start, start + +limit);
    const nextCursor = slice.length === +limit ? slice.at(-1)?.id : undefined;

    return {
      items: slice,
      nextCursor,
    };
  }

  @Post()
  async create(
    @Headers("X-User") author: string,
    @Param("id") chatId: string,
    @Body("text") text: string
  ): Promise<MessageDTO> {
    const chat = this.store.find<ChatDTO>(
      "chats",
      (chat) => chat.id === chatId
    );
    if (!chat || !chat.members.includes(author)) {
      throw new ForbiddenException("Access denied");
    }

    const message = await this.store.add<MessageDTO>("messages", {
      chatId,
      author,
      text,
      sentAt: new Date().toISOString(),
    });

    const chats = await this.store.list<ChatDTO>("chats");
    const index = chats.findIndex((c) => c.id === chatId);
    if (index !== -1) {
      chats[index] = {
        ...chats[index],
        updatedAt: message.sentAt,
      };
      await this.store.set("chats", chats);
    }

    return message;
  }
}
