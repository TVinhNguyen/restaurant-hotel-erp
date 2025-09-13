export interface UserPayload {
    id: string;
    email: string;
    name?: string;
    phone?: string;
}
export interface JwtPayload {
    sub: string;
    email: string;
}
export interface AuthRequest extends Request {
    user: UserPayload & {
        passwordHash?: string;
    };
}
