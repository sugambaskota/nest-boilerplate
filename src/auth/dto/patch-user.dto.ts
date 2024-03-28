import { IsOptional, IsNotEmpty, IsString } from 'class-validator';
import { Transform } from 'class-transformer';

export class PatchUserDto {
  @IsOptional()
  @IsNotEmpty()
  @IsString()
  fullName: string;

  @IsOptional()
  @IsString()
  @Transform(({ value }) => value || null)
  image: string;
}
