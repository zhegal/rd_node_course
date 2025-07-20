import { Injectable } from "@nestjs/common";
import { Store } from "../store/store";
import { saveIcon } from "../utils/saveIcon";
import { UserDTO } from "../dto";

@Injectable()
export class UsersService {
  constructor(private readonly store: Store) {}

  async createUser(name: string, icon?: Express.Multer.File): Promise<UserDTO> {
    const id = crypto.randomUUID();
    const iconUrl: string = icon ? await saveIcon(name, icon) : '';
    return {
      id,
      name,
      iconUrl,
    };
  }

  async getUsers() {}

  resolveIconPath() {}
}
