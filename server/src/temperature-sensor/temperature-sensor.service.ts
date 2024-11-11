import { Injectable } from '@nestjs/common';
import { CreateTemperatureSensorDto } from './dto/create-temperature-sensor.dto';
import { UpdateTemperatureSensorDto } from './dto/update-temperature-sensor.dto';
import { EntityManager, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { TemperatureSensor } from './entities/temperature-sensor.entity';
import { Building } from 'src/buildings/entities/building.entity';

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

    return this.temperatureSensorRepository.save(temperatureSensor);
  }

  async remove(id: number) {
    await this.temperatureSensorRepository.delete(id);
  }
}
