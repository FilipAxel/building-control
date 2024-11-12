import { Injectable } from '@nestjs/common';
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

    const temperatureSensor = this.temperatureSensorRepository.create({
      ...createTemperatureSensorDto,
      building,
    });
    if (temperatureSensor.isActive) {
      temperatureSensor.temperature = generateRandomTemperature();
    }

    return await this.temperatureSensorRepository.save(temperatureSensor);
  }

  async findAll() {
    return this.temperatureSensorRepository.find();
  }

  async findOne(id: number) {
    return this.temperatureSensorRepository.findOne({
      where: { id },
      relations: { building: true },
    });
  }

  async update(
    id: number,
    updateTemperatureSensorDto: UpdateTemperatureSensorDto,
  ) {
    const temperatureSensor = await this.temperatureSensorRepository.preload({
      id,
      ...updateTemperatureSensorDto,
    });
    if (temperatureSensor.isActive) {
      temperatureSensor.temperature = generateRandomTemperature();
    }

    return this.temperatureSensorRepository.save(temperatureSensor);
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
      throw new Error('There is no temperature sensors for this building');
    }

    const activeSensors = building.temperatureSensors.filter(
      (sensor) => sensor.isActive,
    );

    if (activeSensors.length === 0) {
      throw new Error('No active temperature sensors found');
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
