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
exports.TaxRulesController = void 0;
const common_1 = require("@nestjs/common");
const passport_1 = require("@nestjs/passport");
const tax_rules_service_1 = require("./tax-rules.service");
const create_tax_rule_dto_1 = require("./dto/create-tax-rule.dto");
const update_tax_rule_dto_1 = require("./dto/update-tax-rule.dto");
let TaxRulesController = class TaxRulesController {
    taxRulesService;
    constructor(taxRulesService) {
        this.taxRulesService = taxRulesService;
    }
    async findAll(page, limit, propertyId, type) {
        const pageNum = page ? parseInt(page, 10) : 1;
        const limitNum = limit ? parseInt(limit, 10) : 10;
        return await this.taxRulesService.findAll({
            page: pageNum,
            limit: limitNum,
            propertyId,
            type,
        });
    }
    async findOne(id) {
        return await this.taxRulesService.findOne(id);
    }
    async create(createTaxRuleDto) {
        return await this.taxRulesService.create(createTaxRuleDto);
    }
    async update(id, updateTaxRuleDto) {
        return await this.taxRulesService.update(id, updateTaxRuleDto);
    }
    async remove(id) {
        await this.taxRulesService.remove(id);
        return { message: 'Tax rule deleted successfully' };
    }
    async findByProperty(propertyId) {
        return await this.taxRulesService.findByProperty(propertyId);
    }
    async calculateTax(body) {
        return await this.taxRulesService.calculateTax(body.amount, body.propertyId, body.taxType);
    }
};
exports.TaxRulesController = TaxRulesController;
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)('page')),
    __param(1, (0, common_1.Query)('limit')),
    __param(2, (0, common_1.Query)('propertyId')),
    __param(3, (0, common_1.Query)('type')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, String]),
    __metadata("design:returntype", Promise)
], TaxRulesController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], TaxRulesController.prototype, "findOne", null);
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_tax_rule_dto_1.CreateTaxRuleDto]),
    __metadata("design:returntype", Promise)
], TaxRulesController.prototype, "create", null);
__decorate([
    (0, common_1.Put)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_tax_rule_dto_1.UpdateTaxRuleDto]),
    __metadata("design:returntype", Promise)
], TaxRulesController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], TaxRulesController.prototype, "remove", null);
__decorate([
    (0, common_1.Get)('property/:propertyId'),
    __param(0, (0, common_1.Param)('propertyId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], TaxRulesController.prototype, "findByProperty", null);
__decorate([
    (0, common_1.Post)('calculate'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], TaxRulesController.prototype, "calculateTax", null);
exports.TaxRulesController = TaxRulesController = __decorate([
    (0, common_1.Controller)('tax-rules'),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt')),
    __metadata("design:paramtypes", [tax_rules_service_1.TaxRulesService])
], TaxRulesController);
//# sourceMappingURL=tax-rules.controller.js.map