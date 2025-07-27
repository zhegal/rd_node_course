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
import { createReadStream, existsSync } from "fs";

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
    const iconUrl = await getIconPath(icon, id);
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
    const baseDir = join(process.cwd(), "public/icons");
    const filePath = existsSync(join(baseDir, id))
      ? join(baseDir, id)
      : join(baseDir, "default.png");

    res.setHeader("Content-Type", "image/png");
    return createReadStream(filePath).pipe(res);
  }
}
