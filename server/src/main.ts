import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  if (process.env.NODE_EMV !== 'production') {
    app.enableCors({ origin: 'http://localhost:3001', credentials: true });
  }

  await app.listen(3000);
}
bootstrap();
