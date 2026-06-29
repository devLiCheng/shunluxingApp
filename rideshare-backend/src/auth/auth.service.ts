import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { User } from '../users/user.entity';
import { RegisterDto, LoginDto } from './auth.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private userRepo: Repository<User>,
    private jwtService: JwtService,
  ) {}

  async register(dto: RegisterDto) {
    const exists = await this.userRepo.findOne({ where: { phone: dto.phone } });
    if (exists) throw new ConflictException('手机号已被注册');

    const hash = await bcrypt.hash(dto.password, 10);
    const user = this.userRepo.create({
      name: dto.name,
      phone: dto.phone,
      password: hash,
    });
    const saved = await this.userRepo.save(user);
    return this.signToken(saved);
  }

  async login(dto: LoginDto) {
    const user = await this.userRepo.findOne({
      where: { phone: dto.phone },
      select: ['id', 'name', 'phone', 'password', 'role', 'isDriver', 'driverVerified',
               'avatar', 'rating', 'tripCount', 'carModel', 'carPlate', 'carColor', 'idCard', 'createdAt'],
    });
    if (!user) throw new UnauthorizedException('手机号或密码错误');
    const valid = await bcrypt.compare(dto.password, user.password);
    if (!valid) throw new UnauthorizedException('手机号或密码错误');
    return this.signToken(user);
  }

  private signToken(user: User) {
    const payload = { sub: user.id, phone: user.phone, role: user.role };
    const { password, ...userInfo } = user as any;
    return {
      accessToken: this.jwtService.sign(payload),
      user: userInfo,
    };
  }

  async validateUser(id: string): Promise<User | null> {
    return this.userRepo.findOne({ where: { id, isActive: true } });
  }
}
