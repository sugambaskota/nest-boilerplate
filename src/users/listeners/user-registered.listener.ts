import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { OnEvent } from '@nestjs/event-emitter';
import { ExpressHandlebars } from 'express-handlebars';

import { APP_HOST, APP_NAME } from 'src/constants/env';
import { USER_REGISTERED } from 'src/constants/event';
import { MailerService } from 'src/mailer/mailer.service';
import { UserRegisteredEvent } from 'src/users/events/user-registered.event';

@Injectable()
export class UserRegisteredListener {
  constructor(
    private configService: ConfigService,
    private mailerService: MailerService,
  ) {}

  @OnEvent(USER_REGISTERED)
  async handleUserRegisteredEvent(event: UserRegisteredEvent) {
    const handlebars = new ExpressHandlebars();
    const html = await handlebars.render(
      `${__dirname}/../../../views/mail/verification.hbs`,
      {
        appName: this.configService.get(APP_NAME),
        appHost: this.configService.get(APP_HOST),
        email: event.email,
        verificationToken: event.verificationToken,
      },
    );

    await this.mailerService.sendMail({
      recipients: [
        {
          name: event.fullName,
          address: event.email,
        },
      ],
      subject: 'Email Verification',
      html,
    });
  }
}
