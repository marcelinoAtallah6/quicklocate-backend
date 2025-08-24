import { Injectable, Logger } from '@nestjs/common';
import { HealthCheckService, TypeOrmHealthIndicator, HealthCheckResult, HealthIndicatorResult } from '@nestjs/terminus';

@Injectable()
export class HealthService {
  private readonly logger = new Logger(HealthService.name);

  constructor(
    private health: HealthCheckService,
    private db: TypeOrmHealthIndicator,
  ) {}

  async checkDatabase(): Promise<HealthIndicatorResult> {
    try {
      const dbStatus = await this.db.pingCheck('database');
      return dbStatus;
    } catch (error) {
      this.logger.error(`Health Check: Database connection FAILED: ${error.message}`);
      throw error; 
    }
  }

  async checkAppHealth(): Promise<HealthCheckResult> {
    return this.health.check([
      () => this.checkDatabase(), 
    ]);
  }
}