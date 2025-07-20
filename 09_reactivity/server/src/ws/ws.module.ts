import { Module } from "@nestjs/common";
import { RedisModule } from "../redis/redis.module";
import { ChatGateway } from "./chat.gateway";
import { Store } from "../store/store";

@Module({
  imports: [RedisModule],
  providers: [ChatGateway, Store],
})
export class WsModule {}
