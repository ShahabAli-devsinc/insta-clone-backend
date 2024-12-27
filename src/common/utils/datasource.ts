import { DataSource } from 'typeorm';
import { join } from 'path';
import { ConfigService } from '@nestjs/config';
import { config } from 'dotenv';
config();

const configService = new ConfigService();

export const connectionSource = new DataSource({
  type: 'postgres',
  host: configService.get<string>('DATABASE_HOST'),
  port: parseInt(configService.get<string>('DATABASE_PORT'), 10) || 5434,
  username: configService.get<string>('DATABASE_USER'),
  password: configService.get<string>('DATABASE_PASSWORD'),
  database: configService.get<string>('MIGRATION_DATABASE_NAME'),
  logging: true,
  entities: [__dirname + '/../**/*.entity{.ts,.js}'],
  migrations: [join(__dirname, '/../../', 'database/migrations/**/*{.ts,.js}')],
  synchronize: false,
  migrationsTableName: 'typeorm_migrations',
  migrationsRun: false,
});
