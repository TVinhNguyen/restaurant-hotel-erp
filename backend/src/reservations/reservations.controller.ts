import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  // UseGuards, // Temporarily disabled
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
// import { AuthGuard } from '@nestjs/passport'; // Temporarily disabled
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiQuery,
  ApiParam,
  ApiBody,
} from '@nestjs/swagger';
import { ReservationsService } from './reservations.service';
import { CreateReservationDto } from './dto/create-reservation.dto';
import { UpdateReservationDto } from './dto/update-reservation.dto';

@ApiTags('Reservations')
@ApiBearerAuth('JWT-auth')
@Controller('reservations')
// @UseGuards(AuthGuard('jwt')) // Temporarily disabled for testing
export class ReservationsController {
  constructor(private readonly reservationsService: ReservationsService) {}

  @Get()
  @ApiOperation({ summary: 'Get all reservations with filters' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'propertyId', required: false, type: String })
  @ApiQuery({
    name: 'status',
    required: false,
    enum: [
      'pending',
      'confirmed',
      'checked_in',
      'checked_out',
      'cancelled',
      'no_show',
    ],
  })
  @ApiQuery({ name: 'checkInFrom', required: false, type: String })
  @ApiQuery({ name: 'checkInTo', required: false, type: String })
  @ApiQuery({ name: 'guestId', required: false, type: String })
  @ApiResponse({ status: 200, description: 'Reservations retrieved' })
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
  @ApiOperation({ summary: 'Get reservation by ID' })
  @ApiParam({ name: 'id', type: String })
  @ApiResponse({ status: 200, description: 'Reservation found' })
  @ApiResponse({ status: 404, description: 'Reservation not found' })
  async findOne(@Param('id') id: string) {
    return await this.reservationsService.findOne(id);
  }

  @Post()
  @ApiOperation({ summary: 'Create a new reservation' })
  @ApiBody({ type: CreateReservationDto })
  @ApiResponse({ status: 201, description: 'Reservation created' })
  async create(@Body() createReservationDto: CreateReservationDto) {
    return await this.reservationsService.create(createReservationDto);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update a reservation' })
  @ApiParam({ name: 'id', type: String })
  @ApiBody({ type: UpdateReservationDto })
  @ApiResponse({ status: 200, description: 'Reservation updated' })
  async update(
    @Param('id') id: string,
    @Body() updateReservationDto: UpdateReservationDto,
  ) {
    return await this.reservationsService.update(id, updateReservationDto);
  }

  @Post(':id/checkin')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Check-in a reservation' })
  @ApiParam({ name: 'id', type: String, description: 'Reservation ID' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        roomId: { type: 'string', description: 'Optional room assignment' },
      },
    },
  })
  @ApiResponse({ status: 200, description: 'Checked in successfully' })
  async checkIn(@Param('id') id: string, @Body() body: { roomId?: string }) {
    return await this.reservationsService.checkIn(id, body.roomId);
  }

  @Post(':id/checkout')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Check-out a reservation' })
  @ApiParam({ name: 'id', type: String })
  @ApiResponse({ status: 200, description: 'Checked out successfully' })
  async checkOut(@Param('id') id: string) {
    return await this.reservationsService.checkOut(id);
  }

  @Put(':id/room')
  @ApiOperation({ summary: 'Assign room to reservation' })
  @ApiParam({ name: 'id', type: String })
  @ApiBody({
    schema: {
      type: 'object',
      required: ['roomId'],
      properties: { roomId: { type: 'string' } },
    },
  })
  @ApiResponse({ status: 200, description: 'Room assigned' })
  async assignRoom(@Param('id') id: string, @Body() body: { roomId: string }) {
    return await this.reservationsService.assignRoom(id, body.roomId);
  }

  @Put(':id/cancel')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Cancel a reservation' })
  @ApiParam({ name: 'id', type: String })
  @ApiResponse({ status: 200, description: 'Reservation cancelled' })
  async cancel(@Param('id') id: string) {
    return await this.reservationsService.cancel(id);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Delete a reservation' })
  @ApiParam({ name: 'id', type: String })
  @ApiResponse({ status: 200, description: 'Reservation deleted' })
  async remove(@Param('id') id: string) {
    await this.reservationsService.remove(id);
    return { message: 'Reservation deleted successfully' };
  }
}
