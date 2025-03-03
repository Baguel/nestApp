import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class MailService {
  constructor(private readonly mailerService: MailerService) {}
  public async send(email: string, ticket: any) {
    await this.mailerService.sendMail({
      to: email,
      subject: 'Your Concert ticket',
      template: './ticket',
      context: {
        tickets: ticket
      },
    });
  }
}
