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
import { ServicesService } from './services.service';
import { CreatePropertyServiceDto } from './dto/create-property-service.dto';
import { UpdatePropertyServiceDto } from './dto/update-property-service.dto';

@Controller('services')
@UseGuards(AuthGuard('jwt'))
export class ServicesController {
  constructor(private readonly servicesService: ServicesService) {}

  @Get()
  async findAllServices(
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('category') category?: string,
  ) {
    const pageNum = page ? parseInt(page, 10) : 1;
    const limitNum = limit ? parseInt(limit, 10) : 10;

    return await this.servicesService.findAllServices({
      page: pageNum,
      limit: limitNum,
      category,
    });
  }

  @Get('property-services')
  async findAllPropertyServices(
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('propertyId') propertyId?: string,
    @Query('isActive') isActive?: string,
  ) {
    const pageNum = page ? parseInt(page, 10) : 1;
    const limitNum = limit ? parseInt(limit, 10) : 10;
    const isActiveBool = isActive !== undefined ? isActive === 'true' : undefined;

    return await this.servicesService.findAllPropertyServices({
      page: pageNum,
      limit: limitNum,
      propertyId,
      isActive: isActiveBool,
    });
  }

  @Get('property-services/:id')
  async findOnePropertyService(@Param('id') id: string) {
    return await this.servicesService.findOnePropertyService(id);
  }

  @Post('property-services')
  async createPropertyService(@Body() createPropertyServiceDto: CreatePropertyServiceDto) {
    return await this.servicesService.createPropertyService(createPropertyServiceDto);
  }

  @Put('property-services/:id')
  async updatePropertyService(
    @Param('id') id: string,
    @Body() updatePropertyServiceDto: UpdatePropertyServiceDto,
  ) {
    return await this.servicesService.updatePropertyService(id, updatePropertyServiceDto);
  }

  @Delete('property-services/:id')
  @HttpCode(HttpStatus.OK)
  async removePropertyService(@Param('id') id: string) {
    await this.servicesService.removePropertyService(id);
    return { message: 'Property service deleted successfully' };
  }
}