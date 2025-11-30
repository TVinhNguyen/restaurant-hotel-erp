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
import { LeaveService } from './leave.service';
import {
  CreateLeaveDto,
  UpdateLeaveDto,
  ApproveRejectLeaveDto,
  LeaveType,
  LeaveStatus
} from './dto/create-leave.dto';

@ApiTags('Leaves')
@ApiBearerAuth('JWT-auth')
@Controller('leaves')
@UseGuards(AuthGuard('jwt'))
export class LeaveController {
  constructor(private readonly leaveService: LeaveService) {}

  @Post()
  @ApiOperation({ summary: 'Create leave request' })
  @ApiResponse({ status: 201, description: 'Leave request created successfully.' })
  async createLeave(@Body() createLeaveDto: CreateLeaveDto) {
    return this.leaveService.createLeave(createLeaveDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all leave requests' })
  @ApiResponse({ status: 200, description: 'Return all leave requests.' })
  async findAllLeaves(@Query() query?: any) {
    const page = query?.page ? parseInt(query.page, 10) : 1;
    const limit = query?.limit ? parseInt(query.limit, 10) : 10;

    return this.leaveService.findAllLeaves(
      page,
      limit,
      query?.employeeId,
      query?.status,
      query?.leaveType,
      query?.startDate,
      query?.endDate
    );
  }

  @Get('get-all-leaves')
  @ApiOperation({ summary: 'Get all leaves without pagination' })
  @ApiResponse({ status: 200, description: 'Return all leaves.' })
  async getAllLeaves() {
    return this.leaveService.getAllLeaves();
  }

  @Get('pending')
  @ApiOperation({ summary: 'Get pending leave requests' })
  @ApiResponse({ status: 200, description: 'Return pending leaves.' })
  async getPendingLeaves() {
    return this.leaveService.getPendingLeaves();
  }

  @Get('by-employee/:employeeId')
  @ApiOperation({ summary: 'Get leaves by employee ID' })
  @ApiResponse({ status: 200, description: 'Return employee leaves.' })
  async getLeavesByEmployeeId(
    @Param('employeeId', ParseUUIDPipe) employeeId: string,
    @Query() query?: any
  ) {
    return this.leaveService.getLeavesByEmployeeId(employeeId, query?.period);
  }

  @Get('summary')
  @ApiOperation({ summary: 'Get leave summary' })
  @ApiResponse({ status: 200, description: 'Return leave summary.' })
  async getLeaveSummary(@Query() query?: any) {
    return this.leaveService.getLeaveSummary(
      query?.startDate,
      query?.endDate,
      query?.employeeId
    );
  }

  @Get('balance/:employeeId')
  @ApiOperation({ summary: 'Get employee leave balance' })
  @ApiResponse({ status: 200, description: 'Return leave balance.' })
  async getEmployeeLeaveBalance(
    @Param('employeeId', ParseUUIDPipe) employeeId: string,
    @Query() query?: any
  ) {
    const year = query?.year ? parseInt(query.year, 10) : undefined;
    return this.leaveService.getEmployeeLeaveBalance(employeeId, year);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get leave by id' })
  @ApiResponse({ status: 200, description: 'Return the leave request.' })
  @ApiResponse({ status: 404, description: 'Leave not found.' })
  async findLeaveById(@Param('id', ParseUUIDPipe) id: string) {
    return this.leaveService.findLeaveById(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update leave request' })
  @ApiResponse({ status: 200, description: 'Leave updated successfully.' })
  @ApiResponse({ status: 404, description: 'Leave not found.' })
  async updateLeave(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateLeaveDto: UpdateLeaveDto
  ) {
    return this.leaveService.updateLeave(id, updateLeaveDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete leave request' })
  @ApiResponse({ status: 200, description: 'Leave deleted successfully.' })
  @ApiResponse({ status: 404, description: 'Leave not found.' })
  async deleteLeave(@Param('id', ParseUUIDPipe) id: string) {
    await this.leaveService.deleteLeave(id);
    return { message: 'Leave request deleted successfully' };
  }

  @Post(':id/approve-reject')
  @ApiOperation({ summary: 'Approve or reject leave request' })
  @ApiResponse({ status: 200, description: 'Leave status updated successfully.' })
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
