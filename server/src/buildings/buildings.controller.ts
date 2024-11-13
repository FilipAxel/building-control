import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { BuildingsService } from './buildings.service';
import { CreateBuildingDto } from './dto/create-building.dto';
import { UpdateBuildingDto } from './dto/update-building.dto';
import { TemperatureSensorService } from 'src/temperature-sensor/temperature-sensor.service';
import { ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
@ApiTags('Buildings')
@Controller('buildings')
export class BuildingsController {
  constructor(
    private readonly buildingsService: BuildingsService,
    private readonly temperatureSensorService: TemperatureSensorService,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Create a new building' })
  @ApiResponse({
    status: 201,
    description: 'The record has been successfully created.',
  })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  async create(@Body() createBuildingDto: CreateBuildingDto) {
    return await this.buildingsService.create(createBuildingDto);
  }

  @Get()
  @ApiOperation({ summary: 'Retrieve a list of all buildings' })
  @ApiResponse({
    status: 200,
    description: 'A list of buildings has been successfully retrieved.',
  })
  async findAll() {
    return await this.buildingsService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Retrieve a building by its ID' })
  @ApiParam({ name: 'id', description: 'The ID of the building to retrieve' })
  @ApiResponse({
    status: 200,
    description: 'The building record has been successfully retrieved.',
  })
  async findOne(@Param('id') id: string) {
    return await this.buildingsService.findOne(+id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update an existing building by its ID' })
  @ApiParam({ name: 'id', description: 'The ID of the building to update' })
  @ApiResponse({
    status: 200,
    description: 'The building record has been successfully updated.',
  })
  @ApiResponse({ status: 404, description: 'Building not found.' })
  async update(
    @Param('id') id: string,
    @Body() updateBuildingDto: UpdateBuildingDto,
  ) {
    return await this.buildingsService.update(+id, updateBuildingDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a building by its ID' })
  @ApiParam({ name: 'id', description: 'The ID of the building to delete' })
  @ApiResponse({
    status: 200,
  })
  async remove(@Param('id') id: string) {
    return await this.buildingsService.remove(+id);
  }

  @Get(':id/average-temperature')
  @ApiOperation({
    summary: 'Retrieve the average temperature of all sensors in a building',
  })
  @ApiParam({
    name: 'id',
    description:
      'The ID of the building for which to retrieve the average temperature',
  })
  @ApiResponse({
    status: 200,
    description:
      'The average temperature of all sensors in the building has been successfully retrieved.',
  })
  async getAverageTemperature(@Param('id') buildingId: string) {
    return await this.temperatureSensorService.getAverageTemperature(
      +buildingId,
    );
  }

  @Patch(':id/adjust-temperature')
  @ApiOperation({ summary: 'Adjust the temperature of a building' })
  @ApiParam({
    name: 'id',
    description: 'The ID of the building to adjust temperature',
  })
  async adjustTemperature(
    @Param('id') id: string,
    @Body() { amount }: { amount: number },
  ) {
    return await this.temperatureSensorService.adjustTemperature(+id, amount);
  }
}
