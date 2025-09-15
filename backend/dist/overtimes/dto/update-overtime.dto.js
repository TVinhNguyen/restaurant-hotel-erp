"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateOvertimeDto = void 0;
const mapped_types_1 = require("@nestjs/mapped-types");
const create_overtime_dto_1 = require("./create-overtime.dto");
class UpdateOvertimeDto extends (0, mapped_types_1.PartialType)(create_overtime_dto_1.CreateOvertimeDto) {
}
exports.UpdateOvertimeDto = UpdateOvertimeDto;
//# sourceMappingURL=update-overtime.dto.js.map