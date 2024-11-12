import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateBuildingDto } from './dto/create-building.dto';
import { UpdateBuildingDto } from './dto/update-building.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Building } from './entities/building.entity';

@Injectable()
export class BuildingsService {
  constructor(
    @InjectRepository(Building)
    private readonly buildingRepository: Repository<Building>,
  ) {}

  async create(createBuildingDto: CreateBuildingDto) {
    const building = new Building({
      ...createBuildingDto,
    });
    try {
      return await this.buildingRepository.save(building);
    } catch (error) {
      throw new BadRequestException('Failed to create building');
    }
  }

  async findAll() {
    try {
      return await this.buildingRepository.find({
        relations: { temperatureSensors: true },
      });
    } catch (error) {
      throw new BadRequestException('Failed to retrieve buildings');
    }
  }

  async findOne(id: number) {
    try {
      return this.buildingRepository.findOneOrFail({
        where: { id },
        relations: { temperatureSensors: true },
      });
    } catch (error) {
      throw new NotFoundException(`Building with ID ${id} not found`);
    }
  }

  async update(id: number, updateBuildingDto: UpdateBuildingDto) {
    const building = await this.buildingRepository.findOneBy({ id });

    if (!building) {
      throw new NotFoundException(`Building with ID ${id} not found`);
    }

    building.name = updateBuildingDto.name;
    building.location = updateBuildingDto.location;

    try {
      await this.buildingRepository.save(building);
    } catch (error) {
      throw new BadRequestException('Failed to update building');
    }
  }

  async remove(id: number) {
    await this.buildingRepository.delete(id);
  }
}
