"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateGuestDto = void 0;
const mapped_types_1 = require("@nestjs/mapped-types");
const create_guest_dto_1 = require("./create-guest.dto");
class UpdateGuestDto extends (0, mapped_types_1.PartialType)(create_guest_dto_1.CreateGuestDto) {
}
exports.UpdateGuestDto = UpdateGuestDto;
//# sourceMappingURL=update-guest.dto.js.map