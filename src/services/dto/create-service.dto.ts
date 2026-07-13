import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsBoolean,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  MinLength,
} from 'class-validator';

export class CreateServiceDto {
  @ApiProperty({ example: 'Haircut' })
  @IsString()
  @MinLength(2)
  title: string;

  @ApiPropertyOptional({ example: 'A basic haircut service' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ example: 30, description: 'Duration in minutes' })
  @IsNumber()
  @IsPositive()
  duration: number;

  @ApiProperty({ example: 25.0 })
  @IsNumber()
  @IsPositive()
  price: number;

  @ApiPropertyOptional({ example: true, default: true })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
