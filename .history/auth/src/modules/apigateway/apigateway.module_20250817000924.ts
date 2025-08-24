import { Module } from '@nestjs/common';
import { AppController } from './apigateway.controller';
import { AppService } from './apigateway.service';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { SERVICE } from 'src/common/constants/microservies';

@Module({
  imports: [

        ClientsModule.register([
      {
        name: SERVICE.USER_SERVICE,
        transport: Transport.TCP,
        options: {
          host: 'localhost',
          port: 3001,
        },
      },
    ]),

  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
