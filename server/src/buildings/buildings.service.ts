import { Injectable } from '@nestjs/common';
import { CreateBuildingDto } from './dto/create-building.dto';
import { UpdateBuildingDto } from './dto/update-building.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Building } from './entities/building.entity';

@Injectable()
export class BuildingsService {
  constructor(
    @InjectRepository(Building)
    private readonly itemsRepository: Repository<Building>,
  ) {}

  async create(createBuildingDto: CreateBuildingDto) {
    const building = new Building({
      ...createBuildingDto,
    });
    this.itemsRepository.save(building);
  }

  async findAll() {
    return await this.itemsRepository.find();
  }

  findOne(id: number) {
    return this.itemsRepository.findOne({
      where: { id },
      relations: { temperatureSensors: true },
    });
  }

  async update(id: number, updateBuildingDto: UpdateBuildingDto) {
    const building = await this.itemsRepository.findOneBy({ id });
    building.name = updateBuildingDto.name;
    building.location = updateBuildingDto.location;

    this.itemsRepository.save(building);
  }

  async remove(id: number) {
    await this.itemsRepository.delete(id);
  }
}
