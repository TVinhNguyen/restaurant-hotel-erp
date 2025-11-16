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
import { RoomTypesService } from './room-types.service';
import {
  CreateRoomTypeDto,
  AddAmenityToRoomTypeDto,
  BulkAddAmenitiesToRoomTypeDto,
  RoomTypeQueryDto,
} from './dto/create-room-type.dto';
import { UpdateRoomTypeDto } from './dto/update-room-type.dto';

@Controller('room-types')
@UseGuards(AuthGuard('jwt'))
export class RoomTypesController {
  constructor(private readonly roomTypesService: RoomTypesService) {}

  @Get()
  async findAll(@Query() query: RoomTypeQueryDto) {
    return await this.roomTypesService.findAll(query);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.roomTypesService.findOne(id);
  }

  @Post()
  async create(@Body() createRoomTypeDto: CreateRoomTypeDto) {
    return await this.roomTypesService.create(createRoomTypeDto);
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updateRoomTypeDto: UpdateRoomTypeDto,
  ) {
    return await this.roomTypesService.update(id, updateRoomTypeDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  async remove(@Param('id') id: string) {
    await this.roomTypesService.remove(id);
    return { message: 'Room type deleted successfully' };
  }

  // Amenity management endpoints
  @Post(':id/amenities')
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
  async removeAmenity(
    @Param('roomTypeId') roomTypeId: string,
    @Param('amenityId') amenityId: string,
  ) {
    await this.roomTypesService.removeAmenity(roomTypeId, amenityId);
    return { message: 'Amenity removed from room type successfully' };
  }

  @Post(':id/amenities/bulk')
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
