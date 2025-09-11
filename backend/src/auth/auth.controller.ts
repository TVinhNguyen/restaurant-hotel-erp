import {
  Controller,
  Post,
  Get,
  Body,
  UseGuards,
  Request,
  HttpCode,
  HttpStatus,
  UnauthorizedException,
  Logger,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import type { AuthRequest } from './interfaces/user.interface';

@Controller('auth')
export class AuthController {
  private readonly logger = new Logger(AuthController.name);

  constructor(private authService: AuthService) {}

  @Post('register')
  async register(@Body() registerDto: RegisterDto) {
    this.logger.log(`Registration attempt for email: ${registerDto.email}`);
    const result = await this.authService.register(registerDto);
    return {
      message: 'Registration successful',
      user: result,
    };
  }

  @UseGuards(AuthGuard('local'))
  @Post('login')
  @HttpCode(HttpStatus.OK)
  login(@Request() req: AuthRequest) {
    this.logger.log(`Login successful for user: ${req.user.email}`);
    const result = this.authService.login(req.user);
    return {
      message: 'Login successful',
      ...result,
    };
  }

  @Post('logout')
  @HttpCode(HttpStatus.OK)
  logout() {
    return { 
      message: 'Logout successful',
      timestamp: new Date().toISOString(),
    };
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  refresh(@Request() req: AuthRequest) {
    if (!req.user) {
      throw new UnauthorizedException('Invalid token');
    }
    const result = this.authService.refreshToken(req.user);
    return {
      message: 'Token refreshed successfully',
      ...result,
    };
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('me')
  getProfile(@Request() req: AuthRequest) {
    if (!req.user) {
      throw new UnauthorizedException('Invalid token');
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { passwordHash, ...user } = req.user;
    return {
      message: 'Profile retrieved successfully',
      user,
    };
  }
}
