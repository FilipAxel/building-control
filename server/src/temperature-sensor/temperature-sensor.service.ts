import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateTemperatureSensorDto } from './dto/create-temperature-sensor.dto';
import { UpdateTemperatureSensorDto } from './dto/update-temperature-sensor.dto';
import { EntityManager, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { TemperatureSensor } from './entities/temperature-sensor.entity';
import { Building } from 'src/buildings/entities/building.entity';

export const generateRandomTemperature = () => {
  const min = 19;
  const max = 25;
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

@Injectable()
export class TemperatureSensorService {
  constructor(
    @InjectRepository(TemperatureSensor)
    private readonly temperatureSensorRepository: Repository<TemperatureSensor>,
    private readonly entityManager: EntityManager,
  ) {}

  async create(createTemperatureSensorDto: CreateTemperatureSensorDto) {
    const building = await this.entityManager.findOne(Building, {
      where: { id: createTemperatureSensorDto.buildingId },
    });

    if (!building) {
      throw new NotFoundException(
        `Building with ID ${createTemperatureSensorDto.buildingId} not found`,
      );
    }

    const temperatureSensor = this.temperatureSensorRepository.create({
      ...createTemperatureSensorDto,
      building,
    });
    if (temperatureSensor.isActive) {
      temperatureSensor.temperature = generateRandomTemperature();
    }

    try {
      return await this.temperatureSensorRepository.save(temperatureSensor);
    } catch (error) {
      throw new BadRequestException('Failed to create temperature sensor');
    }
  }

  async findAll() {
    return this.temperatureSensorRepository.find();
  }

  async findOne(id: number) {
    try {
      return this.temperatureSensorRepository.findOneOrFail({
        where: { id },
        relations: { building: true },
      });
    } catch (error) {
      throw new NotFoundException(`Temperature sensor with ID ${id} not found`);
    }
  }

  async update(
    id: number,
    updateTemperatureSensorDto: UpdateTemperatureSensorDto,
  ) {
    const temperatureSensor = await this.temperatureSensorRepository.preload({
      id,
      ...updateTemperatureSensorDto,
    });

    if (!temperatureSensor) {
      throw new NotFoundException(`Temperature sensor with ID ${id} not found`);
    }
    if (temperatureSensor.isActive) {
      temperatureSensor.temperature = generateRandomTemperature();
    }

    try {
      return await this.temperatureSensorRepository.save(temperatureSensor);
    } catch (error) {
      throw new BadRequestException('Failed to update temperature sensor');
    }
  }

  async remove(id: number) {
    await this.temperatureSensorRepository.delete(id);
  }

  async getAverageTemperature(id: number) {
    const building = await this.entityManager.findOne(Building, {
      where: { id },
      relations: { temperatureSensors: true },
    });

    if (
      !building ||
      !building.temperatureSensors ||
      building.temperatureSensors.length === 0
    ) {
      throw new NotFoundException(
        'There is no temperature sensors for this building',
      );
    }

    const activeSensors = building.temperatureSensors.filter(
      (sensor) => sensor.isActive,
    );

    if (activeSensors.length === 0) {
      throw new NotFoundException(
        'No active temperature sensors found for this building',
      );
    }

    const totalTemperature = activeSensors.reduce(
      (sum, sensor) => sum + sensor.temperature,
      0,
    );

    console.log(
      'Average temperatur for building:' + building.id,
      Math.floor(totalTemperature / building.temperatureSensors.length),
    );
    return Math.floor(totalTemperature / activeSensors.length);
  }
}
