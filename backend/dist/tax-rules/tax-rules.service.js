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
exports.TaxRulesService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const tax_rule_entity_1 = require("../entities/reservation/tax-rule.entity");
let TaxRulesService = class TaxRulesService {
    taxRuleRepository;
    constructor(taxRuleRepository) {
        this.taxRuleRepository = taxRuleRepository;
    }
    async findAll(query) {
        const { page = 1, limit = 10, propertyId, type } = query;
        const skip = (page - 1) * limit;
        const queryBuilder = this.taxRuleRepository.createQueryBuilder('taxRule')
            .leftJoinAndSelect('taxRule.property', 'property');
        if (propertyId) {
            queryBuilder.andWhere('taxRule.propertyId = :propertyId', { propertyId });
        }
        if (type) {
            queryBuilder.andWhere('taxRule.taxName = :type', { type });
        }
        const [data, total] = await queryBuilder
            .orderBy('taxRule.taxName', 'ASC')
            .addOrderBy('taxRule.taxRate', 'ASC')
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
        const taxRule = await this.taxRuleRepository.findOne({
            where: { id },
            relations: ['property'],
        });
        if (!taxRule) {
            throw new common_1.NotFoundException(`Tax rule with ID ${id} not found`);
        }
        return taxRule;
    }
    async create(createTaxRuleDto) {
        const taxRule = this.taxRuleRepository.create(createTaxRuleDto);
        return await this.taxRuleRepository.save(taxRule);
    }
    async update(id, updateTaxRuleDto) {
        const taxRule = await this.findOne(id);
        Object.assign(taxRule, updateTaxRuleDto);
        return await this.taxRuleRepository.save(taxRule);
    }
    async remove(id) {
        const taxRule = await this.findOne(id);
        await this.taxRuleRepository.remove(taxRule);
    }
    async findByProperty(propertyId) {
        return await this.taxRuleRepository.find({
            where: { propertyId },
            order: { taxName: 'ASC', taxRate: 'ASC' },
        });
    }
    async calculateTax(amount, propertyId, taxType) {
        const taxRules = await this.findByProperty(propertyId);
        let vatAmount = 0;
        let serviceAmount = 0;
        const breakdown = [];
        for (const taxRule of taxRules) {
            if (taxType && taxRule.taxName !== taxType)
                continue;
            const taxAmount = (amount * taxRule.taxRate) / 100;
            if (taxRule.taxName === 'VAT') {
                vatAmount += taxAmount;
            }
            else if (taxRule.taxName === 'service') {
                serviceAmount += taxAmount;
            }
            breakdown.push({
                type: taxRule.taxName,
                rate: taxRule.taxRate,
                amount: taxAmount,
            });
        }
        return {
            vatAmount,
            serviceAmount,
            totalTax: vatAmount + serviceAmount,
            breakdown,
        };
    }
};
exports.TaxRulesService = TaxRulesService;
exports.TaxRulesService = TaxRulesService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(tax_rule_entity_1.TaxRule)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], TaxRulesService);
//# sourceMappingURL=tax-rules.service.js.map