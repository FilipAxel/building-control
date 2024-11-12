import { Module } from '@nestjs/common';
import { BuildingsService } from './buildings.service';
import { BuildingsController } from './buildings.controller';
import { Building } from './entities/building.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TemperatureSensor } from '../temperature-sensor/entities/temperature-sensor.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Building, TemperatureSensor])],
  controllers: [BuildingsController],
  providers: [BuildingsService],
})
export class BuildingsModule {}
