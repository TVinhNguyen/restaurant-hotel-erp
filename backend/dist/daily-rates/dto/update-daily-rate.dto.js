"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateDailyRateDto = void 0;
const mapped_types_1 = require("@nestjs/mapped-types");
const create_daily_rate_dto_1 = require("./create-daily-rate.dto");
class UpdateDailyRateDto extends (0, mapped_types_1.PartialType)(create_daily_rate_dto_1.CreateDailyRateDto) {
}
exports.UpdateDailyRateDto = UpdateDailyRateDto;
//# sourceMappingURL=update-daily-rate.dto.js.map