import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import type { AuthRequest } from './interfaces/user.interface';
export declare class AuthController {
    private authService;
    constructor(authService: AuthService);
    register(registerDto: RegisterDto): Promise<{
        id: string;
        email: string;
        name: string;
        phone: string;
        createdAt: Date;
        updatedAt: Date;
    }>;
    login(req: AuthRequest): {
        access_token: string;
        user: {
            id: string;
            email: string;
            name: string | undefined;
            phone: string | undefined;
        };
    };
    logout(): {
        message: string;
    };
    refresh(req: AuthRequest): {
        access_token: string;
    };
    getProfile(req: AuthRequest): {
        id: string;
        email: string;
        name?: string;
        phone?: string;
    };
}
