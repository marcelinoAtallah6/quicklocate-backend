import { CallHandler, ExecutionContext, Injectable, Logger, NestInterceptor } from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap, finalize } from 'rxjs/operators';
import { Request, Response } from 'express'; 

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  private readonly logger = new Logger(LoggingInterceptor.name);

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const requestContext = context.switchToHttp();
    const req = requestContext.getRequest<Request>();
    const res = requestContext.getResponse<Response>(); 
    const { method, url, body } = req;
    const now = Date.now();

    this.logger.log(`[HTTP Request] ${method} ${url} - Body: ${JSON.stringify(body)}`);

    return next.handle().pipe(
      tap(() => {
      }),
      finalize(() => {
        const responseTime = Date.now() - now;
        const statusCode = res.statusCode; 
        const userAgent = req.get('User-Agent') || '';
        const ip = req.ip;

        this.logger.log(
          `[HTTP Response] ${method} ${url} - Status: ${statusCode} - Latency: ${responseTime}ms - IP: ${ip} - User-Agent: ${userAgent}`
        );
      }),
    );
  }
}