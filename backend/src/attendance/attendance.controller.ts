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
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { AttendanceService } from './attendance.service';
import {
  CreateAttendanceDto,
  BulkAttendanceDto,
  AttendanceStatus
} from './dto/create-attendance.dto';
import { UpdateAttendanceDto } from './dto/update-attendance.dto';

@ApiTags('Attendance')
@ApiBearerAuth('JWT-auth')
@Controller('attendance')
@UseGuards(AuthGuard('jwt'))
export class AttendanceController {
  constructor(private readonly attendanceService: AttendanceService) {}

  @Post()
  @ApiOperation({ summary: 'Create attendance record' })
  @ApiResponse({ status: 201, description: 'Attendance created successfully.' })
  async createAttendance(@Body() createAttendanceDto: CreateAttendanceDto) {
    return this.attendanceService.createAttendance(createAttendanceDto);
  }

  @Post('bulk')
  @ApiOperation({ summary: 'Bulk create attendance records' })
  @ApiResponse({ status: 201, description: 'Bulk attendance created successfully.' })
  async bulkCreateAttendance(@Body() bulkAttendanceDto: BulkAttendanceDto) {
    return this.attendanceService.bulkCreateAttendance(bulkAttendanceDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all attendance records' })
  @ApiResponse({ status: 200, description: 'Return all attendance records.' })
  async findAllAttendance(@Query() query?: any) {
    const page = query?.page ? parseInt(query.page, 10) : 1;
    const limit = query?.limit ? parseInt(query.limit, 10) : 10;

    return this.attendanceService.findAllAttendance(
      page,
      limit,
      query?.employeeId,
      query?.date,
      query?.startDate,
      query?.endDate
    );
  }

  @Get('get-all-attendances')
  @ApiOperation({ summary: 'Get all attendances without pagination' })
  @ApiResponse({ status: 200, description: 'Return all attendances.' })
  async getAllAttendances() {
    return this.attendanceService.getAllAttendances();
  }

  @Get('summary')
  @ApiOperation({ summary: 'Get attendance summary' })
  @ApiResponse({ status: 200, description: 'Return attendance summary.' })
  async getAttendanceSummary(@Query() query?: any) {
    return this.attendanceService.getAttendanceSummary(
      query?.startDate,
      query?.endDate,
      query?.employeeId
    );
  }

  @Get('daily/:date')
  @ApiOperation({ summary: 'Get daily attendance report' })
  @ApiResponse({ status: 200, description: 'Return daily report.' })
  async getDailyAttendanceReport(@Param('date') date: string) {
    return this.attendanceService.getDailyAttendanceReport(date);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get attendance by id' })
  @ApiResponse({ status: 200, description: 'Return the attendance record.' })
  @ApiResponse({ status: 404, description: 'Attendance not found.' })
  async findAttendanceById(@Param('id', ParseUUIDPipe) id: string) {
    return this.attendanceService.findAttendanceById(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update attendance record' })
  @ApiResponse({ status: 200, description: 'Attendance updated successfully.' })
  @ApiResponse({ status: 404, description: 'Attendance not found.' })
  async updateAttendance(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateAttendanceDto: UpdateAttendanceDto
  ) {
    return this.attendanceService.updateAttendance(id, updateAttendanceDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete attendance record' })
  @ApiResponse({ status: 200, description: 'Attendance deleted successfully.' })
  @ApiResponse({ status: 404, description: 'Attendance not found.' })
  async deleteAttendance(@Param('id', ParseUUIDPipe) id: string) {
    await this.attendanceService.deleteAttendance(id);
    return { message: 'Attendance record deleted successfully' };
  }

  @Post('check-in/:employeeId')
  @ApiOperation({ summary: 'Check-in employee' })
  @ApiResponse({ status: 201, description: 'Check-in successful.' })
  async checkIn(@Param('employeeId', ParseUUIDPipe) employeeId: string) {
    return this.attendanceService.checkIn(employeeId);
  }

  @Post('check-out/:employeeId')
  @ApiOperation({ summary: 'Check-out employee' })
  @ApiResponse({ status: 201, description: 'Check-out successful.' })
  async checkOut(@Param('employeeId', ParseUUIDPipe) employeeId: string) {
    return this.attendanceService.checkOut(employeeId);
  }
}
