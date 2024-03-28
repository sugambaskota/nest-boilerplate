import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Patch,
  Post,
  Query,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';

import { User } from 'src/users/user.entity';
import { UsersService } from 'src/users/users.service';
import { AuthGuard } from './auth.guard';
import { AuthService } from './auth.service';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { GetNewTokenDto } from './dto/get-new-token.dto';
import { PatchUserDto } from './dto/patch-user.dto';
import { ResendVerificationEmailDto } from './dto/resend-verification-email.dto';
import { VerifyEmailDto } from './dto/verify-email.dto';
import { GetUser } from './get-user.decorator';

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private usersService: UsersService,
  ) {}

  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  register(@Body(ValidationPipe) createUserDto: CreateUserDto): Promise<void> {
    return this.authService.register(createUserDto);
  }

  @Post('login')
  login(
    @Body(ValidationPipe) authCredentialsDto: AuthCredentialsDto,
  ): Promise<any> {
    return this.authService.login(authCredentialsDto);
  }

  @Post('get-new-token')
  getNewToken(
    @Body(ValidationPipe) getNewTokenDto: GetNewTokenDto,
  ): Promise<any> {
    return this.authService.getNewToken(getNewTokenDto);
  }

  @Get('profile')
  @UseGuards(AuthGuard)
  getProfile(@GetUser() user: User) {
    return user;
  }

  @Patch('profile')
  @UseGuards(AuthGuard)
  patchProfile(@Body() patchUserDto: PatchUserDto, @GetUser() user: User) {
    return this.authService.patchProfile(patchUserDto, user);
  }

  @Get('verify-email')
  verifyEmail(@Query() verifyEmailDto: VerifyEmailDto) {
    return this.usersService.verifyEmail(verifyEmailDto);
  }

  @Post('resend-verification-email')
  @HttpCode(HttpStatus.OK)
  resendVerificationEmail(
    @Body() resendVerificationEmailDto: ResendVerificationEmailDto,
  ) {
    return this.usersService.resendVerificationEmail(
      resendVerificationEmailDto,
    );
  }
}
