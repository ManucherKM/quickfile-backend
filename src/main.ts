import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import env from 'env-var';

const PORT = process.env.PORT || 5000;
const CLIENT_URL = env.get('CLIENT_URL').required().asString();

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({ origin: CLIENT_URL });

  app.setGlobalPrefix('api');

  await app.listen(PORT);
}

bootstrap();
