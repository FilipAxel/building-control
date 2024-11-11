import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { TemperatureSensorService } from './temperature-sensor.service';
import { CreateTemperatureSensorDto } from './dto/create-temperature-sensor.dto';
import { UpdateTemperatureSensorDto } from './dto/update-temperature-sensor.dto';

@Controller('temperature-sensor')
export class TemperatureSensorController {
  constructor(private readonly temperatureSensorService: TemperatureSensorService) {}

  @Post()
  create(@Body() createTemperatureSensorDto: CreateTemperatureSensorDto) {
    return this.temperatureSensorService.create(createTemperatureSensorDto);
  }

  @Get()
  findAll() {
    return this.temperatureSensorService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.temperatureSensorService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateTemperatureSensorDto: UpdateTemperatureSensorDto) {
    return this.temperatureSensorService.update(+id, updateTemperatureSensorDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.temperatureSensorService.remove(+id);
  }
}
