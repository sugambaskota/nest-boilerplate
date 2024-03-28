import { ArgumentMetadata, PipeTransform } from '@nestjs/common';

export class FolderNameTransformPipe implements PipeTransform {
  transform(value: any, metadata: ArgumentMetadata) {
    value = value?.toLowerCase();
    return value;
  }
}
