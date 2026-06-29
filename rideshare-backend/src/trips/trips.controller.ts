import {
  Controller, Get, Post, Body, Param, Delete, UseGuards, Query,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { TripsService } from './trips.service';
import { CreateTripDto, SearchTripDto } from './trip.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { User } from '../users/user.entity';

@ApiTags('trips')
@Controller('trips')
export class TripsController {
  constructor(private readonly tripsService: TripsService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: '发布行程（需车主认证）' })
  create(@CurrentUser() user: User, @Body() dto: CreateTripDto) {
    return this.tripsService.create(user, dto);
  }

  @Get('search')
  @ApiOperation({ summary: '搜索行程' })
  search(@Query() query: SearchTripDto) {
    return this.tripsService.search(query);
  }

  @Get('my')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: '我发布的行程' })
  myTrips(@CurrentUser() user: User) {
    return this.tripsService.myTrips(user.id);
  }

  @Get(':id')
  @ApiOperation({ summary: '行程详情' })
  findOne(@Param('id') id: string) {
    return this.tripsService.findById(id);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: '取消行程' })
  cancel(@Param('id') id: string, @CurrentUser() user: User) {
    return this.tripsService.cancelTrip(id, user.id);
  }
}
