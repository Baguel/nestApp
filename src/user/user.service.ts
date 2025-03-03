import { Injectable, NotFoundException } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { User } from '../schema/user.schema';
import * as bcrypt from 'bcrypt';
import { UpdateUserDto } from './update-user.dto';
import { json } from 'stream/consumers';

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}
  async create(data: User): Promise<User> {
    const hashPass = await bcrypt.hash(data.password, 10);

    const datas = {
      ...data,
      password: hashPass,
    };

    const result = new this.userModel(datas);
    return await result.save();
  }

  async loginUser(email: string, password: string): Promise<any> {
    const userfind = await this.userModel
      .findOne({ email: email })
      .select('+password');
    if (userfind) {
      if (await bcrypt.compare(password, userfind.password)) {
        return { message: 'Connected', user: userfind };
      } else {
        return { message: 'Bad Password' };
      }
    } else {
      return { message: 'user not found' };
    }
  }

  async deleteUser(id: string): Promise<any> {
    const data = await this.userModel.findByIdAndDelete(id).exec();
    if (!data) {
      return 'user not found';
    }
    return 'User Delete Successfully';
  }

  async getUser(id: string): Promise<any> {
    const data = await this.userModel.findById(id).exec();
    if (!data) {
      return 'user not found';
    }
    return data;
  }

  async getAllUser(): Promise<any> {
    const data = await this.userModel.find();
    if (!data) {
      return 'user not found';
    }
    return data;
  }

  async UpdateUser(id: string, UpdateUserDto: UpdateUserDto): Promise<any> {
    const existingUser = await this.userModel.findByIdAndUpdate(
      id,
      UpdateUserDto,
      { new: true },
    );
    if (!existingUser) {
      return 'user not found';
    }
    return existingUser;
  }

  // async Updatepass(id: string, body: object): Promise<any> {
  //   const data = await this.userModel.findById(id).exec();
  //   const datas = {
  //     password: bcrypt.hash(body.new, 10),
  //   };
  //   if (await bcrypt.compare(body.password, data.password)) {
  //     const existingUser = await this.userModel.findByIdAndUpdate(id, datas, {
  //       new: true,
  //     });
  //     if (!existingUser) {
  //       return 'user not found';
  //     }
  //     return existingUser;
  //   } else {
  //     return 'user not found';
  //   }
  // }
}
