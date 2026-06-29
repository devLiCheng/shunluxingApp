import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DriverService } from './driver.service';
import { DriverController } from './driver.controller';
import { User } from '../users/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  providers: [DriverService],
  controllers: [DriverController],
})
export class DriverModule {}
