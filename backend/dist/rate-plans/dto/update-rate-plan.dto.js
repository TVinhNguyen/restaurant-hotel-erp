"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateRatePlanDto = void 0;
const mapped_types_1 = require("@nestjs/mapped-types");
const create_rate_plan_dto_1 = require("./create-rate-plan.dto");
class UpdateRatePlanDto extends (0, mapped_types_1.PartialType)(create_rate_plan_dto_1.CreateRatePlanDto) {
}
exports.UpdateRatePlanDto = UpdateRatePlanDto;
//# sourceMappingURL=update-rate-plan.dto.js.map