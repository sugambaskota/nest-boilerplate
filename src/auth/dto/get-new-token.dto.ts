import { IsNotEmpty, IsString } from 'class-validator';

export class GetNewTokenDto {
  @IsNotEmpty()
  @IsString()
  refreshToken: string;
}
