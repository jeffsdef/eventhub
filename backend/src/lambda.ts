import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import serverlessExpress from '@vendia/serverless-express';
import * as dotenv from 'dotenv';
dotenv.config();

let server: any;

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
  const frontendUrl = process.env.FRONTEND_URL ?? 'https://eventhub-ten-liard.vercel.app';
  const allowedOrigins = new Set([
    frontendUrl,
    'http://localhost:3000',
    'http://127.0.0.1:3000',
  ]);

  app.enableCors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.has(origin)) {
        callback(null, true);
        return;
      }
      callback(null, false);
    },
    credentials: true,
  });
  await app.init();
  const expressApp = app.getHttpAdapter().getInstance();
  return serverlessExpress({ app: expressApp });
}

export const handler = async (event: any, context: any) => {
  server = server ?? await bootstrap();
  return server(event, context);
};