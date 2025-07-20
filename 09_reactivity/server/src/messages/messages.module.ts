import { Module } from "@nestjs/common";
import { MessagesController } from "./messages.controller";
import { Store } from "../store/store";

@Module({
  controllers: [MessagesController],
  providers: [Store],
})
export class MessagesModule {}
