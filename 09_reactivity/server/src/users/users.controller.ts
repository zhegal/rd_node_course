import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Res,
  UploadedFile,
  UseInterceptors,
  BadRequestException,
} from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import { Response } from "express";
import { UserDTO } from "../dto";
import { Store } from "../store/store";
import { join } from "path";
import { existsSync } from "fs";
import { getIconPath } from "./utils/getIconPath";

const ICONS_DIR = join(process.cwd(), "public/icons");

@Controller("/api/users")
export class UsersController {
  constructor(private store: Store) {}

  @Post()
  @UseInterceptors(FileInterceptor("icon"))
  async createUser(
    @Body("name") name: string,
    @UploadedFile() icon?: Express.Multer.File
  ): Promise<UserDTO> {
    if (!name || name.length < 3) {
      throw new BadRequestException("Invalid name");
    }

    const existing = this.store.find<UserDTO>("users", (u) => u.name === name);
    if (existing) {
      throw new BadRequestException("User with this name already exists");
    }

    const iconUrl = getIconPath(icon, name);
    const user = await this.store.add<UserDTO>("users", { name, iconUrl });
    return user;
  }

  @Get()
  list(): { items: UserDTO[]; total: number } {
    const items = this.store.list<UserDTO>("users");
    return { items, total: items.length };
  }

  @Get("icons/:iconPath")
  async icon(@Param("iconPath") iconPath: string, @Res() res: Response) {
    const filePath = join(ICONS_DIR, iconPath);
    return res.sendFile(
      existsSync(filePath) ? filePath : join(ICONS_DIR, "default.png")
    );
  }
}
