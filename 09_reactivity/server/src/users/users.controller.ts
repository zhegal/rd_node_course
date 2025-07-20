import { Body, Controller, Get, Param, Post, Res, UploadedFile, UseInterceptors, ForbiddenException } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Response } from 'express';
import {UserDTO} from "../dto";
import {Store} from "../store/store";

@Controller('/api/users')
export class UsersController {
  constructor(private store: Store) {}

  @Post()
  @UseInterceptors(FileInterceptor('icon'))
  createUser(
    @Body('name') name: string,
    @UploadedFile() icon?: Express.Multer.File,
  ): UserDTO {
    throw new ForbiddenException('Not implemented yet');
  }

  @Get()
  list(): { items: UserDTO[]; total: number } {
    throw new ForbiddenException('Not implemented yet');
  }

  @Get('icons/:iconPath')
  async icon(@Param('iconPath') iconPath: string, @Res() res: Response) {
    throw new ForbiddenException('Not implemented yet');
  }
}
