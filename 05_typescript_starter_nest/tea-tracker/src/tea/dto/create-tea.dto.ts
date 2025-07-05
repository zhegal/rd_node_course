import { IsInt, IsOptional, IsString, Length, Max, Min } from 'class-validator';

export class CreateTeaDto {
  @IsString()
  @Length(3, 40)
  name: string;

  @IsString()
  @Length(2, 30)
  origin: string;

  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(10)
  rating?: number;

  @IsOptional()
  @IsInt()
  @Min(60)
  @Max(100)
  brewTemp?: number;

  @IsOptional()
  @IsString()
  @Length(0, 150)
  notes?: string;
}
