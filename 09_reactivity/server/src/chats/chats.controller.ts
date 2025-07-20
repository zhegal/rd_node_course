import { Body, Controller, Delete, ForbiddenException, Get, Headers, NotFoundException, Param, Patch, Post } from '@nestjs/common';
import {ChatDTO} from "../dto";
import Redis from "ioredis";
import {Store} from "../store/store";

@Controller('/api/chats')
export class ChatsController {
  constructor(
    private store: Store,
    private redis: Redis
  ) {}

  @Post()
  async create(
    @Headers('X-User') creator: string,
    @Body() body: { name?: string; members: string[] },
  ): Promise<ChatDTO> {
    throw new ForbiddenException('Not implemented yet');
  }

  @Get()
  list(@Headers('X-User') user: string) {
    throw new ForbiddenException('Not implemented yet');
  }

  @Patch(':id/members')
  async patch(
    @Headers('X-User') actor: string,
    @Param('id') id: string,
    @Body() dto: { add?: string[]; remove?: string[] },
  ) {
    throw new ForbiddenException('Not implemented yet');
  }

  @Delete(':id')
  delete(@Headers('X-User') admin: string, @Param('id') id: string) {
    throw new ForbiddenException('Not implemented yet');
  }
}
