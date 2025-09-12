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
exports.RoomTypesController = void 0;
const common_1 = require("@nestjs/common");
const passport_1 = require("@nestjs/passport");
const room_types_service_1 = require("./room-types.service");
const create_room_type_dto_1 = require("./dto/create-room-type.dto");
const update_room_type_dto_1 = require("./dto/update-room-type.dto");
let RoomTypesController = class RoomTypesController {
    roomTypesService;
    constructor(roomTypesService) {
        this.roomTypesService = roomTypesService;
    }
    async findAll(query) {
        return await this.roomTypesService.findAll(query);
    }
    async findOne(id) {
        return await this.roomTypesService.findOne(id);
    }
    async create(createRoomTypeDto) {
        return await this.roomTypesService.create(createRoomTypeDto);
    }
    async update(id, updateRoomTypeDto) {
        return await this.roomTypesService.update(id, updateRoomTypeDto);
    }
    async remove(id) {
        await this.roomTypesService.remove(id);
        return { message: 'Room type deleted successfully' };
    }
    async addAmenity(roomTypeId, addAmenityDto) {
        return await this.roomTypesService.addAmenity(roomTypeId, addAmenityDto.amenityId);
    }
    async removeAmenity(roomTypeId, amenityId) {
        await this.roomTypesService.removeAmenity(roomTypeId, amenityId);
        return { message: 'Amenity removed from room type successfully' };
    }
    async addMultipleAmenities(roomTypeId, bulkAddDto) {
        return await this.roomTypesService.addMultipleAmenities(roomTypeId, bulkAddDto.amenityIds);
    }
};
exports.RoomTypesController = RoomTypesController;
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_room_type_dto_1.RoomTypeQueryDto]),
    __metadata("design:returntype", Promise)
], RoomTypesController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], RoomTypesController.prototype, "findOne", null);
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_room_type_dto_1.CreateRoomTypeDto]),
    __metadata("design:returntype", Promise)
], RoomTypesController.prototype, "create", null);
__decorate([
    (0, common_1.Put)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_room_type_dto_1.UpdateRoomTypeDto]),
    __metadata("design:returntype", Promise)
], RoomTypesController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], RoomTypesController.prototype, "remove", null);
__decorate([
    (0, common_1.Post)(':id/amenities'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, create_room_type_dto_1.AddAmenityToRoomTypeDto]),
    __metadata("design:returntype", Promise)
], RoomTypesController.prototype, "addAmenity", null);
__decorate([
    (0, common_1.Delete)(':roomTypeId/amenities/:amenityId'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Param)('roomTypeId')),
    __param(1, (0, common_1.Param)('amenityId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], RoomTypesController.prototype, "removeAmenity", null);
__decorate([
    (0, common_1.Post)(':id/amenities/bulk'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, create_room_type_dto_1.BulkAddAmenitiesToRoomTypeDto]),
    __metadata("design:returntype", Promise)
], RoomTypesController.prototype, "addMultipleAmenities", null);
exports.RoomTypesController = RoomTypesController = __decorate([
    (0, common_1.Controller)('room-types'),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt')),
    __metadata("design:paramtypes", [room_types_service_1.RoomTypesService])
], RoomTypesController);
//# sourceMappingURL=room-types.controller.js.map