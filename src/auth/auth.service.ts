import { Injectable, UnprocessableEntityException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';

import { JWT_EXPIRY_REFRESH_IN_SEC } from 'src/constants/env';
import { User } from 'src/users/user.entity';
import { UsersService } from 'src/users/users.service';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { GetNewTokenDto } from './dto/get-new-token.dto';
import { PatchUserDto } from './dto/patch-user.dto';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async register(createUserDto: CreateUserDto): Promise<any> {
    await this.usersService.createUser(createUserDto);
  }

  async login(authCredentialsDto: AuthCredentialsDto): Promise<any> {
    const user =
      await this.usersService.validateUserPassword(authCredentialsDto);

    if (!user.verified) {
      throw new UnprocessableEntityException('Email is not verified.');
    }

    const { password, ...result } = user;
    const jwtPayload = {
      email: user.email,
      sub: user.id,
    };

    const accessToken = await this.jwtService.signAsync({
      ...jwtPayload,
      type: 'access',
    });

    const refreshToken = await this.jwtService.signAsync(
      {
        ...jwtPayload,
        type: 'refresh',
      },
      {
        expiresIn: this.configService.get<number>(JWT_EXPIRY_REFRESH_IN_SEC),
      },
    );

    return {
      ...result,
      accessToken,
      refreshToken,
    };
  }

  async getNewToken(getNewTokenDto: GetNewTokenDto): Promise<any> {
    const { refreshToken } = getNewTokenDto;

    try {
      const payload = await this.jwtService.verifyAsync(refreshToken);

      if (payload?.type !== 'refresh') {
        throw new Error();
      }

      const accessToken = await this.jwtService.signAsync({
        email: payload.email,
        sub: payload.sub,
        type: 'access',
      });

      return {
        accessToken,
      };
    } catch {
      throw new UnprocessableEntityException('Token not valid');
    }
  }

  async patchProfile(patchUserDto: PatchUserDto, user: User): Promise<any> {
    return this.usersService.patchUser(patchUserDto, user);
  }
}
