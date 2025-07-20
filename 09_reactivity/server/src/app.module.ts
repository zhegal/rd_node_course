import { Module } from "@nestjs/common";
import { ServeStaticModule } from "@nestjs/serve-static";
import { RedisModule } from "./redis/redis.module";
import { UsersModule } from "./users/users.module";
// import {ChatsModule} from "./chats/chats.module";
// import {MessagesModule} from "./messages/messages.module";
// import {WsModule} from "./ws/ws.module";
import { MulterModule } from "@nestjs/platform-express";
import { memoryStorage } from "multer";
import { join } from "path";

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, "..", "public"),
      serveRoot: "/",
    }),
    MulterModule.register({ storage: memoryStorage() }),
    // RedisModule.forRoot({
    //   url: process.env.REDIS_URL ?? "redis://localhost:6379",
    // }),
    UsersModule,
    // ChatsModule,
    // MessagesModule,
    // WsModule,
  ],
})
export class AppModule {}
