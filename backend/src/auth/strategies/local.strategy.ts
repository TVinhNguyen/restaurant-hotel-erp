import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException, Logger } from '@nestjs/common';
import { AuthService } from '../auth.service';
import { UserPayload } from '../interfaces/user.interface';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  private readonly logger = new Logger(LocalStrategy.name);

  constructor(private authService: AuthService) {
    super({ 
      usernameField: 'email',
      passwordField: 'password',
    });
  }

  async validate(email: string, password: string): Promise<UserPayload> {
    if (!email || !password) {
      throw new UnauthorizedException('Email and password are required');
    }

    const user = await this.authService.validateUser(email, password);
    
    if (!user) {
      this.logger.warn(`Failed login attempt for email: ${email}`);
      throw new UnauthorizedException('Invalid email or password');
    }
    
    return user;
  }
}
