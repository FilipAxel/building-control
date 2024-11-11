import { Test, TestingModule } from '@nestjs/testing';
import { TemperatureSensorService } from './temperature-sensor.service';

describe('TemperatureSensorService', () => {
  let service: TemperatureSensorService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TemperatureSensorService],
    }).compile();

    service = module.get<TemperatureSensorService>(TemperatureSensorService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
