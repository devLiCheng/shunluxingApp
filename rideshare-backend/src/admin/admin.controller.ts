import { Controller, Get, Patch, Param, Query, UseGuards, Post } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { AdminService } from './admin.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/guards/roles.guard';
import { UserRole } from '../users/user.entity';

@ApiTags('admin')
@Controller('admin')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.ADMIN)
@ApiBearerAuth('access-token')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Get('dashboard')
  @ApiOperation({ summary: '控制台统计数据' })
  dashboard() {
    return this.adminService.dashboard();
  }

  @Get('users')
  @ApiOperation({ summary: '用户列表' })
  @ApiQuery({ name: 'page', required: false })
  @ApiQuery({ name: 'limit', required: false })
  users(@Query('page') page?: number, @Query('limit') limit?: number) {
    return this.adminService.users(page, limit);
  }

  @Get('trips')
  @ApiOperation({ summary: '行程列表' })
  @ApiQuery({ name: 'page', required: false })
  @ApiQuery({ name: 'status', required: false })
  trips(@Query('page') page?: number, @Query('status') status?: string) {
    return this.adminService.trips(page, undefined, status);
  }

  @Get('drivers')
  @ApiOperation({ summary: '车主列表' })
  drivers(@Query('page') page?: number) {
    return this.adminService.drivers(page);
  }

  @Patch('users/:id/toggle')
  @ApiOperation({ summary: '启用/禁用用户' })
  toggleUser(@Param('id') id: string) {
    return this.adminService.toggleUser(id);
  }

  @Patch('trips/:id/cancel')
  @ApiOperation({ summary: '强制取消行程' })
  cancelTrip(@Param('id') id: string) {
    return this.adminService.cancelTrip(id);
  }
}
