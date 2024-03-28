import { Injectable } from '@nestjs/common';
import { Request } from 'express';
import * as fs from 'fs';
import * as path from 'path';
import * as sharp from 'sharp';

@Injectable()
export class UploadsService {
  async uploadImage(
    folder: string,
    file: Express.Multer.File,
    req: Request,
  ): Promise<any> {
    const { filename } = file;

    const targetFolderPath = path.resolve(
      file.destination,
      '..',
      'images',
      folder,
    );

    if (!fs.existsSync(targetFolderPath)) {
      fs.mkdirSync(targetFolderPath, {
        recursive: true,
      });
    }

    const imageMetaData = await sharp(file.path).metadata();

    if (imageMetaData.width > 1200) {
      await sharp(file.path)
        .resize({
          fit: sharp.fit.contain,
          width: 1200,
        })
        .toFile(path.resolve(targetFolderPath, filename));
    } else {
      fs.copyFileSync(req.file.path, path.resolve(targetFolderPath, filename));
    }

    fs.unlinkSync(file.path);

    return {
      path: `/uploads/images/${folder}/${filename}`,
    };
  }

  async uploadFile(
    folder: string,
    file: Express.Multer.File,
    req: Request,
  ): Promise<any> {
    const { filename } = file;

    const targetFolderPath = path.resolve(
      file.destination,
      '..',
      'files',
      folder,
    );

    if (!fs.existsSync(targetFolderPath)) {
      fs.mkdirSync(targetFolderPath, {
        recursive: true,
      });
    }

    fs.copyFileSync(req.file.path, path.resolve(targetFolderPath, filename));
    fs.unlinkSync(file.path);

    return {
      path: `/uploads/files/${folder}/${filename}`,
    };
  }

  async deleteFile(path: string) {
    return;
  }
}
