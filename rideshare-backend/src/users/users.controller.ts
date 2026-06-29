import { Controller, Get, Patch, Body, UseGuards, Request, Param } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { User } from './user.entity';

@ApiTags('users')
@Controller('users')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth('access-token')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('profile')
  @ApiOperation({ summary: '获取当前用户资料' })
  getProfile(@CurrentUser() user: User) {
    return this.usersService.getProfile(user.id);
  }

  @Patch('profile')
  @ApiOperation({ summary: '更新用户资料（名字、头像）' })
  updateProfile(
    @CurrentUser() user: User,
    @Body() body: { name?: string; avatar?: string },
  ) {
    return this.usersService.updateProfile(user.id, body);
  }

  @Get(':id')
  @ApiOperation({ summary: '获取指定用户资料' })
  getUserById(@Param('id') id: string) {
    return this.usersService.getProfile(id);
  }
}
