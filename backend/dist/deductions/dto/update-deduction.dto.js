"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateDeductionDto = void 0;
const mapped_types_1 = require("@nestjs/mapped-types");
const create_deduction_dto_1 = require("./create-deduction.dto");
class UpdateDeductionDto extends (0, mapped_types_1.PartialType)(create_deduction_dto_1.CreateDeductionDto) {
}
exports.UpdateDeductionDto = UpdateDeductionDto;
//# sourceMappingURL=update-deduction.dto.js.map