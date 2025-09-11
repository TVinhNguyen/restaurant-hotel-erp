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
import { RoomsService } from './rooms.service';
import { CreateRoomDto } from './dto/create-room.dto';
import { UpdateRoomDto } from './dto/update-room.dto';

@Controller('rooms')
@UseGuards(AuthGuard('jwt'))
export class RoomsController {
  constructor(private readonly roomsService: RoomsService) {}

  @Get()
  async findAll(
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('propertyId') propertyId?: string,
    @Query('roomTypeId') roomTypeId?: string,
    @Query('status') status?: string,
    @Query('floor') floor?: string,
  ) {
    const pageNum = page ? parseInt(page, 10) : 1;
    const limitNum = limit ? parseInt(limit, 10) : 10;

    return await this.roomsService.findAll({
      page: pageNum,
      limit: limitNum,
      propertyId,
      roomTypeId,
      status,
      floor,
    });
  }

  @Get('available')
  async findAvailable(
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('propertyId') propertyId?: string,
    @Query('checkIn') checkIn?: string,
    @Query('checkOut') checkOut?: string,
  ) {
    const pageNum = page ? parseInt(page, 10) : 1;
    const limitNum = limit ? parseInt(limit, 10) : 10;

    return await this.roomsService.findAvailable({
      page: pageNum,
      limit: limitNum,
      propertyId,
      checkIn,
      checkOut,
    });
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.roomsService.findOne(id);
  }

  @Post()
  async create(@Body() createRoomDto: CreateRoomDto) {
    return await this.roomsService.create(createRoomDto);
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updateRoomDto: UpdateRoomDto,
  ) {
    return await this.roomsService.update(id, updateRoomDto);
  }

  @Put(':id/status')
  async updateStatus(
    @Param('id') id: string,
    @Body() statusData: {
      operationalStatus?: 'available' | 'out_of_service';
      housekeepingStatus?: 'clean' | 'dirty' | 'inspected';
      housekeeperNotes?: string;
    },
  ) {
    return await this.roomsService.updateStatus(id, statusData);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  async remove(@Param('id') id: string) {
    await this.roomsService.remove(id);
    return { message: 'Room deleted successfully' };
  }
}