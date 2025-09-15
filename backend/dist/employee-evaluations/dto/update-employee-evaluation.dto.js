"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateEmployeeEvaluationDto = void 0;
const mapped_types_1 = require("@nestjs/mapped-types");
const create_employee_evaluation_dto_1 = require("./create-employee-evaluation.dto");
class UpdateEmployeeEvaluationDto extends (0, mapped_types_1.PartialType)(create_employee_evaluation_dto_1.CreateEmployeeEvaluationDto) {
}
exports.UpdateEmployeeEvaluationDto = UpdateEmployeeEvaluationDto;
//# sourceMappingURL=update-employee-evaluation.dto.js.map