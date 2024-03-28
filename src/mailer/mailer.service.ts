import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';

import {
  APP_NAME,
  MAIL_HOST,
  MAIL_PASSWORD,
  MAIL_PORT,
  MAIL_USERNAME,
} from 'src/constants/env';
import { MailDto } from './dto/mail.dto';

@Injectable()
export class MailerService {
  constructor(private readonly configService: ConfigService) {}

  private mailTransporter() {
    const transporter = nodemailer.createTransport({
      host: this.configService.get<string>(MAIL_HOST),
      port: this.configService.get<number>(MAIL_PORT),
      auth: {
        user: this.configService.get<string>(MAIL_USERNAME),
        pass: this.configService.get<string>(MAIL_PASSWORD),
      },
    });

    return transporter;
  }

  async sendMail(mailDto: MailDto) {
    const { recipients, subject, html } = mailDto;

    const transporter = this.mailTransporter();

    try {
      await transporter.sendMail({
        from: {
          name: this.configService.get<string>(APP_NAME),
          address: this.configService.get<string>(MAIL_USERNAME),
        },
        to: recipients,
        subject,
        html,
      });
    } catch (error) {
      return;
    }
  }
}
