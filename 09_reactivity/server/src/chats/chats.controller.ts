import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  ForbiddenException,
  Get,
  Headers,
  NotFoundException,
  Param,
  Patch,
  Post,
} from "@nestjs/common";
import { ChatDTO, UserDTO } from "../dto";
import Redis from "ioredis";
import { Store } from "../store/store";
import { randomUUID } from "crypto";
import { createChatName } from "./utils/createChatName";

@Controller("/api/chats")
export class ChatsController {
  constructor(private store: Store, private redis: Redis) {}

  @Post()
  async create(
    @Headers("X-User") creator: string,
    @Body() body: { name?: string; members: string[] }
  ): Promise<ChatDTO> {
    if (!creator || !body?.members || body.members.length === 0) {
      throw new BadRequestException("Missing members or creator");
    }

    const users = this.store.list<UserDTO>("users");
    const nameSet = new Set(users.map((u) => u.name));

    const uniqueNames = Array.from(new Set([creator, ...body.members]));

    if (!uniqueNames.every((name) => nameSet.has(name))) {
      throw new BadRequestException("Invalid user in members");
    }

    const name = createChatName({
      name: body.name,
      members: uniqueNames,
    });

    const chat: ChatDTO = {
      id: randomUUID(),
      name,
      members: uniqueNames,
      updatedAt: new Date().toISOString(),
    };

    await this.store.add<ChatDTO>("chats", chat);
    return chat;
  }

  @Get()
  list(@Headers("X-User") user: string) {
    if (!user) {
      throw new BadRequestException("Missing X-User header");
    }

    const chats = this.store
      .list<ChatDTO>("chats")
      .filter((chat) => chat.members.includes(user))
      .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));

    return {
      items: chats,
      total: chats.length,
    };
  }

  @Patch(":id/members")
  async patch(
    @Headers("X-User") actor: string,
    @Param("id") id: string,
    @Body() dto: { add?: string[]; remove?: string[] }
  ): Promise<ChatDTO> {
    if (!actor) {
      throw new BadRequestException("Missing X-User header");
    }
    const chat = this.store.find<ChatDTO>("chats", (chat) => chat.id === id);
    if (!chat) {
      throw new NotFoundException("Chat not found");
    }
    if (!chat.members.includes(actor)) {
      throw new ForbiddenException("You are not a member of this chat");
    }
    const users = this.store.list<UserDTO>("users");
    const nameSet = new Set(users.map((u) => u.name));
    const toAdd = (dto.add || []).filter((name) => nameSet.has(name));
    const toRemove = new Set(dto.remove || []);
    const updatedMembers = Array.from(
      new Set(
        chat.members.filter((member) => !toRemove.has(member)).concat(toAdd)
      )
    );

    const updated: ChatDTO = {
      ...chat,
      members: updatedMembers,
      updatedAt: new Date().toISOString(),
    };

    const all = this.store.list<ChatDTO>("chats");
    const updatedList = all.map((chat) => (chat.id === id ? updated : chat));
    await this.store.set("chats", updatedList);
    return updated;
  }

  @Delete(":id")
  delete(@Headers("X-User") admin: string, @Param("id") id: string) {
    if (!admin) {
      throw new BadRequestException("Missing X-User header");
    }
    const chat = this.store.find<ChatDTO>("chats", (chat) => chat.id === id);
    if (!chat) {
      throw new NotFoundException("Chat not found");
    }
    if (!chat.members.includes(admin)) {
      throw new ForbiddenException("You are not a member of this chat");
    }
    const updated = this.store
      .list<ChatDTO>("chats")
      .filter((chat) => chat.id !== id);
    this.store.set("chats", updated);
  }
}
