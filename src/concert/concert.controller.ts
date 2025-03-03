import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Render,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ConcertService } from './concert.service';

@Controller('concerts')
export class ConcertController {
  constructor(private readonly concertService: ConcertService) {}

  @Get()
  @Render('concerts')
  created() {}

  @Get('/dash')
  @Render('dash')
  async dash() {
    const concerts = await this.concertService.findAll();
    return { concerts };
  }

  @Post('register')
  @UseInterceptors(FileInterceptor('image'))
  create(
    @Body() createConcertDto: any,
    @UploadedFile() file: Express.Multer.File,
  ) {
    const filep = `/uploads/${file.filename}`;
    return this.concertService.create(createConcertDto, filep);
  }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateConcertDto: any) {
  //   return this.concertService.update(id, updateConcertDto);
  // }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.concertService.remove(id);
  }
}
