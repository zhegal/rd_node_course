import { Injectable } from '@nestjs/common';

@Injectable()
export class ZipService {
  async sendArchive(file: Express.Multer.File) {
    console.log(file);
    return {
      message: file ? 'i have a file!!!' : 'send me file please!!',
    };
  }
}
