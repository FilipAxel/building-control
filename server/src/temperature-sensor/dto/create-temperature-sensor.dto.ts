import { ApiProperty } from '@nestjs/swagger';

export class CreateTemperatureSensorDto {
  @ApiProperty({
    example: 'C20',
    required: true,
  })
  name: string;
  @ApiProperty({
    example: 'Flor 20, developer room',
    required: true,
  })
  location: string;
  @ApiProperty({
    example: true,
    required: true,
  })
  isActive: boolean;
  @ApiProperty({
    example: '1',
    required: true,
  })
  buildingId: number;
}
