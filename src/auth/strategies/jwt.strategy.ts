
// src/auth/jwt.strategy.ts (обновление)
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(configService: ConfigService) {  // Изменение: инжектим ConfigService
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get('JWT_SECRET'),  // Изменение: берём из env через Config
    });
  }

  async validate(payload: any) {
    return { userId: payload.sub, nickname: payload.nickname };  // Изменение: под твою payload из login (sub=id, nickname)
  }
}
