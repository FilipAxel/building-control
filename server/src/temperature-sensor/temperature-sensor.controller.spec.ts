import { Test, TestingModule } from '@nestjs/testing';
import { TemperatureSensorController } from './temperature-sensor.controller';
import { TemperatureSensorService } from './temperature-sensor.service';

describe('TemperatureSensorController', () => {
  let controller: TemperatureSensorController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TemperatureSensorController],
      providers: [TemperatureSensorService],
    }).compile();

    controller = module.get<TemperatureSensorController>(TemperatureSensorController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
