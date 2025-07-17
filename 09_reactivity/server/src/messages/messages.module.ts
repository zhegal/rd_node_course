import { Module } from '@nestjs/common';
import {MessagesController} from "./messages.controller";
import {FileStore} from "../store/file-store";

@Module({
  controllers: [MessagesController],
  providers: [FileStore]
})
export class MessagesModule {}
