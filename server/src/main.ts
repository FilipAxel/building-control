import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const config = new DocumentBuilder()
    .setTitle('Building Control')
    .setDescription(
      'Building control is about managing the temperature in your buildings',
    )
    .setVersion('1.0')
    .build();
  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, documentFactory);

  if (process.env.NODE_EMV !== 'production') {
    app.enableCors({ origin: 'http://localhost:3001', credentials: true });
  }

  await app.listen(3000);
}
bootstrap();
