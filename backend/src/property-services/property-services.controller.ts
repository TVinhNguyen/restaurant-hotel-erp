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
import { PropertyServicesService } from './property-services.service';
import { CreatePropertyServiceDto } from './dto/create-property-service.dto';
import { UpdatePropertyServiceDto } from './dto/update-property-service.dto';

@ApiTags('Property Services')
@ApiBearerAuth('JWT-auth')
@Controller('property-services')
@UseGuards(AuthGuard('jwt'))
export class PropertyServicesController {
  constructor(
    private readonly propertyServicesService: PropertyServicesService,
  ) {}

  @Get()
  @ApiOperation({ summary: 'Get all property services' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'propertyId', required: false, type: String })
  @ApiQuery({ name: 'isActive', required: false, type: String })
  @ApiResponse({ status: 200, description: 'Property services retrieved' })
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
  @ApiOperation({ summary: 'Get property service by ID' })
  @ApiParam({ name: 'id', type: String })
  @ApiResponse({ status: 200, description: 'Property service found' })
  async findOnePropertyService(@Param('id') id: string) {
    return await this.propertyServicesService.findOnePropertyService(id);
  }

  @Post()
  @ApiOperation({ summary: 'Create a new property service' })
  @ApiBody({ type: CreatePropertyServiceDto })
  @ApiResponse({ status: 201, description: 'Property service created' })
  async createPropertyService(
    @Body() createPropertyServiceDto: CreatePropertyServiceDto,
  ) {
    return await this.propertyServicesService.createPropertyService(
      createPropertyServiceDto,
    );
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update a property service' })
  @ApiParam({ name: 'id', type: String })
  @ApiBody({ type: UpdatePropertyServiceDto })
  @ApiResponse({ status: 200, description: 'Property service updated' })
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
  @ApiOperation({ summary: 'Delete a property service' })
  @ApiParam({ name: 'id', type: String })
  @ApiResponse({ status: 200, description: 'Property service deleted' })
  async removePropertyService(@Param('id') id: string) {
    await this.propertyServicesService.removePropertyService(id);
    return { message: 'Property service deleted successfully' };
  }
}
