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
Object.defineProperty(exports, "__esModule", { value: true });
exports.AmenityQueryDto = exports.UpdateAmenityDto = exports.CreateAmenityDto = exports.AmenityCategory = void 0;
const class_validator_1 = require("class-validator");
var AmenityCategory;
(function (AmenityCategory) {
    AmenityCategory["ROOM"] = "room";
    AmenityCategory["FACILITY"] = "facility";
})(AmenityCategory || (exports.AmenityCategory = AmenityCategory = {}));
class CreateAmenityDto {
    name;
    category;
}
exports.CreateAmenityDto = CreateAmenityDto;
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateAmenityDto.prototype, "name", void 0);
__decorate([
    (0, class_validator_1.IsEnum)(AmenityCategory),
    __metadata("design:type", String)
], CreateAmenityDto.prototype, "category", void 0);
class UpdateAmenityDto {
    name;
    category;
}
exports.UpdateAmenityDto = UpdateAmenityDto;
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateAmenityDto.prototype, "name", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(AmenityCategory),
    __metadata("design:type", String)
], UpdateAmenityDto.prototype, "category", void 0);
class AmenityQueryDto {
    category;
    search;
    page = 1;
    limit = 10;
}
exports.AmenityQueryDto = AmenityQueryDto;
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(AmenityCategory),
    __metadata("design:type", String)
], AmenityQueryDto.prototype, "category", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], AmenityQueryDto.prototype, "search", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], AmenityQueryDto.prototype, "page", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], AmenityQueryDto.prototype, "limit", void 0);
//# sourceMappingURL=amenity.dto.js.map