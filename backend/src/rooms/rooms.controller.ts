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

  // Static routes MUST come before dynamic routes (:id)
  @Get('status-history')
  async getAllStatusHistory(
    @Query('roomId') roomId?: string,
    @Query('propertyId') propertyId?: string,
    @Query('statusType') statusType?: string,
    @Query('dateFrom') dateFrom?: string,
    @Query('dateTo') dateTo?: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    const pageNum = page ? parseInt(page, 10) : 1;
    const limitNum = limit ? parseInt(limit, 10) : 100;

    return await this.roomsService.getAllStatusHistory({
      roomId,
      propertyId,
      statusType,
      dateFrom,
      dateTo,
      page: pageNum,
      limit: limitNum,
    });
  }

  @Get('maintenance')
  async getAllMaintenance(
    @Query('roomId') roomId?: string,
    @Query('propertyId') propertyId?: string,
    @Query('status') status?: string,
    @Query('priority') priority?: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    const pageNum = page ? parseInt(page, 10) : 1;
    const limitNum = limit ? parseInt(limit, 10) : 100;

    return await this.roomsService.getAllMaintenance({
      roomId,
      propertyId,
      status,
      priority,
      page: pageNum,
      limit: limitNum,
    });
  }

  // Dynamic route (:id) comes AFTER static routes
  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.roomsService.findOne(id);
  }

  @Post()
  async create(@Body() createRoomDto: CreateRoomDto) {
    return await this.roomsService.create(createRoomDto);
  }

  @Post('maintenance')
  async createMaintenance(@Body() createMaintenanceDto: any) {
    return await this.roomsService.createMaintenance(createMaintenanceDto);
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

  @Put('maintenance/:id')
  async updateMaintenance(
    @Param('id') id: string,
    @Body() updateMaintenanceDto: any,
  ) {
    return await this.roomsService.updateMaintenance(id, updateMaintenanceDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  async remove(@Param('id') id: string) {
    await this.roomsService.remove(id);
    return { message: 'Room deleted successfully' };
  }

  @Delete('maintenance/:id')
  @HttpCode(HttpStatus.OK)
  async deleteMaintenance(@Param('id') id: string) {
    await this.roomsService.deleteMaintenance(id);
    return { message: 'Maintenance request deleted successfully' };
  }
}