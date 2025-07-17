import { Body, Controller, Get, Param, Post, Res, UploadedFile, UseInterceptors, ForbiddenException } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Response } from 'express';
import {UserDTO} from "../dto";
import { UsersService } from './users.service';

@Controller('/api/users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @UseInterceptors(FileInterceptor('icon'))
  async createUser(
    @Body('name') name: string,
    @UploadedFile() icon?: Express.Multer.File,
  ): Promise<void> {
    return await this.usersService.createUser(name, icon?.buffer);
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
