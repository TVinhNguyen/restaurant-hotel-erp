"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OccupancyForecastQueryDto = exports.HousekeepingReportQueryDto = exports.ScheduleMaintenanceDto = exports.BulkUpdateRoomsStatusDto = exports.AvailableRoomsQueryDto = exports.RoomQueryDto = exports.UpdateRoomStatusDto = exports.CreateRoomDto = exports.HousekeepingStatus = exports.OperationalStatus = void 0;
const class_validator_1 = require("class-validator");
var OperationalStatus;
(function (OperationalStatus) {
    OperationalStatus["AVAILABLE"] = "available";
    OperationalStatus["OUT_OF_SERVICE"] = "out_of_service";
})(OperationalStatus || (exports.OperationalStatus = OperationalStatus = {}));
var HousekeepingStatus;
(function (HousekeepingStatus) {
    HousekeepingStatus["CLEAN"] = "clean";
    HousekeepingStatus["DIRTY"] = "dirty";
    HousekeepingStatus["INSPECTED"] = "inspected";
})(HousekeepingStatus || (exports.HousekeepingStatus = HousekeepingStatus = {}));
class CreateRoomDto {
    propertyId;
    roomTypeId;
    number;
    floor;
    viewType;
    operationalStatus = OperationalStatus.AVAILABLE;
    housekeepingStatus = HousekeepingStatus.CLEAN;
    housekeeperNotes;
}
exports.CreateRoomDto = CreateRoomDto;
__decorate([
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], CreateRoomDto.prototype, "propertyId", void 0);
__decorate([
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], CreateRoomDto.prototype, "roomTypeId", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateRoomDto.prototype, "number", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateRoomDto.prototype, "floor", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateRoomDto.prototype, "viewType", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(OperationalStatus),
    __metadata("design:type", String)
], CreateRoomDto.prototype, "operationalStatus", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(HousekeepingStatus),
    __metadata("design:type", String)
], CreateRoomDto.prototype, "housekeepingStatus", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateRoomDto.prototype, "housekeeperNotes", void 0);
class UpdateRoomStatusDto {
    operationalStatus;
    housekeepingStatus;
    notes;
    changedBy;
}
exports.UpdateRoomStatusDto = UpdateRoomStatusDto;
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(OperationalStatus),
    __metadata("design:type", String)
], UpdateRoomStatusDto.prototype, "operationalStatus", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(HousekeepingStatus),
    __metadata("design:type", String)
], UpdateRoomStatusDto.prototype, "housekeepingStatus", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateRoomStatusDto.prototype, "notes", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], UpdateRoomStatusDto.prototype, "changedBy", void 0);
class RoomQueryDto {
    propertyId;
    roomTypeId;
    floor;
    operationalStatus;
    housekeepingStatus;
    viewType;
    search;
    page = 1;
    limit = 10;
}
exports.RoomQueryDto = RoomQueryDto;
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], RoomQueryDto.prototype, "propertyId", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], RoomQueryDto.prototype, "roomTypeId", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], RoomQueryDto.prototype, "floor", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(OperationalStatus),
    __metadata("design:type", String)
], RoomQueryDto.prototype, "operationalStatus", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(HousekeepingStatus),
    __metadata("design:type", String)
], RoomQueryDto.prototype, "housekeepingStatus", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], RoomQueryDto.prototype, "viewType", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], RoomQueryDto.prototype, "search", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], RoomQueryDto.prototype, "page", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], RoomQueryDto.prototype, "limit", void 0);
class AvailableRoomsQueryDto {
    propertyId;
    roomTypeId;
    checkIn;
    checkOut;
    adults;
    children;
}
exports.AvailableRoomsQueryDto = AvailableRoomsQueryDto;
__decorate([
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], AvailableRoomsQueryDto.prototype, "propertyId", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], AvailableRoomsQueryDto.prototype, "roomTypeId", void 0);
__decorate([
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], AvailableRoomsQueryDto.prototype, "checkIn", void 0);
__decorate([
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], AvailableRoomsQueryDto.prototype, "checkOut", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], AvailableRoomsQueryDto.prototype, "adults", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], AvailableRoomsQueryDto.prototype, "children", void 0);
class BulkUpdateRoomsStatusDto {
    roomIds;
    operationalStatus;
    housekeepingStatus;
    notes;
    changedBy;
}
exports.BulkUpdateRoomsStatusDto = BulkUpdateRoomsStatusDto;
__decorate([
    (0, class_validator_1.IsUUID)('4', { each: true }),
    __metadata("design:type", Array)
], BulkUpdateRoomsStatusDto.prototype, "roomIds", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(OperationalStatus),
    __metadata("design:type", String)
], BulkUpdateRoomsStatusDto.prototype, "operationalStatus", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(HousekeepingStatus),
    __metadata("design:type", String)
], BulkUpdateRoomsStatusDto.prototype, "housekeepingStatus", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], BulkUpdateRoomsStatusDto.prototype, "notes", void 0);
__decorate([
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], BulkUpdateRoomsStatusDto.prototype, "changedBy", void 0);
class ScheduleMaintenanceDto {
    maintenanceType;
    scheduledDate;
    estimatedDurationHours;
    notes;
    assignedStaffId;
}
exports.ScheduleMaintenanceDto = ScheduleMaintenanceDto;
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], ScheduleMaintenanceDto.prototype, "maintenanceType", void 0);
__decorate([
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], ScheduleMaintenanceDto.prototype, "scheduledDate", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], ScheduleMaintenanceDto.prototype, "estimatedDurationHours", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], ScheduleMaintenanceDto.prototype, "notes", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], ScheduleMaintenanceDto.prototype, "assignedStaffId", void 0);
class HousekeepingReportQueryDto {
    propertyId;
    floor;
    date;
}
exports.HousekeepingReportQueryDto = HousekeepingReportQueryDto;
__decorate([
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], HousekeepingReportQueryDto.prototype, "propertyId", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], HousekeepingReportQueryDto.prototype, "floor", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], HousekeepingReportQueryDto.prototype, "date", void 0);
class OccupancyForecastQueryDto {
    propertyId;
    dateFrom;
    dateTo;
    roomTypeId;
}
exports.OccupancyForecastQueryDto = OccupancyForecastQueryDto;
__decorate([
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], OccupancyForecastQueryDto.prototype, "propertyId", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], OccupancyForecastQueryDto.prototype, "dateFrom", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], OccupancyForecastQueryDto.prototype, "dateTo", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], OccupancyForecastQueryDto.prototype, "roomTypeId", void 0);
//# sourceMappingURL=create-room.dto.js.map