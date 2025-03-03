/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  Post,
  Put,
  Res,
  Req,
  Render,
} from '@nestjs/common';
import { Response } from 'express';
import { CreateUserDto } from './create-user.dto';
import { UserService } from './user.service';
import { validate } from 'class-validator';

@Controller('auth')
export class AuthController {
  constructor(private readonly userService: UserService) {}

  @Get('/register')
  @Render('index.hbs')
  getRegister() {}

  @Get('/login')
  @Render('login.hbs')
  getLogin() {}
  @Post('/register')
  async submituser(@Req() req, @Res() res: Response) {
    const dto = new CreateUserDto();
    dto.username = req.body.username;
    dto.email = req.body.email;
    dto.number = req.body.number;
    dto.password = req.body.password;

    const errors = await validate(dto);
    if (errors.length > 0) {
      return res.render('index', {
        message: JSON.stringify(errors[0].constraints),
      });
    } else {
      try {
        const newUser = await this.userService.create(dto);
        return res.redirect('/auth/login');
      } catch (err) {
        return res.render('index', {
          message: 'An User already exists with this username or email',
        });
      }
    }
  }

  @Post('/login')
  async login(@Body() body: any, @Res() res: Response, @Req() req) {
    const message = await this.userService.loginUser(body.email, body.password);
    if (message.message == 'Connected') {
      req.session.user = message.user;
      return res.redirect('/');
    } else {
      return res.render('login.hbs');
    }
  }
}
