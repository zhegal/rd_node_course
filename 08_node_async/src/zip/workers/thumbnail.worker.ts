import { parentPort, workerData } from 'worker_threads';
import * as sharp from 'sharp';
import { join, basename } from 'path';
import { mkdir } from 'fs/promises';

const { imagePath, outputDir } = workerData;

mkdir(outputDir, { recursive: true })
  .then(() => {
    const outputPath = join(outputDir, basename(imagePath));
    return sharp(imagePath).resize(150).toFile(outputPath);
  })
  .then(() => {
    parentPort?.postMessage({ status: 'success' });
  })
  .catch(() => {
    parentPort?.postMessage({ status: 'error' });
  });
