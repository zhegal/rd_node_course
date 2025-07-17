import * as AdmZip from 'adm-zip';
import { promises as fs } from 'fs';
import { tmpdir } from 'os';
import { join, extname } from 'path';

const allowedExtensions = ['.jpg', '.jpeg', '.png', '.webp'];

export async function extractZip(
  zipPath: string,
): Promise<{ imagePaths: string[]; tempDir: string }> {
  const tempDir = await fs.mkdtemp(join(tmpdir(), 'unzip-'));
  const zip = new AdmZip(zipPath);
  zip.extractAllTo(tempDir, true);

  const imagePaths: string[] = [];
  await filesFiltering(tempDir, imagePaths);

  return { imagePaths, tempDir };
}

async function filesFiltering(
  dir: string,
  imagePaths: string[],
): Promise<void> {
  const entries = await fs.readdir(dir, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = join(dir, entry.name);

    if (entry.isFile()) {
      const ext = extname(entry.name).toLowerCase();
      if (allowedExtensions.includes(ext)) {
        imagePaths.push(fullPath);
      } else {
        await fs.unlink(fullPath);
      }
    } else if (entry.isDirectory()) {
      await filesFiltering(fullPath, imagePaths);
      const children = await fs.readdir(fullPath);
      if (children.length === 0) {
        await fs.rmdir(fullPath);
      }
    }
  }
}
