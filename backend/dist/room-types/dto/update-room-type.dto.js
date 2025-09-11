"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateRoomTypeDto = void 0;
const mapped_types_1 = require("@nestjs/mapped-types");
const create_room_type_dto_1 = require("./create-room-type.dto");
class UpdateRoomTypeDto extends (0, mapped_types_1.PartialType)(create_room_type_dto_1.CreateRoomTypeDto) {
}
exports.UpdateRoomTypeDto = UpdateRoomTypeDto;
//# sourceMappingURL=update-room-type.dto.js.map