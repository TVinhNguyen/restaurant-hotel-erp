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
import { ReservationServicesService } from './reservation-services.service';
import { CreateReservationServiceDto } from './dto/create-reservation-service.dto';
import { UpdateReservationServiceDto } from './dto/update-reservation-service.dto';

@ApiTags('Reservation Services')
@ApiBearerAuth('JWT-auth')
@Controller('reservation-services')
@UseGuards(AuthGuard('jwt'))
export class ReservationServicesController {
  constructor(
    private readonly reservationServicesService: ReservationServicesService,
  ) {}

  @Get()
  @ApiOperation({ summary: 'Get all reservation services' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'reservationId', required: false, type: String })
  @ApiQuery({ name: 'propertyServiceId', required: false, type: String })
  @ApiResponse({ status: 200, description: 'Reservation services retrieved' })
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
  @ApiOperation({ summary: 'Get reservation service by ID' })
  @ApiParam({ name: 'id', type: String })
  @ApiResponse({ status: 200, description: 'Reservation service found' })
  async findOne(@Param('id') id: string) {
    return await this.reservationServicesService.findOne(id);
  }

  @Post()
  @ApiOperation({ summary: 'Add service to reservation' })
  @ApiBody({ type: CreateReservationServiceDto })
  @ApiResponse({ status: 201, description: 'Service added to reservation' })
  async create(
    @Body() createReservationServiceDto: CreateReservationServiceDto,
  ) {
    return await this.reservationServicesService.create(
      createReservationServiceDto,
    );
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update reservation service' })
  @ApiParam({ name: 'id', type: String })
  @ApiBody({ type: UpdateReservationServiceDto })
  @ApiResponse({ status: 200, description: 'Reservation service updated' })
  async update(
    @Param('id') id: string,
    @Body() updateReservationServiceDto: UpdateReservationServiceDto,
  ) {
    return await this.reservationServicesService.update(
      id,
      updateReservationServiceDto,
    );
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Remove service from reservation' })
  @ApiParam({ name: 'id', type: String })
  @ApiResponse({ status: 200, description: 'Service removed' })
  async remove(@Param('id') id: string) {
    await this.reservationServicesService.remove(id);
    return { message: 'Reservation service deleted successfully' };
  }

  @Get('reservation/:reservationId')
  @ApiOperation({ summary: 'Get all services for a reservation' })
  @ApiParam({ name: 'reservationId', type: String })
  @ApiResponse({ status: 200, description: 'Services retrieved' })
  async findByReservation(@Param('reservationId') reservationId: string) {
    return await this.reservationServicesService.findByReservation(
      reservationId,
    );
  }

  @Get('reservation/:reservationId/total')
  @ApiOperation({ summary: 'Get total service amount for reservation' })
  @ApiParam({ name: 'reservationId', type: String })
  @ApiResponse({
    status: 200,
    description: 'Total service amount calculated',
  })
  async getTotalServiceAmount(@Param('reservationId') reservationId: string) {
    const total =
      await this.reservationServicesService.getTotalServiceAmount(
        reservationId,
      );
    return { reservationId, totalServiceAmount: total };
  }

  @Get('statistics/services')
  @ApiOperation({ summary: 'Get service usage statistics' })
  @ApiQuery({ name: 'propertyId', required: false, type: String })
  @ApiQuery({ name: 'startDate', required: false, type: String })
  @ApiQuery({ name: 'endDate', required: false, type: String })
  @ApiResponse({ status: 200, description: 'Statistics retrieved' })
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
