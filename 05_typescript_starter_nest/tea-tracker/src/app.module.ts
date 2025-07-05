import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TeaModule } from './tea/tea.module';

@Module({
  imports: [TeaModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
