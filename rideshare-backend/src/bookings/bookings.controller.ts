import { Controller, Post, Get, Delete, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { BookingsService } from './bookings.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { User } from '../users/user.entity';

@ApiTags('bookings')
@Controller('bookings')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth('access-token')
export class BookingsController {
  constructor(private readonly bookingsService: BookingsService) {}

  @Post(':tripId')
  @ApiOperation({ summary: '预订行程' })
  book(@CurrentUser() user: User, @Param('tripId') tripId: string) {
    return this.bookingsService.book(user, tripId);
  }

  @Get('my')
  @ApiOperation({ summary: '我的预订' })
  myBookings(@CurrentUser() user: User) {
    return this.bookingsService.myBookings(user.id);
  }

  @Delete(':id')
  @ApiOperation({ summary: '取消预订' })
  cancel(@CurrentUser() user: User, @Param('id') id: string) {
    return this.bookingsService.cancel(user.id, id);
  }
}
