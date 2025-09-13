"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateTaxRuleDto = void 0;
const mapped_types_1 = require("@nestjs/mapped-types");
const create_tax_rule_dto_1 = require("./create-tax-rule.dto");
class UpdateTaxRuleDto extends (0, mapped_types_1.PartialType)(create_tax_rule_dto_1.CreateTaxRuleDto) {
}
exports.UpdateTaxRuleDto = UpdateTaxRuleDto;
//# sourceMappingURL=update-tax-rule.dto.js.map