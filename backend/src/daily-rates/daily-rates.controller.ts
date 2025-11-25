import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiQuery,
  ApiParam,
  ApiBody,
} from '@nestjs/swagger';
import { DailyRatesService } from './daily-rates.service';
import { CreateDailyRateDto } from './dto/create-daily-rate.dto';
import { UpdateDailyRateDto } from './dto/update-daily-rate.dto';

@ApiTags('Daily Rates')
@ApiBearerAuth('JWT-auth')
@Controller('daily-rates')
@UseGuards(AuthGuard('jwt'))
export class DailyRatesController {
  constructor(private readonly dailyRatesService: DailyRatesService) {}

  @Get()
  @ApiOperation({ summary: 'Get all daily rates with filters' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'ratePlanId', required: false, type: String })
  @ApiQuery({ name: 'startDate', required: false, type: String })
  @ApiQuery({ name: 'endDate', required: false, type: String })
  @ApiResponse({ status: 200, description: 'Daily rates retrieved' })
  async findAll(
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('ratePlanId') ratePlanId?: string,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ) {
    const pageNum = page ? parseInt(page, 10) : 1;
    const limitNum = limit ? parseInt(limit, 10) : 10;

    return await this.dailyRatesService.findAll({
      page: pageNum,
      limit: limitNum,
      ratePlanId,
      startDate,
      endDate,
    });
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get daily rate by ID' })
  @ApiParam({ name: 'id', type: String })
  @ApiResponse({ status: 200, description: 'Daily rate found' })
  @ApiResponse({ status: 404, description: 'Daily rate not found' })
  async findOne(@Param('id') id: string) {
    return await this.dailyRatesService.findOne(id);
  }

  @Post()
  @ApiOperation({ summary: 'Create a new daily rate' })
  @ApiBody({ type: CreateDailyRateDto })
  @ApiResponse({ status: 201, description: 'Daily rate created' })
  async create(@Body() createDailyRateDto: CreateDailyRateDto) {
    return await this.dailyRatesService.create(createDailyRateDto);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update a daily rate' })
  @ApiParam({ name: 'id', type: String })
  @ApiBody({ type: UpdateDailyRateDto })
  @ApiResponse({ status: 200, description: 'Daily rate updated' })
  async update(
    @Param('id') id: string,
    @Body() updateDailyRateDto: UpdateDailyRateDto,
  ) {
    return await this.dailyRatesService.update(id, updateDailyRateDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Delete a daily rate' })
  @ApiParam({ name: 'id', type: String })
  @ApiResponse({ status: 200, description: 'Daily rate deleted' })
  async remove(@Param('id') id: string) {
    await this.dailyRatesService.remove(id);
    return { message: 'Daily rate deleted successfully' };
  }

  @Get('rate-plan/:ratePlanId')
  @ApiOperation({ summary: 'Get daily rates by rate plan' })
  @ApiParam({ name: 'ratePlanId', type: String })
  @ApiQuery({ name: 'startDate', required: false, type: String })
  @ApiQuery({ name: 'endDate', required: false, type: String })
  @ApiResponse({ status: 200, description: 'Daily rates retrieved' })
  async findByRatePlan(
    @Param('ratePlanId') ratePlanId: string,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ) {
    return await this.dailyRatesService.findByRatePlanAndDateRange(
      ratePlanId,
      startDate || '',
      endDate || '',
    );
  }
}
