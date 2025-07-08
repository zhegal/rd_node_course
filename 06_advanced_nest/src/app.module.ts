import { AppController } from "./app.controller";
import { Module } from "./core/decorators/module";

@Module({
  controllers: [AppController],
})
export class AppModule {}
