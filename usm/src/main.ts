import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { AppModule as UserAppModule } from './app.module';

import { start as tcpServerStart } from './tcp-server';
async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(UserAppModule, {
    transport: Transport.TCP,
    options: {
      host: 'localhost',
      port: 3001,
    },
  });

  await app.listen();
  console.log('User Microservice is listening on port 3001');
tcpServerStart();
}
bootstrap();