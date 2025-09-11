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
exports.ServicesController = void 0;
const common_1 = require("@nestjs/common");
const passport_1 = require("@nestjs/passport");
const services_service_1 = require("./services.service");
const create_property_service_dto_1 = require("./dto/create-property-service.dto");
const update_property_service_dto_1 = require("./dto/update-property-service.dto");
let ServicesController = class ServicesController {
    servicesService;
    constructor(servicesService) {
        this.servicesService = servicesService;
    }
    async findAllServices(page, limit, category) {
        const pageNum = page ? parseInt(page, 10) : 1;
        const limitNum = limit ? parseInt(limit, 10) : 10;
        return await this.servicesService.findAllServices({
            page: pageNum,
            limit: limitNum,
            category,
        });
    }
    async findAllPropertyServices(page, limit, propertyId, isActive) {
        const pageNum = page ? parseInt(page, 10) : 1;
        const limitNum = limit ? parseInt(limit, 10) : 10;
        const isActiveBool = isActive !== undefined ? isActive === 'true' : undefined;
        return await this.servicesService.findAllPropertyServices({
            page: pageNum,
            limit: limitNum,
            propertyId,
            isActive: isActiveBool,
        });
    }
    async findOnePropertyService(id) {
        return await this.servicesService.findOnePropertyService(id);
    }
    async createPropertyService(createPropertyServiceDto) {
        return await this.servicesService.createPropertyService(createPropertyServiceDto);
    }
    async updatePropertyService(id, updatePropertyServiceDto) {
        return await this.servicesService.updatePropertyService(id, updatePropertyServiceDto);
    }
    async removePropertyService(id) {
        await this.servicesService.removePropertyService(id);
        return { message: 'Property service deleted successfully' };
    }
};
exports.ServicesController = ServicesController;
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)('page')),
    __param(1, (0, common_1.Query)('limit')),
    __param(2, (0, common_1.Query)('category')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String]),
    __metadata("design:returntype", Promise)
], ServicesController.prototype, "findAllServices", null);
__decorate([
    (0, common_1.Get)('property-services'),
    __param(0, (0, common_1.Query)('page')),
    __param(1, (0, common_1.Query)('limit')),
    __param(2, (0, common_1.Query)('propertyId')),
    __param(3, (0, common_1.Query)('isActive')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, String]),
    __metadata("design:returntype", Promise)
], ServicesController.prototype, "findAllPropertyServices", null);
__decorate([
    (0, common_1.Get)('property-services/:id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ServicesController.prototype, "findOnePropertyService", null);
__decorate([
    (0, common_1.Post)('property-services'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_property_service_dto_1.CreatePropertyServiceDto]),
    __metadata("design:returntype", Promise)
], ServicesController.prototype, "createPropertyService", null);
__decorate([
    (0, common_1.Put)('property-services/:id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_property_service_dto_1.UpdatePropertyServiceDto]),
    __metadata("design:returntype", Promise)
], ServicesController.prototype, "updatePropertyService", null);
__decorate([
    (0, common_1.Delete)('property-services/:id'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ServicesController.prototype, "removePropertyService", null);
exports.ServicesController = ServicesController = __decorate([
    (0, common_1.Controller)('services'),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt')),
    __metadata("design:paramtypes", [services_service_1.ServicesService])
], ServicesController);
//# sourceMappingURL=services.controller.js.map