import { registerAs } from '@nestjs/config';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { join } from 'path';

export default registerAs('database', (): TypeOrmModuleOptions => ({
  type: process.env.DATABASE_TYPE as any, 
  host: process.env.DATABASE_HOST,
  port: parseInt(process.env.DATABASE_PORT || '5432', 10),
  username: process.env.DATABASE_USERNAME,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_NAME,
  entities: [
    join(__dirname, '..', 'modules', '**', '*.entity.{ts,js}'),
  ],
  migrations: [
    join(__dirname, '..', 'database', 'migrations', '*{.ts,.js}'),
  ],
  synchronize: process.env.NODE_ENV !== 'production',
  logging: process.env.DATABASE_LOGGING === 'true',         // 'true' string becomes boolean true
  migrationsRun: process.env.DATABASE_MIGRATIONS_RUN === 'true', // 'true' string becomes boolean true
  // ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false, // Uncomment for production SSL
}));