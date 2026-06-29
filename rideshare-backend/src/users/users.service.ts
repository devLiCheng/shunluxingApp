import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepo: Repository<User>,
  ) {}

  findById(id: string) {
    return this.userRepo.findOne({ where: { id } });
  }

  async getProfile(id: string) {
    const user = await this.userRepo.findOne({ where: { id } });
    if (!user) throw new NotFoundException('用户不存在');
    return user;
  }

  async updateProfile(id: string, data: Partial<User>) {
    await this.userRepo.update(id, data);
    return this.getProfile(id);
  }

  findAll(page = 1, limit = 20) {
    return this.userRepo.findAndCount({
      skip: (page - 1) * limit,
      take: limit,
      order: { createdAt: 'DESC' },
    });
  }

  async toggleActive(id: string) {
    const user = await this.userRepo.findOne({ where: { id } });
    if (!user) throw new NotFoundException('用户不存在');
    await this.userRepo.update(id, { isActive: !user.isActive });
    return { success: true };
  }
}
