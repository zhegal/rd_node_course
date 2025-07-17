import { diskStorage } from 'multer';
import { tmpdir } from 'os';

const fileSize = 100 * 1024 * 1024;
type MulterFileFilterCallback = (
  error: Error | null,
  acceptFile: boolean,
) => void;

export const fileOptions = {
  storage: diskStorage({
    destination: tmpdir(),
    filename: (_, file, cb) => {
      cb(null, `${Date.now()}-${file.originalname}`);
    },
  }),
  fileFilter: (
    _: Request,
    file: Express.Multer.File,
    cb: MulterFileFilterCallback,
  ) => {
    if (
      file.mimetype === 'application/zip' ||
      file.originalname.endsWith('.zip')
    ) {
      cb(null, true);
    } else {
      cb(new Error('Only .zip files supports'), false);
    }
  },
  limits: { fileSize },
};
