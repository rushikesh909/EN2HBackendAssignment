import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsDateString,
  IsEmail,
  IsOptional,
  IsString,
  IsUUID,
  Matches,
  MinLength,
} from 'class-validator';

export class CreateBookingDto {
  @ApiProperty({ example: 'Jane Doe' })
  @IsString()
  @MinLength(2)
  customerName: string;

  @ApiProperty({ example: 'jane@example.com' })
  @IsEmail()
  customerEmail: string;

  @ApiPropertyOptional({ example: '+1234567890' })
  @IsOptional()
  @IsString()
  customerPhone?: string;

  @ApiProperty({ example: '3f9c1a2e-...' })
  @IsUUID()
  serviceId: string;

  @ApiProperty({ example: '2026-08-01' })
  @IsDateString()
  bookingDate: string;

  @ApiProperty({ example: '14:30' })
  @Matches(/^([01]\d|2[0-3]):([0-5]\d)$/, {
    message: 'bookingTime must be in HH:mm format',
  })
  bookingTime: string;

  @ApiPropertyOptional({ example: 'Please call before arriving' })
  @IsOptional()
  @IsString()
  notes?: string;
}
