import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { MailerModule } from 'src/mailer/mailer.module';
import { UserRegisteredListener } from './listeners/user-registered.listener';
import { User } from './user.entity';
import { UsersService } from './users.service';

@Module({
  imports: [TypeOrmModule.forFeature([User]), MailerModule],
  providers: [UsersService, UserRegisteredListener],
  exports: [UsersService],
})
export class UsersModule {}
