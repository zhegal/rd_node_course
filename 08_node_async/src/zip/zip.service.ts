import { Injectable } from '@nestjs/common';
import { extractZip } from './utils/extract';
import { unlink, rm } from 'fs/promises';
import { Worker } from 'worker_threads';
import { Mutex } from 'async-mutex';
import { SharedState } from './interfaces/shared-state.interface';
import { performance } from 'perf_hooks';
import { join } from 'path';
import { randomUUID } from 'crypto';
import { mkdir } from 'fs/promises';

@Injectable()
export class ZipService {
  async sendArchive(file: Express.Multer.File) {
    const t0 = performance.now();

    const { imagePaths, tempDir } = await extractZip(file.path);
    await unlink(file.path);

    const requestId = randomUUID();
    const outputDir = join('uploads', requestId);
    await mkdir(outputDir, { recursive: true });

    const state: SharedState = { processed: 0, skipped: 0 };
    const mutex = new Mutex();

    const workers = imagePaths.map((path) => {
      return new Promise<void>((resolve) => {
        const worker = new Worker(
          join(__dirname, 'workers/thumbnail.worker.js'),
          {
            workerData: { imagePath: path, outputDir },
          },
        );

        worker.on('message', async (msg) => {
          await mutex.runExclusive(() => {
            if (msg.status === 'success') state.processed++;
            else state.skipped++;
          });
          resolve();
        });

        worker.on('error', async () => {
          await mutex.runExclusive(() => {
            state.skipped++;
          });
          resolve();
        });
      });
    });

    await Promise.all(workers);
    const durationMs = performance.now() - t0;
    await rm(tempDir, { recursive: true, force: true });

    return {
      processed: state.processed,
      skipped: state.skipped,
      durationMs,
      requestId,
    };
  }
}
