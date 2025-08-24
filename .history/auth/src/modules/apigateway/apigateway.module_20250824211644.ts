import { Module } from '@nestjs/common';
import { ApiController } from './apigateway.controller';
import { ApiService } from './apigateway.service';
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
  controllers: [ApiController],
  providers: [ApiService],
})
export class ApiModule {}
