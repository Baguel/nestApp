import { Inject, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Ticket, TicketDocument } from '../schema/ticket.schema';
import { UserService } from 'src/user/user.service';
import { MailService } from 'src/mail/mail.service';

@Injectable()
export class TicketService {
  @Inject(UserService)
  private readonly userService: UserService;

  @Inject(MailService)
  private readonly mailService: MailService;

  constructor(
    @InjectModel(Ticket.name) private ticketModel: Model<TicketDocument>,
  ) {}

  async createTicket(userId: string, concertId: string): Promise<any> {
    const newTicket = await this.ticketModel.create({
      user: userId,
      concert: concertId,
      purchaseDate: new Date(),
    });

    const url =
      'https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=' +
      `https://nestapp-5n53.onrender.com/tickets/${newTicket._id}`;
    // const qrCodeImage = await QRCode.toDataURL(url);
    const update = await this.ticketModel.updateOne(
      { _id: newTicket.id },
      { qrCode: url },
    );
    const ticket = await this.ticketModel
      .findById(newTicket._id)
      .populate('user')
      .populate('concert')
      .lean();
    const user = await this.userService.getUser(userId);
    await this.mailService.send(user.email, ticket);
    return ticket;
  }

  async findAll(): Promise<Ticket[]> {
    const tickets = await this.ticketModel
      .find()
      .populate('user')
      .populate('concert')
      .lean();
    return tickets;
  }

  async findTickets(id: string): Promise<Ticket | null> {
    const ticke = await this.ticketModel
      .findById(id)
      .populate('user')
      .populate('concert')
      .lean();
    return ticke;
  }

  // async findByUser(userId: string): Promise<Ticket[]> {
  //   return this.ticketModel.find({ user: userId }).populate('concert').exec();
  // }

  // async count(): Promise<number> {
  //   return this.ticketModel.countDocuments().exec();
  // }
}
