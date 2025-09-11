import { Strategy } from 'passport-local';
import { AuthService } from '../auth.service';
import { UserPayload } from '../interfaces/user.interface';
declare const LocalStrategy_base: new (...args: [] | [options: import("passport-local").IStrategyOptionsWithRequest] | [options: import("passport-local").IStrategyOptions]) => Strategy & {
    validate(...args: any[]): unknown;
};
export declare class LocalStrategy extends LocalStrategy_base {
    private authService;
    private readonly logger;
    constructor(authService: AuthService);
    validate(email: string, password: string): Promise<UserPayload>;
}
export {};
