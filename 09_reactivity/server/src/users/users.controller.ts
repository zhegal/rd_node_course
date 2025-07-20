import {
  Body,
  Controller,
  Get,
  Post,
  UploadedFile,
  UseInterceptors,
  ForbiddenException,
  Query,
} from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import { UserDTO } from "../dto";
import { UsersService } from "./users.service";

@Controller("/api/users")
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @UseInterceptors(FileInterceptor("icon"))
  async createUser(
    @Body("name") name: string,
    @UploadedFile() icon?: Express.Multer.File
  ): Promise<UserDTO> {
    if (!name || name.length < 3) {
      throw new ForbiddenException("Invalid or missing name field");
    }

    if (icon) {
      const allowedTypes = ["image/png", "image/jpeg"];
      if (!allowedTypes.includes(icon.mimetype)) {
        throw new ForbiddenException(
          "Invalid file type. Only PNG and JPG are allowed"
        );
      }
    }

    return await this.usersService.createUser(name, icon);
  }

  @Get()
  async list(
    @Query("cursor") cursor?: string,
    @Query("limit") limit?: string
  ): Promise<{ items: UserDTO[]; nextCursor?: string }> {
    return await this.usersService.getUsers({
      cursor,
      limit: limit ? Number(limit) : undefined,
    });
  }
}
