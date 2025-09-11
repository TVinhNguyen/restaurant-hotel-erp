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
import { CreateRoomTypeDto } from './dto/create-room-type.dto';
import { UpdateRoomTypeDto } from './dto/update-room-type.dto';

@Controller('room-types')
@UseGuards(AuthGuard('jwt'))
export class RoomTypesController {
  constructor(private readonly roomTypesService: RoomTypesService) {}

  @Get()
  async findAll(
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('propertyId') propertyId?: string,
  ) {
    const pageNum = page ? parseInt(page, 10) : 1;
    const limitNum = limit ? parseInt(limit, 10) : 10;

    return await this.roomTypesService.findAll({
      page: pageNum,
      limit: limitNum,
      propertyId,
    });
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
}