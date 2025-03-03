import {
  Controller,
  Get,
  Res,
  Req,
  Post,
  Body,
  Param,
  UploadedFile,
  UseInterceptors,
  Render,
} from '@nestjs/common';
import { Inject } from '@nestjs/common';
import { TicketService } from 'src/ticket/ticket.service';
import { UserService } from 'src/user/user.service';
import { CreateUserDto } from 'src/user/create-user.dto';
import { Response } from 'express';
import { validate } from 'class-validator';
import { UpdateUserDto } from 'src/user/update-user.dto';
import { ConcertService } from 'src/concert/concert.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { log } from 'console';

@Controller('admin')
export class AdminController {
  @Inject(TicketService)
  private readonly ticketService: TicketService;

  @Inject(UserService)
  private readonly userService: UserService;

  @Inject(ConcertService)
  private readonly concertService: ConcertService;

  @Get('/ticket')
  @Render('ticket')
  async created(@Req() req, @Res() res) {
    const userdata = await this.userService.getUser(req.user);
    if (userdata.isAdmin === 1) {
      const ticket = await this.ticketService.findAll();
      return { tickets: ticket };
    } else {
      return res.redirect('/');
    }
  }

  @Get('/user')
  @Render('userdash')
  async User(@Req() req, @Res() res) {
    const userdata = await this.userService.getUser(req.user);
    if (userdata.isAdmin == 1) {
      const user = await this.userService.getAllUser();
      return { user };
    } else {
      return res.redirect('/');
    }
  }

  @Get('/user/:id')
  @Render('updateuser')
  async allUser(@Req() req, @Param('id') id: string, @Res() res) {
    const userdata = await this.userService.getUser(req.user);
    if (userdata.isAdmin == 1) {
      const user = await this.userService.getUser(id);
      return { user };
    } else {
      return res.redirect('/');
    }
  }

  @Post('/delete/:id')
  async delete(@Req() req, @Res() res, @Param('id') id: string) {
    const userdata = await this.userService.getUser(req.user);
    if (userdata.isAdmin == 1) {
      try {
        const user = await this.userService.deleteUser(id);
        return res.redirect('/admin/user');
      } catch (err) {
        return "user doesn't exit";
      }
    } else {
      return res.redirect('/');
    }
  }

  @Get('/register')
  @Render('register')
  getRegister() {}

  @Post('/register')
  async submituser(@Req() req, @Res() res: Response) {
    const userdata = await this.userService.getUser(req.user);
    if (userdata.isAdmin == 1) {
      const dto = new CreateUserDto();
      dto.username = req.body.username;
      dto.email = req.body.email;
      dto.number = req.body.number;
      dto.password = req.body.password;

      const errors = await validate(dto);
      if (errors.length > 0) {
        return res.render('register', {
          message: JSON.stringify(errors[0].constraints),
        });
      } else {
        try {
          const newUser = await this.userService.create(dto);
          return res.redirect('/admin/user');
        } catch (err) {
          return res.render('register', {
            message: 'An User already exists with this username or email',
          });
        }
      }
    } else {
      return res.redirect('/');
    }
  }

  @Post('/update/:id')
  async UpdateUsers(@Req() req, @Res() res: Response, @Param('id') id: string) {
    const userdata = await this.userService.getUser(req.user);
    if (userdata.isAdmin == 1) {
      const dto = new UpdateUserDto();
      dto.username = req.body.username;
      dto.email = req.body.email;
      dto.number = req.body.number;
      dto.isAdmin = parseInt(req.body.isAdmin);

      const errors = await validate(dto);
      if (errors.length > 0) {
        return res.render('updateuser', {
          message: JSON.stringify(errors[0].constraints),
        });
      } else {
        try {
          const user = await this.userService.UpdateUser(id, dto);
          return res.redirect('/admin/user');
        } catch (err) {
          res.status(500).json({ error: (err as Error).message });
        }
      }
    } else {
      return res.redirect('/');
    }
  }

  @Get('/new/concerts')
  @Render('concerts')
  createConcert() {}

  @Post('/register/concerts')
  @UseInterceptors(FileInterceptor('image'))
  async create(
    @Body() createConcertDto: any,
    @Res() res: Response,
    @Req() req,
    @UploadedFile() file: Express.Multer.File,
  ) {
    const userdata = await this.userService.getUser(req.user);
    if (userdata.isAdmin == 1) {
      const filep = await `./uploads/${file.filename}`;
      await this.concertService.create(createConcertDto, filep);
      return res.redirect('/admin/concerts');
    } else {
      return res.redirect('/');
    }
  }

  @Get('/concerts')
  @Render('concertdash')
  async allconcert(@Req() req) {
    const userdata = await this.userService.getUser(req.user);
    if (userdata.isAdmin == 1) {
      const concert = await this.concertService.findAll();
      return { concert };
    } else {
      return res.redirect('/');
    }
  }

  @Post('/concerts/:id')
  async remove(@Param('id') id: string, @Res() res: Response, @Req() req) {
    const userdata = await this.userService.getUser(req.user);
    if (userdata.isAdmin == 1) {
      await this.concertService.remove(id);
      return res.redirect('/admin/concerts');
    } else {
      return res.redirect('/');
    }
  }

  @Get('/concerts/:id')
  @Render('updateconcerts')
  async getConcert(@Param('id') id: string, @Res() res: Response, @Req() req) {
    const userdata = await this.userService.getUser(req.user);
    if (userdata.isAdmin == 1) {
      const concert = await this.concertService.findOne(id);
      return { concert };
    } else {
      return res.redirect('/');
    }
  }

  @Post('search')
  async search(@Req() req, @Res() res: Response) {
    const userdata = await this.userService.getUser(req.user);
    if (userdata.isAdmin == 1) {
      const concerts = await this.concertService.search(req.body.search);
      if (concerts) {
        return res.render('search', { concerts: concerts });
      }
    } else {
      return res.redirect('/');
    }
  }
}
