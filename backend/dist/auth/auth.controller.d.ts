import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import type { AuthRequest } from './interfaces/user.interface';
export declare class AuthController {
    private authService;
    private readonly logger;
    constructor(authService: AuthService);
    register(registerDto: RegisterDto): Promise<{
        message: string;
        user: {
            id: string;
            email: string;
            name: string;
            phone: string;
            createdAt: Date;
            updatedAt: Date;
            employee: import("../entities").Employee;
        };
    }>;
    login(req: AuthRequest): {
        access_token: string;
        user: {
            id: string;
            email: string;
            name: string | undefined;
            phone: string | undefined;
        };
        expires_in: string;
        token_type: string;
        message: string;
    };
    logout(): {
        message: string;
        timestamp: string;
    };
    refresh(req: AuthRequest): {
        access_token: string;
        expires_in: string;
        token_type: string;
        message: string;
    };
    getProfile(req: AuthRequest): {
        message: string;
        user: {
            id: string;
            email: string;
            name?: string;
            phone?: string;
        };
    };
}
