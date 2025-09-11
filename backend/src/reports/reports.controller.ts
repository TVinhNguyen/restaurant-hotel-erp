import {
  Controller,
  Get,
  Query,
  UseGuards,
  ParseIntPipe,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ReportsService } from './reports.service';
import { ReportQueryDto, OccupancyReportDto, RevenueReportDto, RestaurantReportDto } from './dto/report-query.dto';

@Controller('reports')
@UseGuards(AuthGuard('jwt'))
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}

  @Get('dashboard')
  async getDashboardSummary(
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
    @Query('propertyId') propertyId?: string,
  ) {
    const queryDto: ReportQueryDto = { startDate, endDate, propertyId };
    return this.reportsService.getDashboardSummary(queryDto);
  }

  @Get('occupancy')
  async getOccupancyReport(
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
    @Query('propertyId') propertyId?: string,
  ) {
    const queryDto: OccupancyReportDto = { startDate, endDate, propertyId };
    return this.reportsService.getOccupancyReport(queryDto);
  }

  @Get('revenue')
  async getRevenueReport(
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
    @Query('propertyId') propertyId?: string,
    @Query('roomTypeId') roomTypeId?: string,
  ) {
    const queryDto: RevenueReportDto = { startDate, endDate, propertyId, roomTypeId };
    return this.reportsService.getRevenueReport(queryDto);
  }

  @Get('restaurant')
  async getRestaurantReport(
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
    @Query('propertyId') propertyId?: string,
    @Query('restaurantId') restaurantId?: string,
  ) {
    const queryDto: RestaurantReportDto = { startDate, endDate, propertyId, restaurantId };
    return this.reportsService.getRestaurantReport(queryDto);
  }

  @Get('performance')
  async getPerformanceMetrics(
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
    @Query('propertyId') propertyId?: string,
  ) {
    const queryDto: ReportQueryDto = { startDate, endDate, propertyId };
    return this.reportsService.getPerformanceMetrics(queryDto);
  }
}