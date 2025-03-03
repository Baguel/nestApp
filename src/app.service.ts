import { Injectable, Inject } from '@nestjs/common';
import { ConcertService } from './concert/concert.service';

@Injectable()
export class AppService {
  @Inject(ConcertService)
  private readonly concertService: ConcertService;

  async allConcert() {
    const concerts = await this.concertService.findAll();
    return concerts;
  }

  async getConcert(id) {
    const concert = await this.concertService.findOne(id);
    return concert;
  }
}
