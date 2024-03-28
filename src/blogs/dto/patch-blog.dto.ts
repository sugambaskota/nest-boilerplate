import { IsOptional, IsNotEmpty, IsString, IsBoolean } from 'class-validator';
import { Transform } from 'class-transformer';

export class PatchBlogDto {
  @IsOptional()
  @IsNotEmpty()
  @IsString()
  title: string;

  @IsOptional()
  @IsNotEmpty()
  @IsString()
  thumbImage: string;

  @IsOptional()
  @IsNotEmpty()
  @IsString()
  image: string;

  @IsOptional()
  @IsNotEmpty()
  @IsString()
  shortDescription: string;

  @IsOptional()
  @IsNotEmpty()
  @IsString()
  description: string;

  @IsOptional()
  @IsNotEmpty()
  @IsBoolean()
  isPublished: boolean;

  @IsOptional()
  @Transform(({ value }) => value || null)
  metaTitle: string;

  @IsOptional()
  @Transform(({ value }) => value || null)
  metaDescription: string;

  @IsOptional()
  @Transform(({ value }) => value || null)
  metaKeywords: string;

  @IsOptional()
  @Transform(({ value }) => value || null)
  metaTags: string;

  @IsOptional()
  @Transform(({ value }) => value || null)
  socialTitle: string;

  @IsOptional()
  @Transform(({ value }) => value || null)
  socialDescription: string;

  @IsOptional()
  @Transform(({ value }) => value || null)
  socialUrl: string;

  @IsOptional()
  @Transform(({ value }) => value || null)
  socialImage: string;
}
