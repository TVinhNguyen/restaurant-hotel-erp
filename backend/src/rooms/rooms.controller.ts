import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { RoomsService } from './rooms.service';
import { 
  CreateRoomDto, 
  UpdateRoomStatusDto, 
  RoomQueryDto, 
  // AvailableRoomsQueryDto,
  // BulkUpdateRoomsStatusDto,
  // ScheduleMaintenanceDto,
  // HousekeepingReportQueryDto,
  // OccupancyForecastQueryDto
} from './dto/create-room.dto';
import { UpdateRoomDto } from './dto/update-room.dto';

@Controller('rooms')
@UseGuards(AuthGuard('jwt'))
export class RoomsController {
  constructor(private readonly roomsService: RoomsService) {}

  @Get()
  async findAll(@Query() query: RoomQueryDto) {
    return await this.roomsService.findAll(query);
  }

  // @Get('available')
  // async findAvailable(@Query() query: AvailableRoomsQueryDto) {
  //   return await this.roomsService.findAvailable(query);
  // }

  // @Get('housekeeping-report')
  // async getHousekeepingReport(@Query() query: HousekeepingReportQueryDto) {
  //   return await this.roomsService.getHousekeepingReport(query);
  // }

  // @Get('occupancy-forecast')
  // async getOccupancyForecast(@Query() query: OccupancyForecastQueryDto) {
  //   return await this.roomsService.getOccupancyForecast(query);
  // }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.roomsService.findOne(id);
  }

  // @Get(':id/status-history')
  // async getStatusHistory(
  //   @Param('id') id: string,
  //   @Query('statusType') statusType?: string,
  //   @Query('dateFrom') dateFrom?: string,
  //   @Query('dateTo') dateTo?: string,
  //   @Query('page') page?: string,
  //   @Query('limit') limit?: string,
  // ) {
  //   const pageNum = page ? parseInt(page, 10) : 1;
  //   const limitNum = limit ? parseInt(limit, 10) : 10;

  //   return await this.roomsService.getStatusHistory(id, {
  //     statusType,
  //     dateFrom,
  //     dateTo,
  //     page: pageNum,
  //     limit: limitNum,
  //   });
  // }

  @Post()
  async create(@Body() createRoomDto: CreateRoomDto) {
    return await this.roomsService.create(createRoomDto);
  }

  // @Post('bulk-status-update')
  // async bulkUpdateStatus(@Body() bulkUpdateDto: BulkUpdateRoomsStatusDto) {
  //   return await this.roomsService.bulkUpdateStatus(bulkUpdateDto);
  // }

  // @Post(':id/maintenance')
  // async scheduleMaintenance(
  //   @Param('id') id: string,
  //   @Body() maintenanceDto: ScheduleMaintenanceDto,
  // ) {
  //   return await this.roomsService.scheduleMaintenance(id, maintenanceDto);
  // }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updateRoomDto: UpdateRoomDto,
  ) {
    return await this.roomsService.update(id, updateRoomDto);
  }

  @Put(':id/status')
  async updateStatus(
    @Param('id') id: string,
    @Body() updateStatusDto: UpdateRoomStatusDto,
  ) {
    return await this.roomsService.updateStatus(id, updateStatusDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  async remove(@Param('id') id: string) {
    await this.roomsService.remove(id);
    return { message: 'Room deleted successfully' };
  }
}