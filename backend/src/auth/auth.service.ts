import { Injectable, ConflictException, UnauthorizedException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { User } from '../entities/auth/user.entity';
import { RegisterDto } from './dto/register.dto';
import { UserPayload } from './interfaces/user.interface';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private jwtService: JwtService,
  ) {}

  async register(registerDto: RegisterDto) {
    const { email, password, name, phone } = registerDto;

    try {
      // Check if user exists
      const existingUser = await this.userRepository.findOne({
        where: { email: email.toLowerCase() },
      });
      
      if (existingUser) {
        throw new ConflictException('An account with this email already exists');
      }

      // Hash password with higher salt rounds for better security
      const saltRounds = 12;
      const passwordHash = await bcrypt.hash(password, saltRounds);

      // Create user with normalized email
      const user = this.userRepository.create({
        email: email.toLowerCase(),
        passwordHash,
        name: name?.trim(),
        phone: phone?.trim(),
      });

      const savedUser = await this.userRepository.save(user);

      this.logger.log(`New user registered: ${savedUser.email}`);

      // Remove password from response
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { passwordHash: _, ...result } = savedUser;
      return result;
    } catch (error) {
      if (error instanceof ConflictException) {
        throw error;
      }
      this.logger.error(`Registration failed for email: ${email}`, error.stack);
      throw new Error('Registration failed. Please try again.');
    }
  }

  async validateUser(
    email: string,
    password: string,
  ): Promise<UserPayload | null> {
    try {
      const user = await this.userRepository.findOne({ 
        where: { email: email.toLowerCase() },
      });
      
      if (!user) {
        // Add delay to prevent timing attacks
        await bcrypt.hash('dummy-password', 12);
        return null;
      }

      const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
      
      if (!isPasswordValid) {
        this.logger.warn(`Failed login attempt for email: ${email}`);
        return null;
      }

      this.logger.log(`Successful login for user: ${user.email}`);

      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { passwordHash, ...result } = user;
      return result;
    } catch (error) {
      this.logger.error(`Validation error for email: ${email}`, error.stack);
      return null;
    }
  }

  login(user: UserPayload) {
    try {
      const payload = { email: user.email, sub: user.id };
      const access_token = this.jwtService.sign(payload);
      
      this.logger.log(`Token generated for user: ${user.email}`);
      
      return {
        access_token,
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          phone: user.phone,
        },
        expires_in: '24h',
        token_type: 'Bearer',
      };
    } catch (error) {
      this.logger.error(`Login failed for user: ${user.email}`, error.stack);
      throw new UnauthorizedException('Login failed');
    }
  }

  refreshToken(user: UserPayload) {
    try {
      const payload = { email: user.email, sub: user.id };
      const access_token = this.jwtService.sign(payload);
      
      this.logger.log(`Token refreshed for user: ${user.email}`);
      
      return {
        access_token,
        expires_in: '24h',
        token_type: 'Bearer',
      };
    } catch (error) {
      this.logger.error(`Token refresh failed for user: ${user.email}`, error.stack);
      throw new UnauthorizedException('Token refresh failed');
    }
  }

  async findById(id: string): Promise<User | null> {
    try {
      return await this.userRepository.findOne({ where: { id } });
    } catch (error) {
      this.logger.error(`Find user by ID failed: ${id}`, error.stack);
      return null;
    }
  }
}
