import {
  ConflictException,
  Injectable,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';
import { Repository } from 'typeorm';

import { AuthCredentialsDto } from 'src/auth/dto/auth-credentials.dto';
import { CreateUserDto } from 'src/auth/dto/create-user.dto';
import { PatchUserDto } from 'src/auth/dto/patch-user.dto';
import { ResendVerificationEmailDto } from 'src/auth/dto/resend-verification-email.dto';
import { VerifyEmailDto } from 'src/auth/dto/verify-email.dto';
import { USER_REGISTERED } from 'src/constants/event';
import { UserRegisteredEvent } from './events/user-registered.event';
import { User } from './user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private eventEmitter: EventEmitter2,
  ) {}

  async findOneById(id: string): Promise<User | undefined> {
    return this.usersRepository.findOneBy({
      id,
    });
  }

  async findOneByEmail(email: string): Promise<User | undefined> {
    return this.usersRepository.findOneBy({
      email,
    });
  }

  async createUser(createUserDto: CreateUserDto): Promise<any> {
    const { fullName, email, password } = createUserDto;

    const existingUser = await this.findOneByEmail(email);

    if (existingUser) {
      throw new ConflictException('Email already exists');
    }

    const user = new User();
    user.fullName = fullName;
    user.email = email;
    user.verificationToken = crypto.randomBytes(16).toString('hex');
    user.password = await this.hashPassword(password);

    await user.save();

    const userRegisteredEvent = new UserRegisteredEvent();
    userRegisteredEvent.email = user.email;
    userRegisteredEvent.fullName = user.fullName;
    userRegisteredEvent.verificationToken = user.verificationToken;
    this.eventEmitter.emit(USER_REGISTERED, userRegisteredEvent);
  }

  async patchUser(patchUserDto: PatchUserDto, user: User): Promise<any> {
    const result = await this.usersRepository.update(
      { id: user.id },
      { ...patchUserDto },
    );

    if (!result.affected) {
      throw new NotFoundException('User not found');
    }
  }

  async verifyEmail(verifyEmailDto: VerifyEmailDto): Promise<any> {
    const { email, token } = verifyEmailDto;

    const user = await this.usersRepository
      .createQueryBuilder('user')
      .where('user.email = :email', { email })
      .addSelect(['user.verificationToken'])
      .getOne();

    if (!user) {
      throw new NotFoundException('Invalid email.');
    }

    if (user.verificationToken !== token) {
      throw new UnprocessableEntityException('Unable to verify email.');
    }

    user.verified = true;
    await user.save();

    return 'Thank you for verifying email.';
  }

  async resendVerificationEmail(
    resendVerificationEmailDto: ResendVerificationEmailDto,
  ): Promise<any> {
    const { email } = resendVerificationEmailDto;

    const user = await this.usersRepository
      .createQueryBuilder('user')
      .where('user.email = :email', { email })
      .addSelect(['user.verificationToken'])
      .getOne();

    if (!user) {
      throw new NotFoundException('Invalid email.');
    }

    const userRegisteredEvent = new UserRegisteredEvent();
    userRegisteredEvent.email = user.email;
    userRegisteredEvent.fullName = user.fullName;
    userRegisteredEvent.verificationToken = user.verificationToken;
    this.eventEmitter.emit(USER_REGISTERED, userRegisteredEvent);
  }

  async validateUserPassword(
    authCredentialsDto: AuthCredentialsDto,
  ): Promise<User> {
    const { email, password } = authCredentialsDto;

    const user = await this.usersRepository
      .createQueryBuilder('user')
      .where('user.email = :email', { email })
      .addSelect(['user.password'])
      .getOne();

    if (!user) {
      throw new UnprocessableEntityException('Invalid credentials');
    }

    const match = await this.comparePasswords(password, user.password);

    if (!match) {
      throw new UnprocessableEntityException('Invalid credentials');
    }

    return user;
  }

  private async hashPassword(password: string): Promise<string> {
    return await bcrypt.hash(password, 12);
  }

  private async comparePasswords(
    candidatePassword: string,
    hashedPassword: string,
  ): Promise<boolean> {
    return await bcrypt.compare(candidatePassword, hashedPassword);
  }
}
