import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../users/user.entity';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { RegisterDto, LoginDto, AuthStatusDto } from './dto/auth.dto';
import { EmailService } from '../email/email.service'; // Placeholder
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private userRepo: Repository<User>,
    private jwtService: JwtService,
    private emailService: EmailService,
    private configService: ConfigService,
  ) {}

getAuthResponse(user: User) {
    const payload = { sub: user.id, nickName: user.nickName };

    const token = this.jwtService.sign(payload);

    return {
      access_token: token,
      user: { id: user.id, nickName: user.nickName, email: user.email || null },
    };
}

  async register(dto: RegisterDto) {
    const { nickName, password, email } = dto;
    const existing = await this.userRepo.findOne({ where: { nickName } });
    if (existing) throw new UnauthorizedException('Nickname exists');

    if (email) {
      const existingEmail = await this.userRepo.findOne({ where: { email } });
      if (existingEmail) throw new UnauthorizedException('Email already exists');
    }

    const hashed = await bcrypt.hash(password, 12);
    const user = this.userRepo.create({ nickName, password: hashed, email });
    await this.userRepo.save(user);

    if (email) {
      // если почта есть то отправим письмо с приветствием и nickName
      await this.emailService.sendWelcome(email, nickName, password);
    }

    const response = this.getAuthResponse(user);
    return response
  }

  async login(dto: LoginDto) {
    const { nickName, password } = dto;
    const user = await this.userRepo.findOne({ where: { nickName } });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const response = this.getAuthResponse(user);
    return response
  }

  async validateUser(nickName: string, pass: string): Promise<any> {
    const user = await this.userRepo.findOne({ where: { nickName } });
    if (user && await bcrypt.compare(pass, user.password)) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async checkAuthStatus(token?: string): Promise<AuthStatusDto> {
    // Если токена нет - пользователь не регистрировался
    if (!token) {
      return {
        status: 'not_registered',
        message: 'No token found',
        user: undefined,
      };
    }

    try {
      // Проверяем валидность токена
      const payload = this.jwtService.verify(token, {
        secret: this.configService.get('JWT_SECRET'),
      });

      // Токен валидный - получаем данные пользователя
      const user = await this.userRepo.findOne({
        where: { id: payload.sub },
        select: ['id', 'nickName', 'email'],
      });

      if (!user) {
        // Пользователь не найден в БД
        return {
          status: 'not_registered',
          message: 'User not found',
          user: undefined,
        };
      }

      return {
        status: 'authenticated',
        message: 'User authenticated',
        user: user,
      };
    } catch (error) {
      // Любая ошибка токена = нужно войти заново
      return {
        status: 'token_expired',
        message: 'Token invalid or expired',
        user: undefined,
      };
    }
  }
}