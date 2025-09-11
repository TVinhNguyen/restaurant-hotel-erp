"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GuestsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const guest_entity_1 = require("../entities/core/guest.entity");
let GuestsService = class GuestsService {
    guestRepository;
    constructor(guestRepository) {
        this.guestRepository = guestRepository;
    }
    async findAll(query) {
        const { page = 1, limit = 10, search } = query;
        const skip = (page - 1) * limit;
        const queryBuilder = this.guestRepository.createQueryBuilder('guest');
        if (search) {
            queryBuilder.where('(guest.name ILIKE :search OR guest.email ILIKE :search OR guest.phone ILIKE :search)', { search: `%${search}%` });
        }
        const [data, total] = await queryBuilder
            .orderBy('guest.name', 'ASC')
            .skip(skip)
            .take(limit)
            .getManyAndCount();
        return {
            data,
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit),
            hasNext: page * limit < total,
            hasPrev: page > 1,
        };
    }
    async findOne(id) {
        const guest = await this.guestRepository.findOne({
            where: { id },
            relations: ['reservations', 'tableBookings'],
        });
        if (!guest) {
            throw new common_1.NotFoundException(`Guest with ID ${id} not found`);
        }
        return guest;
    }
    async create(createGuestDto) {
        const guest = this.guestRepository.create(createGuestDto);
        return await this.guestRepository.save(guest);
    }
    async update(id, updateGuestDto) {
        const guest = await this.findOne(id);
        Object.assign(guest, updateGuestDto);
        return await this.guestRepository.save(guest);
    }
    async remove(id) {
        const guest = await this.findOne(id);
        await this.guestRepository.remove(guest);
    }
};
exports.GuestsService = GuestsService;
exports.GuestsService = GuestsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(guest_entity_1.Guest)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], GuestsService);
//# sourceMappingURL=guests.service.js.map