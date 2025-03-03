import { Module } from '@nestjs/common';
import { AdminController } from './admin.controller';
import { TicketModule } from 'src/ticket/ticket.module';
import { UserModule } from 'src/user/user.module';
import { ConcertModule } from 'src/concert/concert.module';
import { MulterModule } from '@nestjs/platform-express';
import { diskStorage } from 'multer';

@Module({
  imports: [
    TicketModule,
    UserModule,
    ConcertModule,
    MulterModule.register({
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, cb) => {
          const filename = `${Date.now()}-${file.originalname}`;
          cb(null, filename);
        },
      }),
    }),
  ],
  controllers: [AdminController],
})
export class AdminModule {}
