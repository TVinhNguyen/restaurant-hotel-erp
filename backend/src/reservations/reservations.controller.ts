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
import { ReservationsService } from './reservations.service';
import { CreateReservationDto } from './dto/create-reservation.dto';
import { UpdateReservationDto } from './dto/update-reservation.dto';

@Controller('reservations')
@UseGuards(AuthGuard('jwt'))
export class ReservationsController {
  constructor(private readonly reservationsService: ReservationsService) {}

  @Get()
  async findAll(
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('propertyId') propertyId?: string,
    @Query('status') status?: string,
    @Query('checkInFrom') checkInFrom?: string,
    @Query('checkInTo') checkInTo?: string,
    @Query('guestId') guestId?: string,
  ) {
    const pageNum = page ? parseInt(page, 10) : 1;
    const limitNum = limit ? parseInt(limit, 10) : 10;

    return await this.reservationsService.findAll({
      page: pageNum,
      limit: limitNum,
      propertyId,
      status,
      checkInFrom,
      checkInTo,
      guestId,
    });
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.reservationsService.findOne(id);
  }

  @Post()
  async create(@Body() createReservationDto: CreateReservationDto) {
    return await this.reservationsService.create(createReservationDto);
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updateReservationDto: UpdateReservationDto,
  ) {
    return await this.reservationsService.update(id, updateReservationDto);
  }

  @Post(':id/checkin')
  @HttpCode(HttpStatus.OK)
  async checkIn(
    @Param('id') id: string,
    @Body() body: { roomId?: string },
  ) {
    return await this.reservationsService.checkIn(id, body.roomId);
  }

  @Post(':id/checkout')
  @HttpCode(HttpStatus.OK)
  async checkOut(@Param('id') id: string) {
    return await this.reservationsService.checkOut(id);
  }

  @Put(':id/room')
  async assignRoom(
    @Param('id') id: string,
    @Body() body: { roomId: string },
  ) {
    return await this.reservationsService.assignRoom(id, body.roomId);
  }

  @Put(':id/cancel')
  @HttpCode(HttpStatus.OK)
  async cancel(@Param('id') id: string) {
    return await this.reservationsService.cancel(id);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  async remove(@Param('id') id: string) {
    await this.reservationsService.remove(id);
    return { message: 'Reservation deleted successfully' };
  }
}