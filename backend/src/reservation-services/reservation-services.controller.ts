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
import { ReservationServicesService } from './reservation-services.service';
import { CreateReservationServiceDto } from './dto/create-reservation-service.dto';
import { UpdateReservationServiceDto } from './dto/update-reservation-service.dto';

@Controller('reservation-services')
@UseGuards(AuthGuard('jwt'))
export class ReservationServicesController {
  constructor(private readonly reservationServicesService: ReservationServicesService) {}

  @Get()
  async findAll(
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('reservationId') reservationId?: string,
    @Query('propertyServiceId') propertyServiceId?: string,
  ) {
    const pageNum = page ? parseInt(page, 10) : 1;
    const limitNum = limit ? parseInt(limit, 10) : 10;

    return await this.reservationServicesService.findAll({
      page: pageNum,
      limit: limitNum,
      reservationId,
      propertyServiceId,
    });
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.reservationServicesService.findOne(id);
  }

  @Post()
  async create(@Body() createReservationServiceDto: CreateReservationServiceDto) {
    return await this.reservationServicesService.create(createReservationServiceDto);
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updateReservationServiceDto: UpdateReservationServiceDto,
  ) {
    return await this.reservationServicesService.update(id, updateReservationServiceDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  async remove(@Param('id') id: string) {
    await this.reservationServicesService.remove(id);
    return { message: 'Reservation service deleted successfully' };
  }

  @Get('reservation/:reservationId')
  async findByReservation(@Param('reservationId') reservationId: string) {
    return await this.reservationServicesService.findByReservation(reservationId);
  }

  @Get('reservation/:reservationId/total')
  async getTotalServiceAmount(@Param('reservationId') reservationId: string) {
    const total = await this.reservationServicesService.getTotalServiceAmount(reservationId);
    return { reservationId, totalServiceAmount: total };
  }

  @Get('statistics/services')
  async getServiceStatistics(
    @Query('propertyId') propertyId?: string,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ) {
    return await this.reservationServicesService.getServiceStatistics(
      propertyId,
      startDate,
      endDate,
    );
  }
}
