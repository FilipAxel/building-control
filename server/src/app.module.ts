import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from './database/database.module';
import { BuildingsModule } from './buildings/buildings.module';
import { TemperatureSensorModule } from './temperature-sensor/temperature-sensor.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    DatabaseModule,
    BuildingsModule,
    TemperatureSensorModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
