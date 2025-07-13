import { Injectable } from '@nestjs/common';
import { extractZip } from './utils/extract';
import { unlink } from 'fs/promises';

@Injectable()
export class ZipService {
  async sendArchive(file: Express.Multer.File) {
    const filesList = await extractZip(file.path);
    await unlink(file.path);

    return {
      count: filesList.length,
      files: filesList,
    };
  }
}
