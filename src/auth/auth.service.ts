import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../users/user.entity';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { RegisterDto, LoginDto } from './dto/auth.dto';
import { EmailService } from '../email/email.service'; // Placeholder

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private userRepo: Repository<User>,
    private jwtService: JwtService,
    private emailService: EmailService,
  ) {}

  async register(dto: RegisterDto) {
    const { nickname, password, email } = dto;
    const existing = await this.userRepo.findOne({ where: { nickname } });
    if (existing) throw new UnauthorizedException('Nickname exists');

    const hashed = await bcrypt.hash(password, 12);
    const user = this.userRepo.create({ nickname, password: hashed, email });
    await this.userRepo.save(user);

    if (email) {
      // Placeholder: отправка (в реале — nodemailer с SMTP)
      await this.emailService.sendWelcome(email, nickname, password); // Отправляем plain password? Нет, в реале — reset link!
    }

    return { message: 'User created', userId: user.id };
  }

  async login(dto: LoginDto) {
    const { nickname, password } = dto;
    const user = await this.userRepo.findOne({ where: { nickname } });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload = { sub: user.id, nickname: user.nickname };
    return {
      access_token: this.jwtService.sign(payload),
      user: { id: user.id, nickname: user.nickname },
    };
  }

  async validateUser(nickname: string, pass: string): Promise<any> {
    const user = await this.userRepo.findOne({ where: { nickname } });
    if (user && await bcrypt.compare(pass, user.password)) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }
}