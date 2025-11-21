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
import { DeductionsService } from './deductions.service';
import { CreateDeductionDto } from './dto/create-deduction.dto';
import { UpdateDeductionDto } from './dto/update-deduction.dto';

@Controller('deductions')
@UseGuards(AuthGuard('jwt'))
export class DeductionsController {
  constructor(private readonly deductionsService: DeductionsService) {}

  @Post()
  async create(@Body() createDeductionDto: CreateDeductionDto) {
    return this.deductionsService.create(createDeductionDto);
  }

  @Get()
  async findAll(
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('employeeId') employeeId?: string,
    @Query('type') type?: string,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ) {
    const pageNum = page ? parseInt(page, 10) : 1;
    const limitNum = limit ? parseInt(limit, 10) : 10;

    return this.deductionsService.findAll(
      pageNum,
      limitNum,
      employeeId,
      type,
      startDate,
      endDate,
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

    return this.deductionsService.findByEmployee(employeeId, pageNum, limitNum);
  }

  @Get('type/:type')
  async findByType(
    @Param('type') type: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    const pageNum = page ? parseInt(page, 10) : 1;
    const limitNum = limit ? parseInt(limit, 10) : 10;

    return this.deductionsService.findByType(type, pageNum, limitNum);
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

    return this.deductionsService.findByDateRange(
      startDate,
      endDate,
      pageNum,
      limitNum,
    );
  }

  @Get('employee/:employeeId/total')
  async getTotalDeductionsByEmployee(
    @Param('employeeId', ParseUUIDPipe) employeeId: string,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ) {
    return this.deductionsService.getTotalDeductionsByEmployee(
      employeeId,
      startDate,
      endDate,
    );
  }

  @Get(':id')
  async findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.deductionsService.findOne(id);
  }

  @Put(':id')
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateDeductionDto: UpdateDeductionDto,
  ) {
    return this.deductionsService.update(id, updateDeductionDto);
  }

  @Delete(':id')
  async remove(@Param('id', ParseUUIDPipe) id: string) {
    await this.deductionsService.remove(id);
    return { message: 'Deduction deleted successfully' };
  }
}
