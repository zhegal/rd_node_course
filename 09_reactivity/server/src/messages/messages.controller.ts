import { Body, Controller, Get, Headers, Param, Post, Query, ForbiddenException } from '@nestjs/common';
import {MessageDTO} from "../dto";
import {Store} from "../store/store";

@Controller('/api/chats/:id/messages')
export class MessagesController {
  constructor(private store: Store) {}

  @Get()
  list(
    @Headers('X-User') user: string,
    @Param('id') chatId: string,
    @Query('cursor') cursor?: string,
    @Query('limit') limit = '30',
  ) {
    throw new ForbiddenException('Not implemented yet');
  }

  @Post()
  create(
    @Headers('X-User') author: string,
    @Param('id') chatId: string,
    @Body('text') text: string,
  ): MessageDTO {
    throw new ForbiddenException('Not implemented yet');
  }
}
