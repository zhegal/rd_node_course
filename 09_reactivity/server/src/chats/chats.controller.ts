import {
  Body,
  Controller,
  Delete,
  ForbiddenException,
  Get,
  Headers,
  Param,
  Patch,
  Post,
} from "@nestjs/common";
import { ChatDTO } from "../dto";
import Redis from "ioredis";
import { Store } from "../store/store";
import { createChatName } from "./utils/createChatName";
import { randomUUID } from "crypto";

@Controller("/api/chats")
export class ChatsController {
  constructor(private store: Store, private redis: Redis) {}

  @Post()
  async create(
    @Headers("X-User") creator: string,
    @Body() body: { name?: string; members: string[] }
  ): Promise<ChatDTO> {
    if (!creator || !Array.isArray(body.members) || body.members.length < 1) {
      throw new ForbiddenException("Invalid chat members");
    }
    const members = Array.from(new Set([creator, ...body.members]));
    const name = createChatName({ name: body.name, members });
    const chat: ChatDTO = {
      id: randomUUID(),
      name,
      members,
      updatedAt: new Date().toISOString(),
    };
    await this.store.add("chats", chat);
    return chat;
  }

  @Get()
  async list(@Headers("X-User") user: string): Promise<{ items: ChatDTO[] }> {
    if (!user) throw new ForbiddenException("Missing X-User");

    const all = await this.store.list<ChatDTO>("chats");
    const items = all.filter((chat) => chat.members.includes(user));

    return { items };
  }

  @Patch(":id/members")
  async patch(
    @Headers("X-User") actor: string,
    @Param("id") id: string,
    @Body() dto: { add?: string[]; remove?: string[] }
  ): Promise<ChatDTO | void> {
    if (!actor) throw new ForbiddenException("Missing X-User");
    const chats: ChatDTO[] = await this.store.list("chats");
    const chat = chats.find((c: ChatDTO) => c.id === id);
    if (chat?.members.includes(actor)) {
      const members = new Set(chat.members);
      dto.add?.forEach((u) => members.add(u));
      dto.remove?.forEach((u) => members.delete(u));
      const updatedMembers = Array.from(members);
      const data: ChatDTO = {
        ...chat,
        members: updatedMembers,
        updatedAt: new Date().toISOString(),
      };
      const index = chats.findIndex((i) => i.id === id);
      chats[index] = data;
      await this.store.set("chats", chats);
      if (!updatedMembers.includes(actor)) return;
      return data;
    }
  }

  @Delete(":id")
  async delete(
    @Headers("X-User") admin: string,
    @Param("id") id: string
  ): Promise<void> {
    if (!admin) throw new ForbiddenException("Missing X-User");
    const chats = await this.store.list<ChatDTO>("chats");
    const chat = chats.find((c) => c.id === id);
    if (!chat) throw new ForbiddenException("Chat not found");
    if (!chat.members.includes(admin)) {
      throw new ForbiddenException("Not a member of this chat");
    }
    const filtered = chats.filter((c) => c.id !== id);
    await this.store.set("chats", filtered);
  }
}
