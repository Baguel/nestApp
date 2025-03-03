import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from '../schema/user.schema';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { AuthController } from './auth.controller';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
  ],
  controllers: [UserController, AuthController],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
