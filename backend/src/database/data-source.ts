import { DataSource } from 'typeorm';
import { config } from 'dotenv';

// Load environment variables
config();

/**
 * TypeORM DataSource for Migrations
 *
 * This file is used by TypeORM CLI commands to manage database migrations.
 * It's separate from the NestJS app configuration to allow running migrations
 * independently of the application.
 *
 * Usage:
 * - Generate migration: npm run migration:generate -- -n MigrationName
 * - Create empty migration: npm run migration:create -- -n MigrationName
 * - Run migrations: npm run migration:run
 * - Revert migration: npm run migration:revert
 * - Show migrations: npm run migration:show
 */

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432', 10),
  username: process.env.DB_USERNAME || 'hotel_user_v2',
  password: process.env.DB_PASSWORD || '123456',
  database: process.env.DB_NAME || 'hotel_pms_v2',

  // Entity paths
  entities: ['src/**/*.entity{.ts,.js}'],

  // Migration configuration
  migrations: ['src/database/migrations/*{.ts,.js}'],
  migrationsTableName: 'typeorm_migrations',

  // Settings
  synchronize: false, // Never use synchronize in production!
  logging: ['error', 'warn', 'migration'],

  // SSL configuration for production
  ssl:
    process.env.DB_SSL === 'true'
      ? {
        rejectUnauthorized: false,
      }
      : false,
});
