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
} from '@nestjs/swagger';
import { PropertiesService } from './properties.service';
import { CreatePropertyDto } from './dto/create-property.dto';
import { UpdatePropertyDto } from './dto/update-property.dto';

@ApiTags('Properties')
@Controller('properties')
export class PropertiesController {
  constructor(private readonly propertiesService: PropertiesService) {}

  @Get()
  @ApiOperation({
    summary: 'Get all properties',
    description:
      'Retrieve paginated list of properties with optional filtering',
  })
  @ApiQuery({
    name: 'page',
    required: false,
    type: Number,
    description: 'Page number (default: 1)',
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    type: Number,
    description: 'Items per page (default: 10)',
  })
  @ApiQuery({
    name: 'type',
    required: false,
    type: String,
    description: 'Filter by property type (hotel, resort, etc.)',
  })
  @ApiResponse({
    status: 200,
    description: 'Properties retrieved successfully',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
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

  // Specific routes must come before dynamic routes
  @Get(':id/rooms')
  async findOneWithRooms(@Param('id') id: string) {
    return await this.propertiesService.findOneWithRooms(id);
  }

  @Get(':id/restaurants')
  async findOneWithRestaurants(@Param('id') id: string) {
    return await this.propertiesService.findOneWithRestaurants(id);
  }

  @Get(':id')
  async findOne(@Param('id') id: string, @Query('include') include?: string) {
    // Parse comma-separated relations from query
    if (include) {
      const relations = include.split(',').map((rel) => rel.trim());
      return await this.propertiesService.findOneWithDetails(id, relations);
    }

    // Default: return property without relations for better performance
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
