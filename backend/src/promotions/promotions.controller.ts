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
import { PromotionsService } from './promotions.service';
import { CreatePromotionDto } from './dto/create-promotion.dto';
import { UpdatePromotionDto } from './dto/update-promotion.dto';

@Controller('promotions')
@UseGuards(AuthGuard('jwt'))
export class PromotionsController {
  constructor(private readonly promotionsService: PromotionsService) {}

  @Get()
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
  async findOne(@Param('id') id: string) {
    return await this.promotionsService.findOne(id);
  }

  @Get('code/:code')
  async findByCode(@Param('code') code: string) {
    return await this.promotionsService.findByCode(code);
  }

  @Post()
  async create(@Body() createPromotionDto: CreatePromotionDto) {
    return await this.promotionsService.create(createPromotionDto);
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updatePromotionDto: UpdatePromotionDto,
  ) {
    return await this.promotionsService.update(id, updatePromotionDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  async remove(@Param('id') id: string) {
    await this.promotionsService.remove(id);
    return { message: 'Promotion deleted successfully' };
  }

  @Post('validate')
  async validatePromotion(
    @Body() body: { code: string; propertyId: string },
  ) {
    return await this.promotionsService.validatePromotion(body.code, body.propertyId);
  }
}
