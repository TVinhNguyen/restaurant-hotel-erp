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
import { RatePlansService } from './rate-plans.service';
import { CreateRatePlanDto } from './dto/create-rate-plan.dto';
import { UpdateRatePlanDto } from './dto/update-rate-plan.dto';

@Controller('rate-plans')
@UseGuards(AuthGuard('jwt'))
export class RatePlansController {
  constructor(private readonly ratePlansService: RatePlansService) {}

  @Get()
  async findAll(
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('propertyId') propertyId?: string,
    @Query('roomTypeId') roomTypeId?: string,
  ) {
    const pageNum = page ? parseInt(page, 10) : 1;
    const limitNum = limit ? parseInt(limit, 10) : 10;

    return await this.ratePlansService.findAll({
      page: pageNum,
      limit: limitNum,
      propertyId,
      roomTypeId,
    });
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.ratePlansService.findOne(id);
  }

  @Post()
  async create(@Body() createRatePlanDto: CreateRatePlanDto) {
    return await this.ratePlansService.create(createRatePlanDto);
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updateRatePlanDto: UpdateRatePlanDto,
  ) {
    return await this.ratePlansService.update(id, updateRatePlanDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  async remove(@Param('id') id: string) {
    await this.ratePlansService.remove(id);
    return { message: 'Rate plan deleted successfully' };
  }

  @Post(':id/daily-rates')
  async setDailyRate(
    @Param('id') ratePlanId: string,
    @Body() body: { date: string; rate: number },
  ) {
    return await this.ratePlansService.setDailyRate(
      ratePlanId,
      body.date,
      body.rate,
    );
  }

  @Get(':id/daily-rates')
  async getDailyRates(
    @Param('id') ratePlanId: string,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ) {
    return await this.ratePlansService.getDailyRates(
      ratePlanId,
      startDate,
      endDate,
    );
  }
}
