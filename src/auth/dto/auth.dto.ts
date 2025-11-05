import { IsEmail, IsNotEmpty, IsString, MinLength, Matches, IsOptional } from 'class-validator';  // Изменение: добавил IsOptional
import { ApiProperty } from '@nestjs/swagger';

export class RegisterDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  nickName: string;

  @ApiProperty()
  @IsString()
  @MinLength(8)
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/, {
    message: 'Пароль: мин 8 символов, заглавная, строчная, цифра, спецсимвол',
  })
  password: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsEmail()
  email?: string;
}

export class LoginDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  nickName: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  password: string;
}

export class AuthStatusDto {
  @ApiProperty()
  status: 'authenticated' | 'token_expired' | 'not_registered';

  @ApiProperty()
  message: string;

  @ApiProperty({ required: false })
  user?: {
    id: number;
    nickName: string;
    email?: string;
  };
}