import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Concert, ConcertDocument } from '../schema/concert.schema';

@Injectable()
export class ConcertService {
  constructor(
    @InjectModel(Concert.name) private concertModel: Model<ConcertDocument>,
  ) {}

  async create(createConcertDto: any, file: any): Promise<Concert> {
    const data = {
      ...createConcertDto,
      image: file,
    };
    const createdConcert = new this.concertModel(data);
    const savedConcert = await createdConcert.save();

    return savedConcert;
  }

  async search(search: string): Promise<Concert[]> {
    const searchdata = new RegExp(search, 'i');
    return await this.concertModel.find({
      $or: [
        { genre: searchdata },
        { name: searchdata },
        { artiste: searchdata },
        { lieu: searchdata },
      ],
    });
  }

  async findAll(): Promise<Concert[]> {
    return await this.concertModel.find().exec();
  }

  async findOne(id: string): Promise<Concert | null> {
    return this.concertModel.findById(id).exec();
  }

  async update(id: string, updateConcertDto: any): Promise<Concert | null> {
    return this.concertModel
      .findByIdAndUpdate(id, updateConcertDto, { new: true })
      .exec();
  }

  async remove(id: string): Promise<Concert | null> {
    return this.concertModel.findByIdAndDelete(id).exec();
  }
}
