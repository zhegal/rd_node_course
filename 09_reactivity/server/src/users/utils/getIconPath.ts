import { writeFileSync } from "fs";
import { join } from "path";

const ICONS_DIR = join(process.cwd(), "public/icons");

export function getIconPath(
  icon: Express.Multer.File | undefined,
  name: string
): string {
  if (icon && ["png", "jpg", "jpeg"].includes(icon.mimetype.split("/")[1])) {
    const ext = icon.originalname.split(".").pop();
    const filename = `${name}.${ext}`;
    const fullPath = join(ICONS_DIR, filename);
    writeFileSync(fullPath, icon.buffer);
    return `/icons/${filename}`;
  }

  return "/icons/default.png";
}
