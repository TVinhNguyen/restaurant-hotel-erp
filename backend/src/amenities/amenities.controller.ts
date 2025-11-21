import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { AmenitiesService } from './amenities.service';
import {
  CreateAmenityDto,
  UpdateAmenityDto,
  AmenityQueryDto,
} from './dto/amenity.dto';
import { AuthGuard } from '@nestjs/passport';

@ApiTags('Amenities')
@Controller('amenities')
@UseGuards(AuthGuard('jwt'))
@ApiBearerAuth('JWT-auth')
export class AmenitiesController {
  constructor(private readonly amenitiesService: AmenitiesService) { }

  @Post()
  @ApiOperation({ summary: 'Create a new amenity' })
  @ApiResponse({ status: 201, description: 'The amenity has been successfully created.' })
  create(@Body() createAmenityDto: CreateAmenityDto) {
    return this.amenitiesService.create(createAmenityDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all amenities' })
  @ApiResponse({ status: 200, description: 'Return all amenities.' })
  findAll(@Query() query: AmenityQueryDto) {
    return this.amenitiesService.findAll(query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get an amenity by id' })
  @ApiResponse({ status: 200, description: 'Return the amenity.' })
  @ApiResponse({ status: 404, description: 'Amenity not found.' })
  findOne(@Param('id') id: string) {
    return this.amenitiesService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update an amenity' })
  @ApiResponse({ status: 200, description: 'The amenity has been successfully updated.' })
  @ApiResponse({ status: 404, description: 'Amenity not found.' })
  update(@Param('id') id: string, @Body() updateAmenityDto: UpdateAmenityDto) {
    return this.amenitiesService.update(id, updateAmenityDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete an amenity' })
  @ApiResponse({ status: 200, description: 'The amenity has been successfully deleted.' })
  @ApiResponse({ status: 404, description: 'Amenity not found.' })
  remove(@Param('id') id: string) {
    return this.amenitiesService.remove(id);
  }
}
