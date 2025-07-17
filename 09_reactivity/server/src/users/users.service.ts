import { Injectable } from "@nestjs/common";
import { Store } from "../store/store";

@Injectable()
export class UsersService {
  constructor(private readonly store: Store) {}

  async createUser(name: string, icon?: Buffer) {
    console.log(name, icon);
  }

  async getUsers() {}

  resolveIconPath() {}
}
