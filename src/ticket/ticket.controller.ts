import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Req,
  Headers,
  Render,
} from '@nestjs/common';
import { TicketService } from './ticket.service';

@Controller('tickets')
export class TicketController {
  constructor(private readonly ticketService: TicketService) {}

  @Post(':id')
  createTicket(@Req() req, @Param('id') id: string) {
    return this.ticketService.createTicket(req.user, id);
  }

  @Get('')
  async findAll() {
    return this.ticketService.findAll();
  }

  @Get(':id')
  @Render('Tickets')
  async findTick(@Req() req, @Param('id') id: string) {
    return await this.ticketService.findTickets(id);
  }

  // @Get(':id')
  // async findOne(@Param('id') id: string) {
  //   return this.ticketService.findOne(id);
  // }

  // @Get('user/:userId')
  // async findByUser(@Param('userId') userId: string) {
  //   return this.ticketService.findByUser(userId);
  // }
}
