import { Controller, Post, Body, Get, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiResponse } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { RegisterDto, LoginDto } from './auth.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @ApiOperation({ summary: '注册' })
  @ApiResponse({ status: 201, description: '注册成功，返回 JWT token 和用户信息' })
  @ApiResponse({ status: 409, description: '手机号已被注册' })
  register(@Body() dto: RegisterDto) {
    return this.authService.register(dto);
  }

  @Post('login')
  @ApiOperation({ summary: '登录' })
  @ApiResponse({ status: 200, description: '登录成功，返回 JWT token 和用户信息' })
  @ApiResponse({ status: 401, description: '手机号或密码错误' })
  login(@Body() dto: LoginDto) {
    return this.authService.login(dto);
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: '获取当前用户信息' })
  getMe(@Request() req: any) {
    return req.user;
  }
}
