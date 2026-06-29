import { Injectable, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User, UserRole } from '../users/user.entity';
import { DriverVerifyDto, UpdateVehicleDto } from './driver.dto';

@Injectable()
export class DriverService {
  constructor(
    @InjectRepository(User)
    private userRepo: Repository<User>,
  ) {}

  async verify(userId: string, dto: DriverVerifyDto): Promise<User> {
    const user = await this.userRepo.findOne({ where: { id: userId } });
    if (user?.driverVerified) throw new ConflictException('已完成认证');

    await this.userRepo.update(userId, {
      ...dto,
      isDriver: true,
      driverVerified: true,
      role: UserRole.DRIVER,
    });
    return this.userRepo.findOne({ where: { id: userId } }) as Promise<User>;
  }

  async updateVehicle(userId: string, dto: UpdateVehicleDto): Promise<User> {
    await this.userRepo.update(userId, dto);
    return this.userRepo.findOne({ where: { id: userId } }) as Promise<User>;
  }
}
