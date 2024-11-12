import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { TemperatureSensorService } from './temperature-sensor.service';
import { CreateTemperatureSensorDto } from './dto/create-temperature-sensor.dto';
import { UpdateTemperatureSensorDto } from './dto/update-temperature-sensor.dto';
import { ApiOperation, ApiParam, ApiResponse } from '@nestjs/swagger';

@Controller('temperature-sensor')
export class TemperatureSensorController {
  constructor(
    private readonly temperatureSensorService: TemperatureSensorService,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Create a new temperature sensor' })
  @ApiResponse({
    status: 201,
    description: 'The temperature sensor has been successfully created.',
  })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  async create(@Body() createTemperatureSensorDto: CreateTemperatureSensorDto) {
    return await this.temperatureSensorService.create(
      createTemperatureSensorDto,
    );
  }

  @Get()
  @ApiOperation({ summary: 'Retrieve a list of all temperature sensors' })
  @ApiResponse({
    status: 200,
    description:
      'A list of temperature sensors has been successfully retrieved.',
  })
  async findAll() {
    return await this.temperatureSensorService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Retrieve a temperature sensor by its ID' })
  @ApiParam({
    name: 'id',
    description: 'The ID of the temperature sensor to retrieve',
  })
  @ApiResponse({
    status: 200,
    description:
      'The temperature sensor record has been successfully retrieved.',
  })
  @ApiResponse({ status: 404, description: 'Temperature sensor not found.' })
  async findOne(@Param('id') id: string) {
    return await this.temperatureSensorService.findOne(+id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update an existing temperature sensor by its ID' })
  @ApiParam({
    name: 'id',
    description: 'The ID of the temperature sensor to update',
  })
  @ApiResponse({
    status: 200,
    description: 'The temperature sensor record has been successfully updated.',
  })
  @ApiResponse({ status: 404, description: 'Temperature sensor not found.' })
  async update(
    @Param('id') id: string,
    @Body() updateTemperatureSensorDto: UpdateTemperatureSensorDto,
  ) {
    return await this.temperatureSensorService.update(
      +id,
      updateTemperatureSensorDto,
    );
  }

  @Delete(':id')
  @Delete(':id')
  @ApiOperation({ summary: 'Delete a temperature sensor by its ID' })
  @ApiParam({
    name: 'id',
    description: 'The ID of the temperature sensor to delete',
  })
  @ApiResponse({
    status: 200,
    description: 'The temperature sensor record has been successfully deleted.',
  })
  async remove(@Param('id') id: string) {
    return await this.temperatureSensorService.remove(+id);
  }
}
