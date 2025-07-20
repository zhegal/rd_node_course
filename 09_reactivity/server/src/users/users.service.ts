import { Injectable } from "@nestjs/common";
import { Store } from "../store/store";
import { saveIcon } from "../utils/saveIcon";
import { UserDTO } from "../dto";

@Injectable()
export class UsersService {
  constructor(private readonly store: Store) {}

  async createUser(name: string, icon?: Express.Multer.File): Promise<UserDTO> {
    const id = crypto.randomUUID();
    const iconUrl: string = icon ? await saveIcon(name, icon) : "";
    const user: UserDTO = {
      id,
      name,
      iconUrl,
      createdAt: new Date().toISOString(),
    };
    await this.store.push("users", user);
    return user;
  }

  async getUsers(params: { cursor?: string; limit?: number }): Promise<{
    items: UserDTO[];
    nextCursor?: string;
  }> {
    const allUsers = await this.store.get<UserDTO>("users");

    const sorted = (allUsers ?? [])
      .filter((u): u is UserDTO => typeof u.createdAt === "string")
      .sort((a, b) => b.createdAt.localeCompare(a.createdAt));

    const { cursor, limit = 20 } = params;

    const filtered = cursor
      ? sorted.filter((u) => u.createdAt < cursor)
      : sorted;

    const items = filtered.slice(0, limit);
    const nextCursor =
      items.length === limit ? items[items.length - 1].createdAt : undefined;

    return { items, nextCursor };
  }
}
