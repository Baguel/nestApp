/* eslint-disable @typescript-eslint/no-unsafe-assignment */

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
import { UpdateUserDto } from './update-user.dto';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('/index')
  @Render('confirmation.hbs')
  homepage() {}

  @Post('/delete')
  async delete(@Res() res: Response, @Req() req) {
    try {
      const user = await this.userService.deleteUser(req.user);
      req.session.destroy();
      return res.redirect('/auth/register');
    } catch (err) {
      res.status(500).json({ error: (err as Error).message });
    }
  }

  @Post('/logout')
  logout(@Res() res: Response, @Req() req) {
    try {
      req.session.destroy();
      return res.redirect('/');
    } catch (err) {
      res.status(500).json({ error: (err as Error).message });
    }
  }

  @Get('/user')
  @Render('profile')
  async getUser(@Req() req, @Res() res: Response) {
    const user = await this.userService.getUser(req.user);
    return { user };
  }

  @Get('')
  async getAll(@Res() res: Response) {
    try {
      const user = await this.userService.getAllUser();
      return res.status(200).json(user);
    } catch (err) {
      res.status(500).json({ error: (err as Error).message });
    }
  }

  @Post('/update')
  async UpdateUsers(
    @Req() req,
    @Res() res: Response,
    @Body() UpdateUserDto: UpdateUserDto,
  ) {
    try {
      const user = await this.userService.UpdateUser(req.user, UpdateUserDto);
      return res.redirect('/user/user');
    } catch (err) {
      res.status(500).json({ error: (err as Error).message });
    }
  }

  // @Post('/update/password')
  // async UpdatePasswowrd(
  //   @Req() req,
  //   @Res() res: Response,
  //   @Body() Body,
  // ) {
  //   try {
  //     const user = await this.userService.Updatepass(req.user, Body);
  //     return res.redirect('/user/user');
  //   } catch (err) {
  //     res.status(500).json({ error: (err as Error).message });
  //   }
  // }
}
