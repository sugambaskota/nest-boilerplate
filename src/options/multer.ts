import * as multer from 'multer';
import * as path from 'path';
import * as fs from 'fs';

import { generateRandomString } from 'src/utils/string';

export const multerStorageOptions = multer.diskStorage({
  destination: (req, file, cb) => {
    const tempDir = path.resolve(
      __dirname,
      '..',
      '..',
      'public',
      'uploads',
      'temp',
    );
    const imagesDir = path.resolve(
      __dirname,
      '..',
      '..',
      'public',
      'uploads',
      'images',
    );
    const filesDir = path.resolve(
      __dirname,
      '..',
      '..',
      'public',
      'uploads',
      'files',
    );

    if (!fs.existsSync(tempDir)) {
      fs.mkdirSync(tempDir, {
        recursive: true,
      });
    }

    if (!fs.existsSync(imagesDir)) {
      fs.mkdirSync(imagesDir, {
        recursive: true,
      });
    }

    if (!fs.existsSync(filesDir)) {
      fs.mkdirSync(filesDir, {
        recursive: true,
      });
    }
    cb(null, tempDir);
  },
  filename: (req, file, cb) => {
    const targetFileName =
      Date.now() +
      '-' +
      generateRandomString(7) +
      path.extname(file.originalname);
    cb(null, targetFileName);
  },
});
