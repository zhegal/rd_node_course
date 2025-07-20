import { Module } from "@nestjs/common";
import { RedisModule } from "../redis/redis.module";
import { ChatGateway } from "./chat.gateway";
import { FileStore } from "../store/file-store";

@Module({
  imports: [RedisModule],
  providers: [ChatGateway, FileStore],
})
export class WsModule {}
