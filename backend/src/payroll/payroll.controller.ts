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
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { PayrollService } from './payroll.service';
import {
  CreatePayrollDto,
  UpdatePayrollDto,
  BulkPayrollDto,
} from './dto/create-payroll.dto';

@Controller('payroll')
@UseGuards(AuthGuard('jwt'))
export class PayrollController {
  constructor(private readonly payrollService: PayrollService) {}

  @Post()
  async createPayroll(@Body() createPayrollDto: CreatePayrollDto) {
    return this.payrollService.createPayroll(createPayrollDto);
  }

  @Post('bulk')
  async bulkCreatePayroll(@Body() bulkPayrollDto: BulkPayrollDto) {
    return this.payrollService.bulkCreatePayroll(bulkPayrollDto);
  }

  @Post('generate/:period')
  async generatePayrollWithCalculations(
    @Param('period') period: string,
    @Query('employeeId') employeeId?: string,
  ) {
    return this.payrollService.generatePayrollWithCalculations(
      period,
      employeeId,
    );
  }

  @Get()
  async findAllPayrolls(
    @Query('page', ParseIntPipe) page: number = 1,
    @Query('limit', ParseIntPipe) limit: number = 10,
    @Query('employeeId') employeeId?: string,
    @Query('period') period?: string,
  ) {
    return this.payrollService.findAllPayrolls(page, limit, employeeId, period);
  }

  @Get('summary/:period')
  async getPayrollSummary(
    @Param('period') period: string,
    @Query('employeeId') employeeId?: string,
  ) {
    return this.payrollService.getPayrollSummary(period, employeeId);
  }

  @Get(':id')
  async findPayrollById(@Param('id', ParseUUIDPipe) id: string) {
    return this.payrollService.findPayrollById(id);
  }

  @Put(':id')
  async updatePayroll(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updatePayrollDto: UpdatePayrollDto,
  ) {
    return this.payrollService.updatePayroll(id, updatePayrollDto);
  }

  @Delete(':id')
  async deletePayroll(@Param('id', ParseUUIDPipe) id: string) {
    await this.payrollService.deletePayroll(id);
    return { message: 'Payroll record deleted successfully' };
  }
}
