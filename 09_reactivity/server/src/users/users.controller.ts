import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Res,
  UploadedFile,
  UseInterceptors,
} from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import { Response } from "express";
import { UserDTO } from "../dto";
import { Store } from "../store/store";
import { getIconPath } from "./utils/getIconPath";
import { randomUUID } from "crypto";
import { join } from "path";
import { existsSync } from "fs";

@Controller("/api/users")
export class UsersController {
  constructor(private store: Store) {}

  @Post()
  @UseInterceptors(FileInterceptor("icon"))
  async createUser(
    @Body("name") name: string,
    @UploadedFile() icon?: Express.Multer.File
  ): Promise<UserDTO> {
    const id = randomUUID();
    const iconUrl = getIconPath(icon, name);
    const user = { id, name, iconUrl };
    await this.store.add("users", user);
    return user;
  }

  @Get()
  async list(): Promise<{ items: UserDTO[]; total: number }> {
    const items: UserDTO[] = await this.store.list("users");
    return {
      items,
      total: items.length,
    };
  }

  @Get(":id/icon")
  async icon(@Param("id") id: string, @Res() res: Response) {
    const user = this.store.find<UserDTO>("users", (u) => u.id === id);
    const filename = user?.iconUrl?.replace("/icons/", "") || "default.png";
    const fullPath = join(process.cwd(), "public/icons", filename);

    if (!existsSync(fullPath)) {
      return res.sendFile(join(process.cwd(), "public/icons/default.png"));
    }

    return res.sendFile(fullPath);
  }
}
