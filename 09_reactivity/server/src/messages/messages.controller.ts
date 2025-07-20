import {
  Body,
  Controller,
  Get,
  Headers,
  Param,
  Post,
  Query,
  ForbiddenException,
  BadRequestException,
  NotFoundException,
} from "@nestjs/common";
import { ChatDTO, MessageDTO } from "../dto";
import { Store } from "../store/store";
import { randomUUID } from "crypto";

@Controller("/api/chats/:id/messages")
export class MessagesController {
  constructor(private store: Store) {}

  @Get()
  list(
    @Headers("X-User") user: string,
    @Param("id") chatId: string,
    @Query("cursor") cursor?: string,
    @Query("limit") limitRaw = "30"
  ): { items: MessageDTO[]; nextCursor?: string } {
    if (!user) {
      throw new BadRequestException("Missing X-User");
    }
    const chat = this.store.find<ChatDTO>(
      "chats",
      (chat) => chat.id === chatId
    );
    if (!chat) {
      throw new NotFoundException("Chat not found");
    }
    if (!chat.members.includes(user)) {
      throw new ForbiddenException("You are not a member of this chat");
    }

    const limit = Math.max(1, Math.min(parseInt(limitRaw), 100));
    const allMessages = this.store
      .list<MessageDTO>("messages")
      .filter((msg) => msg.chatId === chatId)
      .filter((msg) => !cursor || msg.sentAt < cursor)
      .sort((a, b) => b.sentAt.localeCompare(a.sentAt));
    const items = allMessages.slice(0, limit);
    const nextCursor =
      allMessages.length > limit ? items.at(-1)?.sentAt : undefined;

    return { items, ...(nextCursor ? { nextCursor } : {}) };
  }

  @Post()
  create(
    @Headers("X-User") author: string,
    @Param("id") chatId: string,
    @Body("text") text: string
  ): MessageDTO {
    if (!author || !text?.trim()) {
      throw new BadRequestException("Missing author or text");
    }

    const chat = this.store.find<ChatDTO>(
      "chats",
      (chat) => chat.id === chatId
    );
    if (!chat) {
      throw new NotFoundException("Chat not found");
    }

    if (!chat.members.includes(author)) {
      throw new ForbiddenException("You are not a member of this chat");
    }

    const message: MessageDTO = {
      id: randomUUID(),
      chatId,
      author,
      text,
      sentAt: new Date().toISOString(),
    };

    this.store.add<MessageDTO>("messages", message);
    return message;
  }
}
