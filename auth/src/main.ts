import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // app.setGlobalPrefix('auth'); 
  await app.listen(3000);
  console.log('Auth Gateway is listening on port 3000');
}
bootstrap();