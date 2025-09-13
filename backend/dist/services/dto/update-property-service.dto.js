"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdatePropertyServiceDto = void 0;
const mapped_types_1 = require("@nestjs/mapped-types");
const create_property_service_dto_1 = require("./create-property-service.dto");
class UpdatePropertyServiceDto extends (0, mapped_types_1.PartialType)(create_property_service_dto_1.CreatePropertyServiceDto) {
}
exports.UpdatePropertyServiceDto = UpdatePropertyServiceDto;
//# sourceMappingURL=update-property-service.dto.js.map