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
import { PromotionsService } from './promotions.service';
import { CreatePromotionDto } from './dto/create-promotion.dto';
import { UpdatePromotionDto } from './dto/update-promotion.dto';

@ApiTags('Promotions')
@Controller('promotions')
export class PromotionsController {
  constructor(private readonly promotionsService: PromotionsService) {}

  @Get()
  @ApiOperation({ summary: 'Get all promotions' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'propertyId', required: false, type: String })
  @ApiQuery({
    name: 'active',
    required: false,
    type: Boolean,
    description: 'Filter active promotions',
  })
  @ApiResponse({ status: 200, description: 'Promotions retrieved' })
  async findAll(
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('propertyId') propertyId?: string,
    @Query('active') active?: string,
  ) {
    const pageNum = page ? parseInt(page, 10) : 1;
    const limitNum = limit ? parseInt(limit, 10) : 10;
    const activeBool = active !== undefined ? active === 'true' : undefined;

    return await this.promotionsService.findAll({
      page: pageNum,
      limit: limitNum,
      propertyId,
      active: activeBool,
    });
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get promotion by ID' })
  @ApiParam({ name: 'id', type: String })
  @ApiResponse({ status: 200, description: 'Promotion found' })
  async findOne(@Param('id') id: string) {
    return await this.promotionsService.findOne(id);
  }

  @Get('code/:code')
  @ApiOperation({ summary: 'Get promotion by code' })
  @ApiParam({ name: 'code', type: String, description: 'Promotion code' })
  @ApiResponse({ status: 200, description: 'Promotion found' })
  @ApiResponse({ status: 404, description: 'Promotion not found' })
  async findByCode(@Param('code') code: string) {
    return await this.promotionsService.findByCode(code);
  }

  @Post()
  @ApiOperation({ summary: 'Create a new promotion' })
  @ApiBody({ type: CreatePromotionDto })
  @ApiResponse({ status: 201, description: 'Promotion created' })
  async create(@Body() createPromotionDto: CreatePromotionDto) {
    return await this.promotionsService.create(createPromotionDto);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update a promotion' })
  @ApiParam({ name: 'id', type: String })
  @ApiBody({ type: UpdatePromotionDto })
  @ApiResponse({ status: 200, description: 'Promotion updated' })
  async update(
    @Param('id') id: string,
    @Body() updatePromotionDto: UpdatePromotionDto,
  ) {
    return await this.promotionsService.update(id, updatePromotionDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Delete a promotion' })
  @ApiParam({ name: 'id', type: String })
  @ApiResponse({ status: 200, description: 'Promotion deleted' })
  async remove(@Param('id') id: string) {
    await this.promotionsService.remove(id);
    return { message: 'Promotion deleted successfully' };
  }

  @Post('validate')
  @ApiOperation({ summary: 'Validate a promotion code' })
  @ApiBody({
    schema: {
      type: 'object',
      required: ['code', 'propertyId'],
      properties: {
        code: { type: 'string', example: 'SUMMER2025' },
        propertyId: { type: 'string' },
      },
    },
  })
  @ApiResponse({ status: 200, description: 'Promotion validated' })
  @ApiResponse({ status: 400, description: 'Invalid or expired promotion' })
  async validatePromotion(@Body() body: { code: string; propertyId: string }) {
    return await this.promotionsService.validatePromotion(
      body.code,
      body.propertyId,
    );
  }
}
