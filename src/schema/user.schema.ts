import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type UserDoc = HydratedDocument<User>;

@Schema()
export class User {
  @Prop({ unique: true })
  username: string;

  @Prop({ unique: true })
  email: string;

  @Prop()
  number: string;

  @Prop()
  password: string;

  @Prop({ default: 0 })
  isAdmin: number;

  @Prop()
  Notification: number;
}

export const UserSchema = SchemaFactory.createForClass(User);
