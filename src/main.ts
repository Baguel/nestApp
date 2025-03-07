import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import * as session from 'express-session';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  app.useStaticAssets(join(__dirname, '..', 'public'));
  app.setBaseViewsDir(join(__dirname, '..', 'views'));
  app.setViewEngine('hbs');
  app.useGlobalPipes(new ValidationPipe({ transform: true, whitelist: true }));
  app.use(
    session({
      secret: 'yourSecretKey',
      resave: false,
      saveUninitialized: true,
      cookie: { secure: false }, // Set to true in production with HTTPS
    }),
  );
  await app.listen(process.env.PORT ?? 3000, '0.0.0.0');
}
bootstrap();
