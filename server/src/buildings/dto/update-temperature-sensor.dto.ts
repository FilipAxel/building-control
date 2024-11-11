import { PartialType } from '@nestjs/mapped-types';
import { CreateTemperatureSensorDto } from '../dto/create-temperature-sensor.dto';

export class UpdateTemperatureSensorDto extends PartialType(
  CreateTemperatureSensorDto,
) {
  temperature: number;
}
