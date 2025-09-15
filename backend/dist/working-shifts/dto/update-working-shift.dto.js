"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateWorkingShiftDto = void 0;
const mapped_types_1 = require("@nestjs/mapped-types");
const create_working_shift_dto_1 = require("./create-working-shift.dto");
class UpdateWorkingShiftDto extends (0, mapped_types_1.PartialType)(create_working_shift_dto_1.CreateWorkingShiftDto) {
}
exports.UpdateWorkingShiftDto = UpdateWorkingShiftDto;
//# sourceMappingURL=update-working-shift.dto.js.map