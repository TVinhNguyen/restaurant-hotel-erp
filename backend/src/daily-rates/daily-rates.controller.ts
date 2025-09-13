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
import { DailyRatesService } from './daily-rates.service';
import { CreateDailyRateDto } from './dto/create-daily-rate.dto';
import { UpdateDailyRateDto } from './dto/update-daily-rate.dto';

@Controller('daily-rates')
@UseGuards(AuthGuard('jwt'))
export class DailyRatesController {
  constructor(private readonly dailyRatesService: DailyRatesService) {}

  @Get()
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
  async findOne(@Param('id') id: string) {
    return await this.dailyRatesService.findOne(id);
  }

  @Post()
  async create(@Body() createDailyRateDto: CreateDailyRateDto) {
    return await this.dailyRatesService.create(createDailyRateDto);
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updateDailyRateDto: UpdateDailyRateDto,
  ) {
    return await this.dailyRatesService.update(id, updateDailyRateDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  async remove(@Param('id') id: string) {
    await this.dailyRatesService.remove(id);
    return { message: 'Daily rate deleted successfully' };
  }

  @Get('rate-plan/:ratePlanId')
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
