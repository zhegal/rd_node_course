import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Res,
  UploadedFile,
  UseInterceptors,
  ForbiddenException,
} from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import { Response } from "express";
import { UserDTO } from "../dto";
import { Store } from "../store/store";
import { getIconPath } from "./utils/getIconPath";
import { randomUUID } from "crypto";

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
    const user = {
      id,
      name,
      iconUrl,
    };
    await this.store.add("users", user);
    return user;
  }

  @Get()
  async list(): Promise<{ items: UserDTO[]; total: number }> {
    const items: UserDTO[] = await this.store.list("users");
    const result = {
      items,
      total: items.length,
    };
    return result;
  }

  @Get("icons/:iconPath")
  async icon(@Param("iconPath") iconPath: string, @Res() res: Response) {
    throw new ForbiddenException("Not implemented yet");
  }
}
