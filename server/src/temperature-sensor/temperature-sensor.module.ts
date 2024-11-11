import { Module } from '@nestjs/common';
import { TemperatureSensorService } from './temperature-sensor.service';
import { TemperatureSensorController } from './temperature-sensor.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Building } from 'src/buildings/entities/building.entity';
import { TemperatureSensor } from './entities/temperature-sensor.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Building, TemperatureSensor])],
  controllers: [TemperatureSensorController],
  providers: [TemperatureSensorService],
})
export class TemperatureSensorModule {}
