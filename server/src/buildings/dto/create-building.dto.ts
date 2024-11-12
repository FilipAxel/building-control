import { ApiProperty } from '@nestjs/swagger';

export class CreateBuildingDto {
  @ApiProperty({
    example: 'Stocholms stadshus',
    required: true,
  })
  name: string;

  @ApiProperty({
    example: 'Hantverkargatan 1',
    required: true,
  })
  location: string;
}
