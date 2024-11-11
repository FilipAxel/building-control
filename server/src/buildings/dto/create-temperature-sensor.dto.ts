import { CreateBuildingDto } from './create-building.dto';

export class CreateTemperatureSensorDto {
  name: string;
  location: string;
  isActive: boolean;
  building: CreateBuildingDto;
}
