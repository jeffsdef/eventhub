import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import * as dotenv from 'dotenv';
dotenv.config();

let cachedServer: any;

async function bootstrap() {
  if (!cachedServer) {
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
    cachedServer = app.getHttpAdapter().getInstance();
  }
  
  return cachedServer;
}

export default async function handler(req: any, res: any) {
  const server = await bootstrap();
  return server(req, res);
}