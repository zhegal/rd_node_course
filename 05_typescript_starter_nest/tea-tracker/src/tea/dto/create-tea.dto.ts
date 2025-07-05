import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateTeaDto {
  @ApiProperty({ minLength: 3, maxLength: 40 })
  name: string;

  @ApiProperty({ minLength: 2, maxLength: 30 })
  origin: string;

  @ApiPropertyOptional({ minimum: 1, maximum: 10 })
  rating?: number;

  @ApiPropertyOptional({ minimum: 60, maximum: 100 })
  brewTemp?: number;

  @ApiPropertyOptional({ maxLength: 150 })
  notes?: string;
}
