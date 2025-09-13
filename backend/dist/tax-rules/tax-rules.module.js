"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TaxRulesModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const tax_rules_controller_1 = require("./tax-rules.controller");
const tax_rules_service_1 = require("./tax-rules.service");
const tax_rule_entity_1 = require("../entities/reservation/tax-rule.entity");
let TaxRulesModule = class TaxRulesModule {
};
exports.TaxRulesModule = TaxRulesModule;
exports.TaxRulesModule = TaxRulesModule = __decorate([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([tax_rule_entity_1.TaxRule])],
        controllers: [tax_rules_controller_1.TaxRulesController],
        providers: [tax_rules_service_1.TaxRulesService],
        exports: [tax_rules_service_1.TaxRulesService],
    })
], TaxRulesModule);
//# sourceMappingURL=tax-rules.module.js.map