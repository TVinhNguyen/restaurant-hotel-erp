"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AmenitiesModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const amenities_service_1 = require("./amenities.service");
const amenities_controller_1 = require("./amenities.controller");
const amenity_entity_1 = require("../entities/inventory/amenity.entity");
let AmenitiesModule = class AmenitiesModule {
};
exports.AmenitiesModule = AmenitiesModule;
exports.AmenitiesModule = AmenitiesModule = __decorate([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([amenity_entity_1.Amenity])],
        controllers: [amenities_controller_1.AmenitiesController],
        providers: [amenities_service_1.AmenitiesService],
        exports: [amenities_service_1.AmenitiesService],
    })
], AmenitiesModule);
//# sourceMappingURL=amenities.module.js.map