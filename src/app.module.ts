import { Module, MiddlewareConsumer } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { UserModule } from './user/user.module';
import { LoggerMiddleware } from './logger/logger.middleware';
import { MailModule } from './mail/mail.module';
import { ConcertModule } from './concert/concert.module';
import { TicketModule } from './ticket/ticket.module';
import { AdminModule } from './admin/admin.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import * as path from 'path';

@Module({
  imports: [
    MongooseModule.forRoot(
      'mongodb+srv://float:Bienheureuse08@cluster0.yqyz6.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0',
    ),
    UserModule,
    MailModule,
    ConcertModule,
    TicketModule,
    AdminModule,
    ServeStaticModule.forRoot({
      rootPath: path.join(__dirname, '..', 'uploads'),
      serveRoot: '/uploads',
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(LoggerMiddleware)
      .forRoutes('user', 'concerts', 'tickets', 'admin');
  }
}
