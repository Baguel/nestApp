import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import type { Document } from 'mongoose';

export type ConcertDocument = Concert & Document;

@Schema()
export class Concert {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  description: string;

  @Prop()
  date: Date;

  @Prop({ required: true })
  lieu: string;

  @Prop({ required: true })
  genre: string;

  @Prop({ required: true })
  availableTickets: number;

  @Prop({ required: true })
  image: string;

  @Prop({ require: true })
  artiste: string;
}

export const ConcertSchema = SchemaFactory.createForClass(Concert);
