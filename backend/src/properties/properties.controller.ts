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
import { PropertiesService } from './properties.service';
import { CreatePropertyDto } from './dto/create-property.dto';
import { UpdatePropertyDto } from './dto/update-property.dto';

@Controller('properties')
@UseGuards(AuthGuard('jwt'))
export class PropertiesController {
  constructor(private readonly propertiesService: PropertiesService) {}

  @Get()
  async findAll(
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('type') type?: string,
  ) {
    const pageNum = page ? parseInt(page, 10) : 1;
    const limitNum = limit ? parseInt(limit, 10) : 10;

    return await this.propertiesService.findAll({
      page: pageNum,
      limit: limitNum,
      type,
    });
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.propertiesService.findOne(id);
  }

  @Post()
  async create(@Body() createPropertyDto: CreatePropertyDto) {
    return await this.propertiesService.create(createPropertyDto);
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updatePropertyDto: UpdatePropertyDto,
  ) {
    return await this.propertiesService.update(id, updatePropertyDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  async remove(@Param('id') id: string) {
    await this.propertiesService.remove(id);
    return { message: 'Property deleted successfully' };
  }
}