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
import { TaxRulesService } from './tax-rules.service';
import { CreateTaxRuleDto } from './dto/create-tax-rule.dto';
import { UpdateTaxRuleDto } from './dto/update-tax-rule.dto';

@Controller('tax-rules')
@UseGuards(AuthGuard('jwt'))
export class TaxRulesController {
  constructor(private readonly taxRulesService: TaxRulesService) {}

  @Get()
  async findAll(
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('propertyId') propertyId?: string,
    @Query('type') type?: string,
  ) {
    const pageNum = page ? parseInt(page, 10) : 1;
    const limitNum = limit ? parseInt(limit, 10) : 10;

    return await this.taxRulesService.findAll({
      page: pageNum,
      limit: limitNum,
      propertyId,
      type,
    });
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.taxRulesService.findOne(id);
  }

  @Post()
  async create(@Body() createTaxRuleDto: CreateTaxRuleDto) {
    return await this.taxRulesService.create(createTaxRuleDto);
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updateTaxRuleDto: UpdateTaxRuleDto,
  ) {
    return await this.taxRulesService.update(id, updateTaxRuleDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  async remove(@Param('id') id: string) {
    await this.taxRulesService.remove(id);
    return { message: 'Tax rule deleted successfully' };
  }

  @Get('property/:propertyId')
  async findByProperty(@Param('propertyId') propertyId: string) {
    return await this.taxRulesService.findByProperty(propertyId);
  }

  @Post('calculate')
  async calculateTax(
    @Body() body: { 
      amount: number; 
      propertyId: string; 
      taxType?: string 
    },
  ) {
    return await this.taxRulesService.calculateTax(
      body.amount,
      body.propertyId,
      body.taxType,
    );
  }
}
