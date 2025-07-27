import { writeFileSync } from "fs";
import { join } from "path";
import * as sharp from "sharp";

const ICONS_DIR = join(process.cwd(), "public/icons");

export async function getIconPath(
  icon: Express.Multer.File | undefined,
  id: string
): Promise<string> {
  if (icon && ["png", "jpg", "jpeg"].includes(icon.mimetype.split("/")[1])) {
    const fullPath = join(ICONS_DIR, `${id}.png`);
    const buffer = await sharp(icon.buffer).png().toBuffer();
    writeFileSync(fullPath, buffer);
  }
  return `/api/users/${id}/icon`;
}
