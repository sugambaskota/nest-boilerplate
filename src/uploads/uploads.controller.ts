import {
  BadRequestException,
  Controller,
  Delete,
  ParseFilePipe,
  Post,
  Query,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Request } from 'express';

import { AuthGuard } from 'src/auth/auth.guard';
import {
  MAX_FILE_UPLOAD_SIZE_IN_KB,
  MAX_IMAGE_UPLOAD_SIZE_IN_KB,
} from 'src/constants/env';
import { multerStorageOptions } from 'src/options/multer';
import { FilePathValidationPipe } from './pipes/file-path-validation.pipe';
import { FolderNameTransformPipe } from './pipes/folder-name-transform.pipe';
import { UploadsService } from './uploads.service';

@Controller('uploads')
export class UploadsController {
  constructor(private uploadsService: UploadsService) {}

  @Post('image')
  @UseGuards(AuthGuard)
  @UseInterceptors(
    FileInterceptor('file', {
      storage: multerStorageOptions,
      fileFilter: (req, file, cb) => {
        const folderName = req?.query?.folder;

        if (!folderName) {
          return cb(new BadRequestException('Folder name is required'), false);
        }

        if (/\s/g.test(folderName)) {
          return cb(
            new BadRequestException('Folder name must not contain space'),
            false,
          );
        }

        if (
          [
            'image/jpeg',
            'image/jpg',
            'image/png',
            'image/gif',
            'image/webp',
          ].includes(file.mimetype)
        ) {
          return cb(null, true);
        }

        return cb(new BadRequestException('Only images are allowed'), false);
      },
      limits: {
        fileSize: +process.env[MAX_IMAGE_UPLOAD_SIZE_IN_KB] * 1024,
      },
    }),
  )
  uploadImage(
    @Query('folder', FolderNameTransformPipe) folder: string,
    @UploadedFile(
      new ParseFilePipe({
        fileIsRequired: true,
      }),
    )
    file: Express.Multer.File,
    @Req() req: Request,
  ) {
    return this.uploadsService.uploadImage(folder, file, req);
  }

  @Post('file')
  @UseGuards(AuthGuard)
  @UseInterceptors(
    FileInterceptor('file', {
      storage: multerStorageOptions,
      fileFilter: (req, file, cb) => {
        const folderName = req?.query?.folder;

        if (!folderName) {
          return cb(new BadRequestException('Folder name is required'), false);
        }

        if (/\s/g.test(folderName)) {
          return cb(
            new BadRequestException('Folder name must not contain space'),
            false,
          );
        }

        return cb(null, true);
      },
      limits: {
        fileSize: +process.env[MAX_FILE_UPLOAD_SIZE_IN_KB] * 1024,
      },
    }),
  )
  uploadFile(
    @Query('folder', FolderNameTransformPipe) folder: string,
    @UploadedFile(
      new ParseFilePipe({
        fileIsRequired: true,
      }),
    )
    file: Express.Multer.File,
    @Req() req: Request,
  ) {
    return this.uploadsService.uploadFile(folder, file, req);
  }

  @Delete('file')
  @UseGuards(AuthGuard)
  deleteFile(@Query('path', FilePathValidationPipe) path: string) {
    return this.uploadsService.deleteFile(path);
  }
}
