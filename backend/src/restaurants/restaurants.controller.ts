import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  ParseUUIDPipe,
  ParseIntPipe,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { RestaurantsService } from './restaurants.service';
import { CreateRestaurantDto } from './dto/create-restaurant.dto';
import { UpdateRestaurantDto } from './dto/update-restaurant.dto';
import { CreateTableDto, UpdateTableDto } from './dto/create-table.dto';
import { CreateTableBookingDto, UpdateTableBookingDto } from './dto/create-table-booking.dto';

@Controller('restaurants')
@UseGuards(AuthGuard('jwt'))
export class RestaurantsController {
  constructor(private readonly restaurantsService: RestaurantsService) {}

  // Restaurant Management Endpoints
  @Post()
  async createRestaurant(@Body() createRestaurantDto: CreateRestaurantDto) {
    return this.restaurantsService.createRestaurant(createRestaurantDto);
  }

  @Get()
  async findAllRestaurants(
    @Query('page', ParseIntPipe) page: number = 1,
    @Query('limit', ParseIntPipe) limit: number = 10,
    @Query('propertyId') propertyId?: string,
    @Query('cuisine') cuisine?: string,
  ) {
    return this.restaurantsService.findAllRestaurants(page, limit, propertyId, cuisine);
  }

  @Get(':id')
  async findRestaurantById(@Param('id', ParseUUIDPipe) id: string) {
    return this.restaurantsService.findRestaurantById(id);
  }

  @Put(':id')
  async updateRestaurant(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateRestaurantDto: UpdateRestaurantDto,
  ) {
    return this.restaurantsService.updateRestaurant(id, updateRestaurantDto);
  }

  @Delete(':id')
  async deleteRestaurant(@Param('id', ParseUUIDPipe) id: string) {
    await this.restaurantsService.deleteRestaurant(id);
    return { message: 'Restaurant deleted successfully' };
  }

  // Table Management Endpoints
  @Post('tables')
  async createTable(@Body() createTableDto: CreateTableDto) {
    return this.restaurantsService.createTable(createTableDto);
  }

  @Get('tables/available')
  async getAvailableTables(
    @Query('restaurantId', ParseUUIDPipe) restaurantId: string,
    @Query('date') date: string,
    @Query('time') time: string,
    @Query('partySize', ParseIntPipe) partySize: number,
  ) {
    return this.restaurantsService.getAvailableTables(restaurantId, date, time, partySize);
  }

  @Get('tables')
  async findAllTables(
    @Query('page', ParseIntPipe) page: number = 1,
    @Query('limit', ParseIntPipe) limit: number = 10,
    @Query('restaurantId') restaurantId?: string,
    @Query('status') status?: string,
    @Query('areaId') areaId?: string,
  ) {
    return this.restaurantsService.findAllTables(page, limit, restaurantId, status, areaId);
  }

  @Get('tables/:id')
  async findTableById(@Param('id', ParseUUIDPipe) id: string) {
    return this.restaurantsService.findTableById(id);
  }

  @Put('tables/:id')
  async updateTable(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateTableDto: UpdateTableDto,
  ) {
    return this.restaurantsService.updateTable(id, updateTableDto);
  }

  @Delete('tables/:id')
  async deleteTable(@Param('id', ParseUUIDPipe) id: string) {
    await this.restaurantsService.deleteTable(id);
    return { message: 'Table deleted successfully' };
  }

  // Table Booking Management Endpoints
  @Post('bookings')
  async createTableBooking(@Body() createBookingDto: CreateTableBookingDto) {
    return this.restaurantsService.createTableBooking(createBookingDto);
  }

  @Get('bookings')
  async findAllBookings(
    @Query('page', ParseIntPipe) page: number = 1,
    @Query('limit', ParseIntPipe) limit: number = 10,
    @Query('restaurantId') restaurantId?: string,
    @Query('status') status?: string,
    @Query('date') date?: string,
  ) {
    return this.restaurantsService.findAllBookings(page, limit, restaurantId, status, date);
  }

  @Get('bookings/:id')
  async findBookingById(@Param('id', ParseUUIDPipe) id: string) {
    return this.restaurantsService.findBookingById(id);
  }

  @Put('bookings/:id')
  async updateBooking(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateBookingDto: UpdateTableBookingDto,
  ) {
    return this.restaurantsService.updateBooking(id, updateBookingDto);
  }

  @Delete('bookings/:id')
  async deleteBooking(@Param('id', ParseUUIDPipe) id: string) {
    await this.restaurantsService.deleteBooking(id);
    return { message: 'Booking deleted successfully' };
  }

  // Booking Workflow Endpoints
  @Post('bookings/:id/confirm')
  async confirmBooking(@Param('id', ParseUUIDPipe) id: string) {
    return this.restaurantsService.confirmBooking(id);
  }

  @Post('bookings/:id/cancel')
  async cancelBooking(@Param('id', ParseUUIDPipe) id: string) {
    return this.restaurantsService.cancelBooking(id);
  }

  @Post('bookings/:id/seat')
  async seatGuests(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() body: { tableId?: string },
  ) {
    return this.restaurantsService.seatGuests(id, body.tableId);
  }

  @Post('bookings/:id/complete')
  async completeBooking(@Param('id', ParseUUIDPipe) id: string) {
    return this.restaurantsService.completeBooking(id);
  }
}