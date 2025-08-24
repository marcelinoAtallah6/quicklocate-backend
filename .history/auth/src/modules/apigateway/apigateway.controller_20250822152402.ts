import { All, Body, Controller, Get, HttpException, HttpStatus, Inject, Param, Post, Req, Res } from '@nestjs/common';
import { AppService } from './apigateway.service';
import { ClientProxy } from '@nestjs/microservices';
import { catchError, firstValueFrom, Observable, throwError, timeout } from 'rxjs';
import { Request, Response } from 'express';
import { SERVICE } from 'src/common/constants/microservies';

const INTERNAL_API_KEY = process.env.JWT_SECRET;

@Controller('api')
export class AppController {
  private readonly clients: Map<string, ClientProxy> = new Map();

  constructor(
    @Inject(SERVICE.USER_SERVICE) private usersClient: ClientProxy,
  ) {
    this.clients.set(SERVICE.USER_SERVICE, this.usersClient);
  }

  @All(':serviceName/:messagePattern')
  async handleRequest(@Req() req: Request, @Res() res: Response) {
    try {
      const { serviceName, messagePattern } = req.params;
      const client = this.clients.get(serviceName);

      if (!client) {
        throw new HttpException('Service not found', HttpStatus.NOT_FOUND);
      }

      const message = `${messagePattern}`;

      // const data = req.body || req.query;
      const body = {
        secureKey: INTERNAL_API_KEY,
        data: req.body || req.query
      };

      console.log("body = ",body);

      const result = await firstValueFrom(
        client.send(message, body).pipe(timeout(5000))
      );

      return res.status(HttpStatus.OK).json(result);

    } catch (e) {
      if (e instanceof HttpException) {
        return res.status(e.getStatus()).json({
          statusCode: e.getStatus(),
          message: e.message,
        });
      }
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: 'An unexpected error occurred',
      });
    }
  }
}
