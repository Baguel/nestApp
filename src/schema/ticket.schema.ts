import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { User } from './user.schema';
import { Concert } from './concert.schema';

export type TicketDocument = Ticket & Document;

@Schema()
export class Ticket {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  user: User;

  @Prop({ type: Types.ObjectId, ref: 'Concert', required: true })
  concert: Concert;

  @Prop({ required: true })
  purchaseDate: Date;

  @Prop()
  qrCode: string;
}

export const TicketSchema = SchemaFactory.createForClass(Ticket);
