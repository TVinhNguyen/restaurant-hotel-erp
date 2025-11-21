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
import { EmployeeEvaluationsService } from './employee-evaluations.service';
import { CreateEmployeeEvaluationDto } from './dto/create-employee-evaluation.dto';
import { UpdateEmployeeEvaluationDto } from './dto/update-employee-evaluation.dto';

@Controller('employee-evaluations')
@UseGuards(AuthGuard('jwt'))
export class EmployeeEvaluationsController {
  constructor(
    private readonly employeeEvaluationsService: EmployeeEvaluationsService
  ) {}

  @Post()
  async create(
    @Body() createEmployeeEvaluationDto: CreateEmployeeEvaluationDto
  ) {
    return this.employeeEvaluationsService.create(createEmployeeEvaluationDto);
  }

  @Get()
  async findAll(
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('employeeId') employeeId?: string,
    @Query('evaluatorId') evaluatorId?: string,
    @Query('status') status?: string,
    @Query('evaluationPeriod') evaluationPeriod?: string
  ) {
    const pageNum = page ? parseInt(page, 10) : 1;
    const limitNum = limit ? parseInt(limit, 10) : 10;

    return this.employeeEvaluationsService.findAll(
      pageNum,
      limitNum,
      employeeId,
      evaluatorId,
      status,
      evaluationPeriod
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

    return this.employeeEvaluationsService.findByEmployee(
      employeeId,
      pageNum,
      limitNum
    );
  }

  @Get('evaluator/:evaluatorId')
  async findByEvaluator(
    @Param('evaluatorId', ParseUUIDPipe) evaluatorId: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string
  ) {
    const pageNum = page ? parseInt(page, 10) : 1;
    const limitNum = limit ? parseInt(limit, 10) : 10;

    return this.employeeEvaluationsService.findByEvaluator(
      evaluatorId,
      pageNum,
      limitNum
    );
  }

  @Get('status/:status')
  async findByStatus(
    @Param('status') status: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string
  ) {
    const pageNum = page ? parseInt(page, 10) : 1;
    const limitNum = limit ? parseInt(limit, 10) : 10;

    return this.employeeEvaluationsService.findByStatus(
      status,
      pageNum,
      limitNum
    );
  }

  @Get('period/:evaluationPeriod')
  async findByPeriod(
    @Param('evaluationPeriod') evaluationPeriod: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string
  ) {
    const pageNum = page ? parseInt(page, 10) : 1;
    const limitNum = limit ? parseInt(limit, 10) : 10;

    return this.employeeEvaluationsService.findByPeriod(
      evaluationPeriod,
      pageNum,
      limitNum
    );
  }

  @Get('employee/:employeeId/average')
  async getAverageScoreByEmployee(
    @Param('employeeId', ParseUUIDPipe) employeeId: string
  ) {
    return this.employeeEvaluationsService.getAverageScoreByEmployee(
      employeeId
    );
  }

  @Get('stats/period/:evaluationPeriod')
  async getEvaluationStatsByPeriod(
    @Param('evaluationPeriod') evaluationPeriod: string
  ) {
    return this.employeeEvaluationsService.getEvaluationStatsByPeriod(
      evaluationPeriod
    );
  }

  @Post(':id/acknowledge')
  async acknowledgeEvaluation(
    @Param('id', ParseUUIDPipe) id: string,
    @Body('employeeComments') employeeComments?: string
  ) {
    return this.employeeEvaluationsService.acknowledgeEvaluation(
      id,
      employeeComments
    );
  }

  @Post(':id/calculate-score')
  async calculateOverallScore(@Param('id', ParseUUIDPipe) id: string) {
    const score =
      await this.employeeEvaluationsService.calculateOverallScore(id);
    return { overallScore: score };
  }

  @Get(':id')
  async findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.employeeEvaluationsService.findOne(id);
  }

  @Put(':id')
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateEmployeeEvaluationDto: UpdateEmployeeEvaluationDto
  ) {
    return this.employeeEvaluationsService.update(
      id,
      updateEmployeeEvaluationDto
    );
  }

  @Delete(':id')
  async remove(@Param('id', ParseUUIDPipe) id: string) {
    await this.employeeEvaluationsService.remove(id);
    return { message: 'Employee evaluation deleted successfully' };
  }
}
