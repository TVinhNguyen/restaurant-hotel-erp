"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var AuthService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const jwt_1 = require("@nestjs/jwt");
const typeorm_2 = require("typeorm");
const bcrypt = __importStar(require("bcryptjs"));
const user_entity_1 = require("../entities/auth/user.entity");
let AuthService = AuthService_1 = class AuthService {
    userRepository;
    jwtService;
    logger = new common_1.Logger(AuthService_1.name);
    constructor(userRepository, jwtService) {
        this.userRepository = userRepository;
        this.jwtService = jwtService;
    }
    async register(registerDto) {
        const { email, password, name, phone } = registerDto;
        try {
            const existingUser = await this.userRepository.findOne({
                where: { email: email.toLowerCase() },
            });
            if (existingUser) {
                throw new common_1.ConflictException('An account with this email already exists');
            }
            const saltRounds = 12;
            const passwordHash = await bcrypt.hash(password, saltRounds);
            const user = this.userRepository.create({
                email: email.toLowerCase(),
                passwordHash,
                name: name?.trim(),
                phone: phone?.trim(),
            });
            const savedUser = await this.userRepository.save(user);
            this.logger.log(`New user registered: ${savedUser.email}`);
            const { passwordHash: _, ...result } = savedUser;
            return result;
        }
        catch (error) {
            if (error instanceof common_1.ConflictException) {
                throw error;
            }
            this.logger.error(`Registration failed for email: ${email}`, error.stack);
            throw new Error('Registration failed. Please try again.');
        }
    }
    async validateUser(email, password) {
        try {
            const user = await this.userRepository.findOne({
                where: { email: email.toLowerCase() },
            });
            if (!user) {
                await bcrypt.hash('dummy-password', 12);
                return null;
            }
            const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
            if (!isPasswordValid) {
                this.logger.warn(`Failed login attempt for email: ${email}`);
                return null;
            }
            this.logger.log(`Successful login for user: ${user.email}`);
            const { passwordHash, ...result } = user;
            return result;
        }
        catch (error) {
            this.logger.error(`Validation error for email: ${email}`, error.stack);
            return null;
        }
    }
    login(user) {
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
        }
        catch (error) {
            this.logger.error(`Login failed for user: ${user.email}`, error.stack);
            throw new common_1.UnauthorizedException('Login failed');
        }
    }
    refreshToken(user) {
        try {
            const payload = { email: user.email, sub: user.id };
            const access_token = this.jwtService.sign(payload);
            this.logger.log(`Token refreshed for user: ${user.email}`);
            return {
                access_token,
                expires_in: '24h',
                token_type: 'Bearer',
            };
        }
        catch (error) {
            this.logger.error(`Token refresh failed for user: ${user.email}`, error.stack);
            throw new common_1.UnauthorizedException('Token refresh failed');
        }
    }
    async findById(id) {
        try {
            return await this.userRepository.findOne({ where: { id } });
        }
        catch (error) {
            this.logger.error(`Find user by ID failed: ${id}`, error.stack);
            return null;
        }
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = AuthService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        jwt_1.JwtService])
], AuthService);
//# sourceMappingURL=auth.service.js.map