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
import { LeaveService } from './leave.service';
import {
  CreateLeaveDto,
  UpdateLeaveDto,
  ApproveRejectLeaveDto,
  LeaveType,
  LeaveStatus
} from './dto/create-leave.dto';

@Controller('leaves')
@UseGuards(AuthGuard('jwt'))
export class LeaveController {
  constructor(private readonly leaveService: LeaveService) {}

  @Post()
  async createLeave(@Body() createLeaveDto: CreateLeaveDto) {
    return this.leaveService.createLeave(createLeaveDto);
  }

  @Get()
  async findAllLeaves(
    @Query('page', ParseIntPipe) page: number = 1,
    @Query('limit', ParseIntPipe) limit: number = 10,
    @Query('employeeId') employeeId?: string,
    @Query('status') status?: LeaveStatus,
    @Query('leaveType') leaveType?: LeaveType,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string
  ) {
    return this.leaveService.findAllLeaves(
      page,
      limit,
      employeeId,
      status,
      leaveType,
      startDate,
      endDate
    );
  }

  @Get('pending')
  async getPendingLeaves() {
    return this.leaveService.getPendingLeaves();
  }

  @Get('by-employee/:employeeId')
  async getLeavesByEmployeeId(
    @Param('employeeId', ParseUUIDPipe) employeeId: string,
    @Query('period') period?: string
  ) {
    return this.leaveService.getLeavesByEmployeeId(employeeId, period);
  }

  @Get('summary')
  async getLeaveSummary(
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
    @Query('employeeId') employeeId?: string
  ) {
    return this.leaveService.getLeaveSummary(startDate, endDate, employeeId);
  }

  @Get('balance/:employeeId')
  async getEmployeeLeaveBalance(
    @Param('employeeId', ParseUUIDPipe) employeeId: string,
    @Query('year', ParseIntPipe) year?: number
  ) {
    return this.leaveService.getEmployeeLeaveBalance(employeeId, year);
  }

  @Get(':id')
  async findLeaveById(@Param('id', ParseUUIDPipe) id: string) {
    return this.leaveService.findLeaveById(id);
  }

  @Put(':id')
  async updateLeave(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateLeaveDto: UpdateLeaveDto
  ) {
    return this.leaveService.updateLeave(id, updateLeaveDto);
  }

  @Delete(':id')
  async deleteLeave(@Param('id', ParseUUIDPipe) id: string) {
    await this.leaveService.deleteLeave(id);
    return { message: 'Leave request deleted successfully' };
  }

  @Post(':id/approve-reject')
  async approveRejectLeave(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() approveRejectDto: ApproveRejectLeaveDto,
    @Query('approverId', ParseUUIDPipe) approverId: string
  ) {
    return this.leaveService.approveRejectLeave(
      id,
      approveRejectDto,
      approverId
    );
  }
}
