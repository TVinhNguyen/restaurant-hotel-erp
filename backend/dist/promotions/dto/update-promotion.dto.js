"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdatePromotionDto = void 0;
const mapped_types_1 = require("@nestjs/mapped-types");
const create_promotion_dto_1 = require("./create-promotion.dto");
class UpdatePromotionDto extends (0, mapped_types_1.PartialType)(create_promotion_dto_1.CreatePromotionDto) {
}
exports.UpdatePromotionDto = UpdatePromotionDto;
//# sourceMappingURL=update-promotion.dto.js.map