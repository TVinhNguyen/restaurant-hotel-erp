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
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { WorkingShiftsService } from './working-shifts.service';
import { CreateWorkingShiftDto } from './dto/create-working-shift.dto';
import { UpdateWorkingShiftDto } from './dto/update-working-shift.dto';

@Controller('working-shifts')
@UseGuards(AuthGuard('jwt'))
export class WorkingShiftsController {
  constructor(private readonly workingShiftsService: WorkingShiftsService) {}

  @Post()
  async create(@Body() createWorkingShiftDto: CreateWorkingShiftDto) {
    return this.workingShiftsService.create(createWorkingShiftDto);
  }

  @Get()
  async findAll(
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('employeeId') employeeId?: string,
    @Query('propertyId') propertyId?: string,
    @Query('date') date?: string,
    @Query('shiftType') shiftType?: string,
  ) {
    const pageNum = page ? parseInt(page, 10) : 1;
    const limitNum = limit ? parseInt(limit, 10) : 10;

    return this.workingShiftsService.findAll(
      pageNum,
      limitNum,
      employeeId,
      propertyId,
      date,
      shiftType,
    );
  }

  @Get('employee/:employeeId')
  async findByEmployee(
    @Param('employeeId', ParseUUIDPipe) employeeId: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    const pageNum = page ? parseInt(page, 10) : 1;
    const limitNum = limit ? parseInt(limit, 10) : 10;

    return this.workingShiftsService.findByEmployee(
      employeeId,
      pageNum,
      limitNum,
    );
  }

  @Get('property/:propertyId')
  async findByProperty(
    @Param('propertyId', ParseUUIDPipe) propertyId: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    const pageNum = page ? parseInt(page, 10) : 1;
    const limitNum = limit ? parseInt(limit, 10) : 10;

    return this.workingShiftsService.findByProperty(
      propertyId,
      pageNum,
      limitNum,
    );
  }

  @Get('date-range')
  async findByDateRange(
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    const pageNum = page ? parseInt(page, 10) : 1;
    const limitNum = limit ? parseInt(limit, 10) : 10;

    return this.workingShiftsService.findByDateRange(
      startDate,
      endDate,
      pageNum,
      limitNum,
    );
  }

  @Get(':id')
  async findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.workingShiftsService.findOne(id);
  }

  @Put(':id')
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateWorkingShiftDto: UpdateWorkingShiftDto,
  ) {
    return this.workingShiftsService.update(id, updateWorkingShiftDto);
  }

  @Delete(':id')
  async remove(@Param('id', ParseUUIDPipe) id: string) {
    await this.workingShiftsService.remove(id);
    return { message: 'Working shift deleted successfully' };
  }
}
