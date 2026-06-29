import { Controller, Post, Patch, Body, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { DriverService } from './driver.service';
import { DriverVerifyDto, UpdateVehicleDto } from './driver.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { User } from '../users/user.entity';

@ApiTags('driver')
@Controller('driver')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth('access-token')
export class DriverController {
  constructor(private readonly driverService: DriverService) {}

  @Post('verify')
  @ApiOperation({ summary: '提交车主认证' })
  verify(@CurrentUser() user: User, @Body() dto: DriverVerifyDto) {
    return this.driverService.verify(user.id, dto);
  }

  @Patch('vehicle')
  @ApiOperation({ summary: '更新车辆信息' })
  updateVehicle(@CurrentUser() user: User, @Body() dto: UpdateVehicleDto) {
    return this.driverService.updateVehicle(user.id, dto);
  }
}
