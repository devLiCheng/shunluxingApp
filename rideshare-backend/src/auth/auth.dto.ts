import { IsString, IsPhoneNumber, MinLength, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RegisterDto {
  @ApiProperty({ example: '张三', description: '用户名' })
  @IsString()
  @MaxLength(50)
  name: string;

  @ApiProperty({ example: '13800138000', description: '手机号' })
  @IsString()
  phone: string;

  @ApiProperty({ example: '123456', description: '密码（至少6位）' })
  @IsString()
  @MinLength(6)
  password: string;
}

export class LoginDto {
  @ApiProperty({ example: '13800138001' })
  @IsString()
  phone: string;

  @ApiProperty({ example: '123456' })
  @IsString()
  @MinLength(6)
  password: string;
}
