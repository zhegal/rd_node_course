import { promises as fs } from "node:fs";
import { join } from "node:path";

export async function saveIcon(
  name: string,
  icon: Express.Multer.File
): Promise<string> {
  const ext = icon.originalname.split(".").pop();
  const fullName = `${name}.${ext}`;
  const dirPath = join(__dirname, "../..", "public", "icons");
  const filePath = join(dirPath, fullName);

  await fs.mkdir(dirPath, { recursive: true });
  await fs.writeFile(filePath, icon.buffer);

  return `/icons/${fullName}`;
}
