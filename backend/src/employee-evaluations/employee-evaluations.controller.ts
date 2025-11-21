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
import { EmployeeEvaluationsService } from './employee-evaluations.service';
import { CreateEmployeeEvaluationDto } from './dto/create-employee-evaluation.dto';
import { UpdateEmployeeEvaluationDto } from './dto/update-employee-evaluation.dto';

@Controller('employee-evaluations')
@UseGuards(AuthGuard('jwt'))
export class EmployeeEvaluationsController {
  constructor(
    private readonly employeeEvaluationsService: EmployeeEvaluationsService,
  ) {}

  @Post()
  async create(
    @Body() createEmployeeEvaluationDto: CreateEmployeeEvaluationDto,
  ) {
    return this.employeeEvaluationsService.create(createEmployeeEvaluationDto);
  }

  @Get()
  async findAll(
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('employeeId') employeeId?: string,
    @Query('evaluatedBy') evaluatedBy?: string,
    @Query('period') period?: string,
    @Query('rateMin') rateMin?: string,
    @Query('rateMax') rateMax?: string,
  ) {
    const pageNum = page ? parseInt(page, 10) : 1;
    const limitNum = limit ? parseInt(limit, 10) : 10;
    const rateMinNum = rateMin ? parseInt(rateMin, 10) : undefined;
    const rateMaxNum = rateMax ? parseInt(rateMax, 10) : undefined;

    return this.employeeEvaluationsService.findAll(
      pageNum,
      limitNum,
      employeeId,
      evaluatedBy,
      period,
      rateMinNum,
      rateMaxNum,
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

    return this.employeeEvaluationsService.findByEmployee(
      employeeId,
      pageNum,
      limitNum,
    );
  }

  @Get('evaluator/:evaluatedBy')
  async findByEvaluator(
    @Param('evaluatedBy', ParseUUIDPipe) evaluatedBy: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    const pageNum = page ? parseInt(page, 10) : 1;
    const limitNum = limit ? parseInt(limit, 10) : 10;

    return this.employeeEvaluationsService.findByEvaluator(
      evaluatedBy,
      pageNum,
      limitNum,
    );
  }

  @Get('period/:period')
  async findByPeriod(
    @Param('period') period: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    const pageNum = page ? parseInt(page, 10) : 1;
    const limitNum = limit ? parseInt(limit, 10) : 10;

    return this.employeeEvaluationsService.findByPeriod(
      period,
      pageNum,
      limitNum,
    );
  }

  @Get('rate-range')
  async findByRateRange(
    @Query('rateMin') rateMin: string,
    @Query('rateMax') rateMax: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    const pageNum = page ? parseInt(page, 10) : 1;
    const limitNum = limit ? parseInt(limit, 10) : 10;
    const rateMinNum = parseInt(rateMin, 10);
    const rateMaxNum = parseInt(rateMax, 10);

    return this.employeeEvaluationsService.findByRateRange(
      rateMinNum,
      rateMaxNum,
      pageNum,
      limitNum,
    );
  }

  @Get('employee/:employeeId/average')
  async getAverageRateByEmployee(
    @Param('employeeId', ParseUUIDPipe) employeeId: string,
  ) {
    return this.employeeEvaluationsService.getAverageRateByEmployee(employeeId);
  }

  @Get('stats/period/:period')
  async getEvaluationStatsByPeriod(@Param('period') period: string) {
    return this.employeeEvaluationsService.getEvaluationStatsByPeriod(period);
  }

  @Get(':id')
  async findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.employeeEvaluationsService.findOne(id);
  }

  @Put(':id')
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateEmployeeEvaluationDto: UpdateEmployeeEvaluationDto,
  ) {
    return this.employeeEvaluationsService.update(
      id,
      updateEmployeeEvaluationDto,
    );
  }

  @Delete(':id')
  async remove(@Param('id', ParseUUIDPipe) id: string) {
    await this.employeeEvaluationsService.remove(id);
    return { message: 'Employee evaluation deleted successfully' };
  }
}
