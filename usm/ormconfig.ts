import { DataSourceOptions } from 'typeorm';
import * as dotenv from 'dotenv';
import { join } from 'path';

dotenv.config({ path: '.env' }); // Load .env file for CLI

const dataSourceOptions: DataSourceOptions = {
  type: process.env.DATABASE_TYPE as any,
  host: process.env.DATABASE_HOST,
  port: parseInt(process.env.DATABASE_PORT || '5432', 10),
  username: process.env.DATABASE_USERNAME,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_NAME,
  entities: [
    join(__dirname, 'src', 'modules', '**', '*.entity.{ts,js}'),
  ],
  migrations: [
    join(__dirname, 'src', 'database', 'migrations', '*{.ts,.js}'),
  ],
  synchronize: false, // CLI should never synchronize in production scenarios
  migrationsRun: false, // CLI should not run migrations automatically unless specified
  logging: true,
};

export default dataSourceOptions;