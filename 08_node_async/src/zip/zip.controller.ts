import {
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ZipService } from './zip.service';
import { fileOptions } from './utils/fileOptions';

@Controller('zip')
export class ZipController {
  constructor(private readonly zipService: ZipService) {}

  @Post()
  @UseInterceptors(FileInterceptor('zip', fileOptions))
  async sendArchive(@UploadedFile() zip: Express.Multer.File) {
    return this.zipService.sendArchive(zip);
  }
}
