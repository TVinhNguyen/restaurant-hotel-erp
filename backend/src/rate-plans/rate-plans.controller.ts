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
import { RatePlansService } from './rate-plans.service';
import { CreateRatePlanDto } from './dto/create-rate-plan.dto';
import { UpdateRatePlanDto } from './dto/update-rate-plan.dto';

@ApiTags('Rate Plans')
@Controller('rate-plans')
export class RatePlansController {
  constructor(private readonly ratePlansService: RatePlansService) { }

  @Get()
  @ApiOperation({ summary: 'Get all rate plans with pagination and filters' })
  @ApiQuery({ name: 'page', required: false, type: Number, example: 1 })
  @ApiQuery({ name: 'limit', required: false, type: Number, example: 10 })
  @ApiQuery({
    name: 'propertyId',
    required: false,
    type: String,
    description: 'Filter by property ID',
  })
  @ApiQuery({
    name: 'roomTypeId',
    required: false,
    type: String,
    description: 'Filter by room type ID',
  })
  @ApiResponse({
    status: 200,
    description: 'List of rate plans retrieved successfully',
  })
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
  @ApiOperation({ summary: 'Get rate plan by ID' })
  @ApiParam({ name: 'id', type: String, description: 'Rate plan ID' })
  @ApiResponse({ status: 200, description: 'Rate plan found' })
  @ApiResponse({ status: 404, description: 'Rate plan not found' })
  async findOne(@Param('id') id: string) {
    return await this.ratePlansService.findOne(id);
  }

  @Post()
  @ApiOperation({ summary: 'Create a new rate plan' })
  @ApiBody({ type: CreateRatePlanDto })
  @ApiResponse({
    status: 201,
    description: 'Rate plan created successfully',
  })
  @ApiResponse({ status: 400, description: 'Invalid input data' })
  async create(@Body() createRatePlanDto: CreateRatePlanDto) {
    return await this.ratePlansService.create(createRatePlanDto);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update a rate plan' })
  @ApiParam({ name: 'id', type: String, description: 'Rate plan ID' })
  @ApiBody({ type: UpdateRatePlanDto })
  @ApiResponse({
    status: 200,
    description: 'Rate plan updated successfully',
  })
  @ApiResponse({ status: 404, description: 'Rate plan not found' })
  async update(
    @Param('id') id: string,
    @Body() updateRatePlanDto: UpdateRatePlanDto,
  ) {
    return await this.ratePlansService.update(id, updateRatePlanDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Delete a rate plan' })
  @ApiParam({ name: 'id', type: String, description: 'Rate plan ID' })
  @ApiResponse({
    status: 200,
    description: 'Rate plan deleted successfully',
  })
  @ApiResponse({ status: 404, description: 'Rate plan not found' })
  async remove(@Param('id') id: string) {
    await this.ratePlansService.remove(id);
    return { message: 'Rate plan deleted successfully' };
  }

  @Post(':id/daily-rates')
  @ApiOperation({ summary: 'Set daily rate for a specific date' })
  @ApiParam({ name: 'id', type: String, description: 'Rate plan ID' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        date: { type: 'string', format: 'date', example: '2025-12-25' },
        rate: { type: 'number', example: 150.0 },
      },
    },
  })
  @ApiResponse({ status: 201, description: 'Daily rate set successfully' })
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
  @ApiOperation({ summary: 'Get daily rates for a rate plan' })
  @ApiParam({ name: 'id', type: String, description: 'Rate plan ID' })
  @ApiQuery({
    name: 'startDate',
    required: false,
    type: String,
    example: '2025-12-01',
  })
  @ApiQuery({
    name: 'endDate',
    required: false,
    type: String,
    example: '2025-12-31',
  })
  @ApiResponse({
    status: 200,
    description: 'Daily rates retrieved successfully',
  })
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
