import { Injectable, OnApplicationBootstrap, Logger, OnModuleInit } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { ModuleRef } from '@nestjs/core'; 

@Injectable()
export class AppService implements OnApplicationBootstrap, OnModuleInit {
  private readonly logger = new Logger(AppService.name);
  private dataSource: DataSource; 

  constructor(private moduleRef: ModuleRef) {}

 async onModuleInit() {
    try {
      this.dataSource = this.moduleRef.get(DataSource, { strict: false });
      if (this.dataSource) {
        this.logger.log('DataSource instance obtained successfully via ModuleRef.');
      } else {
        this.logger.error('Failed to obtain DataSource instance via ModuleRef. This might indicate a TypeORM configuration issue.');
      }
    } catch (error) {
      this.logger.error('Error obtaining DataSource via ModuleRef:', error.message);
    }
  }

  async onApplicationBootstrap() {
    this.logger.log('Application has started up.');
    if (!this.dataSource) {
      this.logger.error('Cannot verify database connection: DataSource is not available on bootstrap. Exiting application.');
      process.exit(1);
    }
    try {
      await this.dataSource.query('SELECT 1'); 
      this.logger.log('Database connection verified successfully on startup.');
    } catch (error) {
      this.logger.error('Failed to connect to the database on startup!', error.message);
      process.exit(1); 
    }
  }
}
