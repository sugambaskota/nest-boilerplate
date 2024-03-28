import { IsNotEmpty, IsString, IsBoolean, IsOptional } from 'class-validator';
import { Transform } from 'class-transformer';

export class CreateBlogDto {
  @IsNotEmpty()
  @IsString()
  title: string;

  @IsNotEmpty()
  @IsString()
  thumbImage: string;

  @IsNotEmpty()
  @IsString()
  image: string;

  @IsNotEmpty()
  @IsString()
  shortDescription: string;

  @IsNotEmpty()
  @IsString()
  description: string;

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
