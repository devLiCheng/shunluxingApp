import { IsString, IsNumber, IsOptional, Min, Max, IsDateString } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class CreateTripDto {
  @ApiProperty({ example: '上海虹桥站' })
  @IsString()
  from: string;

  @ApiProperty({ example: '杭州西站' })
  @IsString()
  to: string;

  @ApiProperty({ example: '2026-07-01' })
  @IsString()
  date: string;

  @ApiProperty({ example: '08:30' })
  @IsString()
  time: string;

  @ApiProperty({ example: 3, description: '总座位数' })
  @IsNumber()
  @Min(1) @Max(6)
  @Type(() => Number)
  seats: number;

  @ApiProperty({ example: 80.0, description: '每人价格（元）' })
  @IsNumber()
  @Min(0)
  @Type(() => Number)
  price: number;

  @ApiPropertyOptional({ example: '不抽烟，准时出发' })
  @IsOptional()
  @IsString()
  note?: string;
}

export class SearchTripDto {
  @ApiPropertyOptional({ example: '上海' })
  @IsOptional()
  @IsString()
  from?: string;

  @ApiPropertyOptional({ example: '杭州' })
  @IsOptional()
  @IsString()
  to?: string;

  @ApiPropertyOptional({ example: '2026-07-01' })
  @IsOptional()
  @IsString()
  date?: string;

  @ApiPropertyOptional({ example: 1 })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  page?: number;

  @ApiPropertyOptional({ example: 20 })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  limit?: number;
}
