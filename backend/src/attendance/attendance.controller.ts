import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  ParseUUIDPipe,
  ParseIntPipe,
  UseGuards
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AttendanceService } from './attendance.service';
import {
  CreateAttendanceDto,
  BulkAttendanceDto,
  AttendanceStatus
} from './dto/create-attendance.dto';
import { UpdateAttendanceDto } from './dto/update-attendance.dto';

@Controller('attendance')
@UseGuards(AuthGuard('jwt'))
export class AttendanceController {
  constructor(private readonly attendanceService: AttendanceService) {}

  @Post()
  async createAttendance(@Body() createAttendanceDto: CreateAttendanceDto) {
    return this.attendanceService.createAttendance(createAttendanceDto);
  }

  @Post('bulk')
  async bulkCreateAttendance(@Body() bulkAttendanceDto: BulkAttendanceDto) {
    return this.attendanceService.bulkCreateAttendance(bulkAttendanceDto);
  }

  @Get()
  async findAllAttendance(
    @Query('page') pageParam?: string,
    @Query('limit') limitParam?: string,
    @Query('employeeId') employeeId?: string,
    @Query('date') date?: string,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string
  ) {
    const page = pageParam ? parseInt(pageParam, 10) : 1;
    const limit = limitParam ? parseInt(limitParam, 10) : 10;

    return this.attendanceService.findAllAttendance(
      page,
      limit,
      employeeId,
      date,
      startDate,
      endDate
    );
  }

  @Get('summary')
  async getAttendanceSummary(
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
    @Query('employeeId') employeeId?: string
  ) {
    return this.attendanceService.getAttendanceSummary(
      startDate,
      endDate,
      employeeId
    );
  }

  @Get('daily/:date')
  async getDailyAttendanceReport(@Param('date') date: string) {
    return this.attendanceService.getDailyAttendanceReport(date);
  }

  @Get(':id')
  async findAttendanceById(@Param('id', ParseUUIDPipe) id: string) {
    return this.attendanceService.findAttendanceById(id);
  }

  @Put(':id')
  async updateAttendance(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateAttendanceDto: UpdateAttendanceDto
  ) {
    return this.attendanceService.updateAttendance(id, updateAttendanceDto);
  }

  @Delete(':id')
  async deleteAttendance(@Param('id', ParseUUIDPipe) id: string) {
    await this.attendanceService.deleteAttendance(id);
    return { message: 'Attendance record deleted successfully' };
  }

  @Post('check-in/:employeeId')
  async checkIn(@Param('employeeId', ParseUUIDPipe) employeeId: string) {
    return this.attendanceService.checkIn(employeeId);
  }

  @Post('check-out/:employeeId')
  async checkOut(@Param('employeeId', ParseUUIDPipe) employeeId: string) {
    return this.attendanceService.checkOut(employeeId);
  }
}
