"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateReservationServiceDto = void 0;
const mapped_types_1 = require("@nestjs/mapped-types");
const create_reservation_service_dto_1 = require("./create-reservation-service.dto");
class UpdateReservationServiceDto extends (0, mapped_types_1.PartialType)(create_reservation_service_dto_1.CreateReservationServiceDto) {
}
exports.UpdateReservationServiceDto = UpdateReservationServiceDto;
//# sourceMappingURL=update-reservation-service.dto.js.map