import { Controller } from '@nestjs/common';
import { MailService } from './mail.service';

@Controller('mail')
export class MailController {
  constructor(private readonly mailService: MailService) {}

  // @Get('/')
  // getHello() {
  //   return this.mailService.send('ganfonflorentin@gmail.com');
  // }
}
