import { ConsoleLogger, Injectable, Scope } from '@nestjs/common'; 
@Injectable({ scope: Scope.TRANSIENT }) 
export class CustomLogger extends ConsoleLogger {

  constructor(context?: string) {
    super(context || ''); 
  }

  log(message: any, context?: string) {
    const timestamp = new Date().toISOString();
    super.log(`${timestamp} [${context || this.context}] [INFO] ${message}`);
  }

  error(message: any, trace?: string, context?: string) {
    const timestamp = new Date().toISOString();
    super.error(`${timestamp} [${context || this.context}] [ERROR] ${message}`, trace);
  }

  warn(message: any, context?: string) {
    const timestamp = new Date().toISOString();
    super.warn(`${timestamp} [${context || this.context}] [WARN] ${message}`);
  }

  debug(message: any, context?: string) {
    const timestamp = new Date().toISOString();
    super.debug(`${timestamp} [${context || this.context}] [DEBUG] ${message}`);
  }

  verbose(message: any, context?: string) {
    const timestamp = new Date().toISOString();
    super.verbose(`${timestamp} [${context || this.context}] [VERBOSE] ${message}`);
  }
}