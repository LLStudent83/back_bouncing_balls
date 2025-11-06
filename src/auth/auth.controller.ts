import { Controller, Post, Body, UseGuards, Res, Get, Req } from '@nestjs/common';
import type { Response, Request } from 'express';
import { AuthService } from './auth.service';
import { RegisterDto, LoginDto, AuthStatusDto } from './dto/auth.dto';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { LocalAuthGuard } from './guards/local-auth.guard';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  @ApiOperation({ summary: 'Register user' })
  @ApiResponse({ status: 201, description: 'User created' })
  async register(@Body() dto: RegisterDto, @Res({ passthrough: true }) res: Response) {

const result = await this.authService.register(dto);

 res.cookie('access_token', result.access_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 24 * 60 * 60 * 1000 * 7,  // неделя
    });

    return {...result.user};
  }

  @UseGuards(LocalAuthGuard)
  @Post('login')
  @ApiOperation({ summary: 'Login' })
  @ApiResponse({ status: 200, description: 'Token issued' })

  async login(@Body() dto: LoginDto, @Res({ passthrough: true }) res: Response) {
    const result = await this.authService.login(dto); 

    res.cookie('access_token', result.access_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 24 * 60 * 60 * 1000 * 7,  // неделя
    });

    return {...result.user };
  }

  @Get('check-status')
  @ApiOperation({ summary: 'Check user authentication status' })
  @ApiResponse({ status: 200, description: 'Returns user authentication status' })
  async checkStatus(@Req() req: Request): Promise<AuthStatusDto> {
    // Получаем токен из cookie
    const token = req.cookies?.access_token;
    
    return this.authService.checkAuthStatus(token);
  }
}