import {
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ZipService } from './zip.service';
import { diskStorage } from 'multer';
import { tmpdir } from 'os';

@Controller('zip')
export class ZipController {
  constructor(private readonly zipService: ZipService) {}

  @Post()
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: tmpdir(),
        filename: (_, file, cb) => {
          cb(null, `${Date.now()}-${file.originalname}`);
        },
      }),
      fileFilter: (_, file, cb) => {
        if (
          file.mimetype === 'application/zip' ||
          file.originalname.endsWith('.zip')
        ) {
          cb(null, true);
        } else {
          cb(new Error('Only .zip files supports'), false);
        }
      },
      limits: {
        fileSize: 100 * 1024 * 1024,
      },
    }),
  )
  async sendArchive(@UploadedFile() file: Express.Multer.File) {
    return this.zipService.sendArchive(file);
  }
}
