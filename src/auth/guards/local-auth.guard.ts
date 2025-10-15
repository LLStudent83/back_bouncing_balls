import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class LocalAuthGuard extends AuthGuard('local') {  // Изменение: extends AuthGuard с 'local' — это подключает LocalStrategy для валидации username/password
  // Опционально: можно переопределить handleRequest для кастомной обработки ошибок
  // handleRequest(err, user, info) {
  //   if (err || !user) {
  //     throw err || new UnauthorizedException();
  //   }
  //   return user;
  // }
}
