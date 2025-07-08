import { AppController } from "./app.controller";
import { Module } from "./core/decorators";

@Module({
  controllers: [AppController],
})
export class AppModule {}
