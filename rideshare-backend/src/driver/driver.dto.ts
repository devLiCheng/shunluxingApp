import { IsString, Length } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class DriverVerifyDto {
  @ApiProperty({ example: '110101199001011234' })
  @IsString()
  @Length(18, 18, { message: '身份证号必须18位' })
  idCard: string;

  @ApiProperty({ example: '特斯拉 Model 3' })
  @IsString()
  carModel: string;

  @ApiProperty({ example: '沪A88888' })
  @IsString()
  carPlate: string;

  @ApiProperty({ example: '白色' })
  @IsString()
  carColor: string;
}

export class UpdateVehicleDto {
  @ApiProperty({ example: '特斯拉 Model 3' })
  @IsString()
  carModel: string;

  @ApiProperty({ example: '沪A88888' })
  @IsString()
  carPlate: string;

  @ApiProperty({ example: '白色' })
  @IsString()
  carColor: string;
}
