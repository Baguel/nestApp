import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Render,
  Inject,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { AppService } from './app.service';
import { Req } from '@nestjs/common';
import { UserService } from './user/user.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Inject(UserService)
  private readonly userService: UserService;

  @Get('/')
  @Render('Accueil')
  async findAll(@Req() req) {
    const concerts = await this.appService.allConcert();
    const user = req.session.user;
    const users = await this.userService.getUser(user);
    return { concerts, user, users };
  }

  @Get(':id')
  @Render('Details')
  async findOne(@Req() req, @Param('id') id: string) {
    const concert = await this.appService.getConcert(id);
    const user = req.session.user;
    const users = await this.userService.getUser(user);
    return { concert, user, users };
  }
}
