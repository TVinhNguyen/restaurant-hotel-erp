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
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { RoomTypesService } from './room-types.service';
import {
  CreateRoomTypeDto,
  AddAmenityToRoomTypeDto,
  BulkAddAmenitiesToRoomTypeDto,
  RoomTypeQueryDto,
} from './dto/create-room-type.dto';
import { UpdateRoomTypeDto } from './dto/update-room-type.dto';

@ApiTags('Room Types')
@Controller('room-types')
export class RoomTypesController {
  constructor(private readonly roomTypesService: RoomTypesService) { }

  @Get()
  @ApiOperation({ summary: 'Get all room types' })
  @ApiResponse({ status: 200, description: 'Return all room types.' })
  async findAll(@Query() query: RoomTypeQueryDto) {
    return await this.roomTypesService.findAll(query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a room type by id' })
  @ApiResponse({ status: 200, description: 'Return the room type.' })
  @ApiResponse({ status: 404, description: 'Room type not found.' })
  async findOne(@Param('id') id: string) {
    return await this.roomTypesService.findOne(id);
  }

  @Post()
  @ApiOperation({ summary: 'Create a new room type' })
  @ApiResponse({ status: 201, description: 'The room type has been successfully created.' })
  async create(@Body() createRoomTypeDto: CreateRoomTypeDto) {
    return await this.roomTypesService.create(createRoomTypeDto);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update a room type' })
  @ApiResponse({ status: 200, description: 'The room type has been successfully updated.' })
  @ApiResponse({ status: 404, description: 'Room type not found.' })
  async update(
    @Param('id') id: string,
    @Body() updateRoomTypeDto: UpdateRoomTypeDto,
  ) {
    return await this.roomTypesService.update(id, updateRoomTypeDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Delete a room type' })
  @ApiResponse({ status: 200, description: 'The room type has been successfully deleted.' })
  @ApiResponse({ status: 404, description: 'Room type not found.' })
  async remove(@Param('id') id: string) {
    await this.roomTypesService.remove(id);
    return { message: 'Room type deleted successfully' };
  }

  // Amenity management endpoints
  @Post(':id/amenities')
  @ApiOperation({ summary: 'Add an amenity to a room type' })
  @ApiResponse({ status: 201, description: 'The amenity has been successfully added to the room type.' })
  async addAmenity(
    @Param('id') roomTypeId: string,
    @Body() addAmenityDto: AddAmenityToRoomTypeDto,
  ) {
    return await this.roomTypesService.addAmenity(
      roomTypeId,
      addAmenityDto.amenityId,
    );
  }

  @Delete(':roomTypeId/amenities/:amenityId')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Remove an amenity from a room type' })
  @ApiResponse({ status: 200, description: 'The amenity has been successfully removed from the room type.' })
  async removeAmenity(
    @Param('roomTypeId') roomTypeId: string,
    @Param('amenityId') amenityId: string,
  ) {
    await this.roomTypesService.removeAmenity(roomTypeId, amenityId);
    return { message: 'Amenity removed from room type successfully' };
  }

  @Post(':id/amenities/bulk')
  @ApiOperation({ summary: 'Add multiple amenities to a room type' })
  @ApiResponse({ status: 201, description: 'The amenities have been successfully added to the room type.' })
  async addMultipleAmenities(
    @Param('id') roomTypeId: string,
    @Body() bulkAddDto: BulkAddAmenitiesToRoomTypeDto,
  ) {
    return await this.roomTypesService.addMultipleAmenities(
      roomTypeId,
      bulkAddDto.amenityIds,
    );
  }
}
