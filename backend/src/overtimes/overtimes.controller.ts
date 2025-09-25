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
  UseGuards
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { OvertimesService } from './overtimes.service';
import { CreateOvertimeDto } from './dto/create-overtime.dto';
import { UpdateOvertimeDto } from './dto/update-overtime.dto';

@Controller('overtimes')
@UseGuards(AuthGuard('jwt'))
export class OvertimesController {
  constructor(private readonly overtimesService: OvertimesService) {}

  @Post()
  async create(@Body() createOvertimeDto: CreateOvertimeDto) {
    return this.overtimesService.create(createOvertimeDto);
  }

  @Get()
  async findAll(
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('employeeId') employeeId?: string,
    @Query('workingShiftId') workingShiftId?: string,
    @Query('approvedBy') approvedBy?: string
  ) {
    const pageNum = page ? parseInt(page, 10) : 1;
    const limitNum = limit ? parseInt(limit, 10) : 10;

    return this.overtimesService.findAll(
      pageNum,
      limitNum,
      employeeId,
      workingShiftId,
      approvedBy
    );
  }

  @Get('employee/:employeeId')
  async findByEmployee(
    @Param('employeeId', ParseUUIDPipe) employeeId: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string
  ) {
    const pageNum = page ? parseInt(page, 10) : 1;
    const limitNum = limit ? parseInt(limit, 10) : 10;

    return this.overtimesService.findByEmployee(employeeId, pageNum, limitNum);
  }

  @Get('working-shift/:workingShiftId')
  async findByWorkingShift(
    @Param('workingShiftId', ParseUUIDPipe) workingShiftId: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string
  ) {
    const pageNum = page ? parseInt(page, 10) : 1;
    const limitNum = limit ? parseInt(limit, 10) : 10;

    return this.overtimesService.findByWorkingShift(
      workingShiftId,
      pageNum,
      limitNum
    );
  }

  @Get('approver/:approvedBy')
  async findByApprover(
    @Param('approvedBy', ParseUUIDPipe) approvedBy: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string
  ) {
    const pageNum = page ? parseInt(page, 10) : 1;
    const limitNum = limit ? parseInt(limit, 10) : 10;

    return this.overtimesService.findByApprover(approvedBy, pageNum, limitNum);
  }

  @Get('employee/:employeeId/total')
  async getTotalOvertimeByEmployee(
    @Param('employeeId', ParseUUIDPipe) employeeId: string
  ) {
    return this.overtimesService.getTotalOvertimeByEmployee(employeeId);
  }

  @Post('calculate')
  async calculateOvertimeAmount(
    @Body() body: { numberOfHours: number; rate: number }
  ) {
    const amount = await this.overtimesService.calculateOvertimeAmount(
      body.numberOfHours,
      body.rate
    );
    return {
      numberOfHours: body.numberOfHours,
      rate: body.rate,
      amount
    };
  }

  @Get(':id')
  async findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.overtimesService.findOne(id);
  }

  @Put(':id')
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateOvertimeDto: UpdateOvertimeDto
  ) {
    return this.overtimesService.update(id, updateOvertimeDto);
  }

  @Delete(':id')
  async remove(@Param('id', ParseUUIDPipe) id: string) {
    await this.overtimesService.remove(id);
    return { message: 'Overtime deleted successfully' };
  }
}
