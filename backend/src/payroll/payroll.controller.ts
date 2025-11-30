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
import { PayrollService } from './payroll.service';
import {
  CreatePayrollDto,
  UpdatePayrollDto,
  BulkPayrollDto
} from './dto/create-payroll.dto';

@ApiTags('Payroll')
@ApiBearerAuth('JWT-auth')
@Controller('payroll')
@UseGuards(AuthGuard('jwt'))
export class PayrollController {
  constructor(private readonly payrollService: PayrollService) {}

  @Post()
  @ApiOperation({ summary: 'Create payroll record' })
  @ApiResponse({ status: 201, description: 'Payroll created successfully.' })
  async createPayroll(@Body() createPayrollDto: CreatePayrollDto) {
    return this.payrollService.createPayroll(createPayrollDto);
  }

  @Post('bulk')
  @ApiOperation({ summary: 'Bulk create payroll records' })
  @ApiResponse({ status: 201, description: 'Bulk payroll created successfully.' })
  async bulkCreatePayroll(@Body() bulkPayrollDto: BulkPayrollDto) {
    return this.payrollService.bulkCreatePayroll(bulkPayrollDto);
  }

  @Post('generate/:period')
  @ApiOperation({ summary: 'Generate payroll with calculations' })
  @ApiResponse({ status: 201, description: 'Payroll generated successfully.' })
  async generatePayrollWithCalculations(
    @Param('period') period: string,
    @Query() query?: any
  ) {
    return this.payrollService.generatePayrollWithCalculations(
      period,
      query?.employeeId
    );
  }

  @Get()
  @ApiOperation({ summary: 'Get all payroll records' })
  @ApiResponse({ status: 200, description: 'Return all payroll records.' })
  async findAllPayrolls(@Query() query?: any) {
    const page = query?.page ? parseInt(query.page, 10) : 1;
    const limit = query?.limit ? parseInt(query.limit, 10) : 10;

    return this.payrollService.findAllPayrolls(page, limit, query?.employeeId, query?.period);
  }

  @Get('get-all-payrolls')
  @ApiOperation({ summary: 'Get all payrolls without pagination' })
  @ApiResponse({ status: 200, description: 'Return all payrolls.' })
  async getAllPayrolls() {
    return this.payrollService.getAllPayrolls();
  }

  @Get('summary/:period')
  @ApiOperation({ summary: 'Get payroll summary' })
  @ApiResponse({ status: 200, description: 'Return payroll summary.' })
  async getPayrollSummary(
    @Param('period') period: string,
    @Query() query?: any
  ) {
    return this.payrollService.getPayrollSummary(period, query?.employeeId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get payroll by id' })
  @ApiResponse({ status: 200, description: 'Return the payroll record.' })
  @ApiResponse({ status: 404, description: 'Payroll not found.' })
  async findPayrollById(@Param('id', ParseUUIDPipe) id: string) {
    return this.payrollService.findPayrollById(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update payroll record' })
  @ApiResponse({ status: 200, description: 'Payroll updated successfully.' })
  @ApiResponse({ status: 404, description: 'Payroll not found.' })
  async updatePayroll(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updatePayrollDto: UpdatePayrollDto
  ) {
    return this.payrollService.updatePayroll(id, updatePayrollDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete payroll record' })
  @ApiResponse({ status: 200, description: 'Payroll deleted successfully.' })
  @ApiResponse({ status: 404, description: 'Payroll not found.' })
  async deletePayroll(@Param('id', ParseUUIDPipe) id: string) {
    await this.payrollService.deletePayroll(id);
    return { message: 'Payroll record deleted successfully' };
  }
}
