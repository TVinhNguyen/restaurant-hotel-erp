import { JwtService } from '@nestjs/jwt';
import { Repository } from 'typeorm';
import { User } from '../entities/auth/user.entity';
import { RegisterDto } from './dto/register.dto';
import { UserPayload } from './interfaces/user.interface';
export declare class AuthService {
    private userRepository;
    private jwtService;
    private readonly logger;
    constructor(userRepository: Repository<User>, jwtService: JwtService);
    register(registerDto: RegisterDto): Promise<{
        id: string;
        email: string;
        name: string;
        phone: string;
        createdAt: Date;
        updatedAt: Date;
        employee: import("../entities").Employee;
    }>;
    validateUser(email: string, password: string): Promise<UserPayload | null>;
    login(user: UserPayload): {
        access_token: string;
        user: {
            id: string;
            email: string;
            name: string | undefined;
            phone: string | undefined;
        };
        expires_in: string;
        token_type: string;
    };
    refreshToken(user: UserPayload): {
        access_token: string;
        expires_in: string;
        token_type: string;
    };
    findById(id: string): Promise<User | null>;
}
