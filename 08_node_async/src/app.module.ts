import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { ZipModule } from './zip/zip.module';

@Module({
  imports: [ZipModule],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
