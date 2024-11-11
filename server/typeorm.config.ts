import { DataSource } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { config } from 'dotenv';
import { Building } from './src/buildings/entities/building.entity';
import { TemperatureSensor } from './src/buildings/entities/temperature-sensor.entity';

config();

const configService = new ConfigService();

const AppDataSource = new DataSource({
  type: 'postgres',
  host: configService.get('POSTGRES_HOST'),
  port: configService.get('POSTGRES_PORT'),
  username: configService.get('POSTGRES_USER'),
  password: configService.get('POSTGRES_PASSWORD'),
  database: configService.get('POSTGRES_DB'),
  entities: [Building, TemperatureSensor],
  migrations: ['./migrations/**/*.ts'],
  migrationsTableName: 'typeorm_migrations',
});

export default AppDataSource;
