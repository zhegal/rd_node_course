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
    const user: UserDTO = { id, name, iconUrl };
    await this.store.push("users", user);
    return user;
  }

  async getUsers(): Promise<{ items: UserDTO[]; total: number }> {
    const users = await this.store.get<UserDTO>("users");
    return { items: users, total: users.length };
  }
}
