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
import { TaxRulesService } from './tax-rules.service';
import { CreateTaxRuleDto } from './dto/create-tax-rule.dto';
import { UpdateTaxRuleDto } from './dto/update-tax-rule.dto';

@ApiTags('Tax Rules')
@Controller('tax-rules')
export class TaxRulesController {
  constructor(private readonly taxRulesService: TaxRulesService) { }

  @Get()
  @ApiOperation({ summary: 'Get all tax rules' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'propertyId', required: false, type: String })
  @ApiQuery({
    name: 'type',
    required: false,
    enum: ['VAT', 'service'],
    description: 'Tax type filter',
  })
  @ApiResponse({ status: 200, description: 'Tax rules retrieved' })
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
  @ApiOperation({ summary: 'Get tax rule by ID' })
  @ApiParam({ name: 'id', type: String })
  @ApiResponse({ status: 200, description: 'Tax rule found' })
  async findOne(@Param('id') id: string) {
    return await this.taxRulesService.findOne(id);
  }

  @Post()
  @ApiOperation({ summary: 'Create a new tax rule' })
  @ApiBody({ type: CreateTaxRuleDto })
  @ApiResponse({ status: 201, description: 'Tax rule created' })
  async create(@Body() createTaxRuleDto: CreateTaxRuleDto) {
    return await this.taxRulesService.create(createTaxRuleDto);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update a tax rule' })
  @ApiParam({ name: 'id', type: String })
  @ApiBody({ type: UpdateTaxRuleDto })
  @ApiResponse({ status: 200, description: 'Tax rule updated' })
  async update(
    @Param('id') id: string,
    @Body() updateTaxRuleDto: UpdateTaxRuleDto,
  ) {
    return await this.taxRulesService.update(id, updateTaxRuleDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Delete a tax rule' })
  @ApiParam({ name: 'id', type: String })
  @ApiResponse({ status: 200, description: 'Tax rule deleted' })
  async remove(@Param('id') id: string) {
    await this.taxRulesService.remove(id);
    return { message: 'Tax rule deleted successfully' };
  }

  @Get('property/:propertyId')
  @ApiOperation({ summary: 'Get all tax rules for a property' })
  @ApiParam({ name: 'propertyId', type: String })
  @ApiResponse({ status: 200, description: 'Tax rules retrieved' })
  async findByProperty(@Param('propertyId') propertyId: string) {
    return await this.taxRulesService.findByProperty(propertyId);
  }

  @Post('calculate')
  @ApiOperation({ summary: 'Calculate tax for an amount' })
  @ApiBody({
    schema: {
      type: 'object',
      required: ['amount', 'propertyId'],
      properties: {
        amount: { type: 'number', example: 1000 },
        propertyId: { type: 'string' },
        taxType: {
          type: 'string',
          enum: ['VAT', 'service'],
          description: 'Optional tax type filter',
        },
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Tax calculated',
    schema: {
      type: 'object',
      properties: {
        amount: { type: 'number' },
        taxAmount: { type: 'number' },
        totalAmount: { type: 'number' },
      },
    },
  })
  async calculateTax(
    @Body() body: { amount: number; propertyId: string; taxType?: string },
  ) {
    return await this.taxRulesService.calculateTax(
      body.amount,
      body.propertyId,
      body.taxType,
    );
  }
}
