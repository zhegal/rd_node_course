import {Module} from '@nestjs/common';
import {ChatsController} from './chats.controller';
import {UsersModule} from "../users/users.module";

@Module({
  imports: [UsersModule],
  controllers: [ChatsController],
})
export class ChatsModule { }
