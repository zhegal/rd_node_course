import {
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ZipService } from './zip.service';

@Controller('zip')
export class ZipController {
  constructor(private readonly zipService: ZipService) {}

  @Post()
  @UseInterceptors(FileInterceptor('file'))
  async sendArchive(@UploadedFile() file: Express.Multer.File) {
    return this.zipService.sendArchive(file);
  }
}
