import { Injectable } from '@nestjs/common';

@Injectable()
export class ZipService {
  async sendArchive(file: Express.Multer.File) {
    return {
      message: 'ZIP file saved to tmp directory',
      originalName: file.originalname,
      savedPath: file.path,
      size: file.size,
    };
  }
}
