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
import { PropertyServicesService } from './property-services.service';
import { CreatePropertyServiceDto } from './dto/create-property-service.dto';
import { UpdatePropertyServiceDto } from './dto/update-property-service.dto';

@Controller('property-services')
@UseGuards(AuthGuard('jwt'))
export class PropertyServicesController {
  constructor(
    private readonly propertyServicesService: PropertyServicesService,
  ) {}

  @Get()
  async findAllPropertyServices(
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('propertyId') propertyId?: string,
    @Query('isActive') isActive?: string,
  ) {
    const pageNum = page ? parseInt(page, 10) : 1;
    const limitNum = limit ? parseInt(limit, 10) : 10;

    return await this.propertyServicesService.findAllPropertyServices({
      page: pageNum,
      limit: limitNum,
      propertyId,
    });
  }

  @Get(':id')
  async findOnePropertyService(@Param('id') id: string) {
    return await this.propertyServicesService.findOnePropertyService(id);
  }

  @Post()
  async createPropertyService(
    @Body() createPropertyServiceDto: CreatePropertyServiceDto,
  ) {
    return await this.propertyServicesService.createPropertyService(
      createPropertyServiceDto,
    );
  }

  @Put(':id')
  async updatePropertyService(
    @Param('id') id: string,
    @Body() updatePropertyServiceDto: UpdatePropertyServiceDto,
  ) {
    return await this.propertyServicesService.updatePropertyService(
      id,
      updatePropertyServiceDto,
    );
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  async removePropertyService(@Param('id') id: string) {
    await this.propertyServicesService.removePropertyService(id);
    return { message: 'Property service deleted successfully' };
  }
}
