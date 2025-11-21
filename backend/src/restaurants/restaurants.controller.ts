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
  BadRequestException,
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
import { RestaurantsService } from './restaurants.service';
import { CreateRestaurantDto } from './dto/create-restaurant.dto';
import { UpdateRestaurantDto } from './dto/update-restaurant.dto';
import {
  CreateRestaurantAreaDto,
  UpdateRestaurantAreaDto,
} from './dto/create-restaurant-area.dto';
import { CreateTableDto, UpdateTableDto } from './dto/create-table.dto';
import {
  CreateTableBookingDto,
  UpdateTableBookingDto,
} from './dto/create-table-booking.dto';

@ApiTags('Restaurants')
@Controller('restaurants')
export class RestaurantsController {
  constructor(private readonly restaurantsService: RestaurantsService) { }

  // Restaurant Management Endpoints
  @Post()
  @ApiOperation({ summary: 'Create a new restaurant' })
  @ApiBody({ type: CreateRestaurantDto })
  @ApiResponse({ status: 201, description: 'Restaurant created successfully' })
  @ApiResponse({ status: 400, description: 'Invalid input data' })
  async createRestaurant(@Body() createRestaurantDto: CreateRestaurantDto) {
    return this.restaurantsService.createRestaurant(createRestaurantDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all restaurants with filters' })
  @ApiQuery({
    name: 'page',
    required: false,
    type: Number,
    example: 1,
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    type: Number,
    example: 10,
  })
  @ApiQuery({
    name: 'propertyId',
    required: false,
    type: String,
    description: 'Filter by property ID',
  })
  @ApiQuery({
    name: 'cuisineType',
    required: false,
    type: String,
    description: 'Filter by cuisine type',
  })
  @ApiResponse({ status: 200, description: 'Restaurants retrieved successfully' })
  async findAllRestaurants(
    @Query('page', ParseIntPipe) page: number = 1,
    @Query('limit', ParseIntPipe) limit: number = 10,
    @Query('propertyId') propertyId?: string,
    @Query('cuisineType') cuisineType?: string,
  ) {
    return this.restaurantsService.findAllRestaurants(
      page,
      limit,
      propertyId,
      cuisineType,
    );
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get restaurant by ID' })
  @ApiParam({ name: 'id', type: String, description: 'Restaurant ID' })
  @ApiResponse({ status: 200, description: 'Restaurant found' })
  @ApiResponse({ status: 404, description: 'Restaurant not found' })
  async findRestaurantById(@Param('id', ParseUUIDPipe) id: string) {
    return this.restaurantsService.findRestaurantById(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update a restaurant' })
  @ApiParam({ name: 'id', type: String, description: 'Restaurant ID' })
  @ApiBody({ type: UpdateRestaurantDto })
  @ApiResponse({ status: 200, description: 'Restaurant updated successfully' })
  @ApiResponse({ status: 404, description: 'Restaurant not found' })
  async updateRestaurant(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateRestaurantDto: UpdateRestaurantDto,
  ) {
    return this.restaurantsService.updateRestaurant(id, updateRestaurantDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Delete a restaurant' })
  @ApiParam({ name: 'id', type: String, description: 'Restaurant ID' })
  @ApiResponse({ status: 200, description: 'Restaurant deleted successfully' })
  @ApiResponse({ status: 404, description: 'Restaurant not found' })
  async deleteRestaurant(@Param('id', ParseUUIDPipe) id: string) {
    await this.restaurantsService.deleteRestaurant(id);
    return { message: 'Restaurant deleted successfully' };
  }

  // Restaurant Area Management Endpoints
  @Post('areas')
  @ApiOperation({ summary: 'Create a new restaurant area' })
  @ApiBody({ type: CreateRestaurantAreaDto })
  @ApiResponse({ status: 201, description: 'Area created successfully' })
  @ApiResponse({ status: 400, description: 'Invalid input data' })
  async createArea(@Body() createAreaDto: CreateRestaurantAreaDto) {
    return this.restaurantsService.createArea(createAreaDto);
  }

  @Get(':restaurantId/areas')
  @ApiOperation({ summary: 'Get all areas for a restaurant' })
  @ApiParam({ name: 'restaurantId', type: String, description: 'Restaurant ID' })
  @ApiResponse({ status: 200, description: 'Areas retrieved successfully' })
  async findAreasByRestaurant(
    @Param('restaurantId', ParseUUIDPipe) restaurantId: string,
  ) {
    return this.restaurantsService.findAreasByRestaurant(restaurantId);
  }

  @Get('areas/:id')
  @ApiOperation({ summary: 'Get area by ID' })
  @ApiParam({ name: 'id', type: String, description: 'Area ID' })
  @ApiResponse({ status: 200, description: 'Area found' })
  @ApiResponse({ status: 404, description: 'Area not found' })
  async findAreaById(@Param('id', ParseUUIDPipe) id: string) {
    return this.restaurantsService.findAreaById(id);
  }

  @Put('areas/:id')
  @ApiOperation({ summary: 'Update a restaurant area' })
  @ApiParam({ name: 'id', type: String, description: 'Area ID' })
  @ApiBody({ type: UpdateRestaurantAreaDto })
  @ApiResponse({ status: 200, description: 'Area updated successfully' })
  @ApiResponse({ status: 404, description: 'Area not found' })
  async updateArea(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateAreaDto: UpdateRestaurantAreaDto,
  ) {
    return this.restaurantsService.updateArea(id, updateAreaDto);
  }

  @Delete('areas/:id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Delete a restaurant area' })
  @ApiParam({ name: 'id', type: String, description: 'Area ID' })
  @ApiResponse({ status: 200, description: 'Area deleted successfully' })
  @ApiResponse({ status: 404, description: 'Area not found' })
  async deleteArea(@Param('id', ParseUUIDPipe) id: string) {
    await this.restaurantsService.deleteArea(id);
    return { message: 'Restaurant area deleted successfully' };
  }

  // Table Management Endpoints
  @Post('tables')
  @ApiOperation({ summary: 'Create a new table' })
  @ApiBody({ type: CreateTableDto })
  @ApiResponse({ status: 201, description: 'Table created successfully' })
  @ApiResponse({ status: 400, description: 'Invalid input data' })
  async createTable(@Body() createTableDto: CreateTableDto) {
    return this.restaurantsService.createTable(createTableDto);
  }

  @Get('tables/available')
  @ApiOperation({ summary: 'Get available tables for booking' })
  @ApiQuery({
    name: 'restaurantId',
    required: true,
    type: String,
    description: 'Restaurant ID',
  })
  @ApiQuery({
    name: 'date',
    required: true,
    type: String,
    example: '2025-12-25',
    description: 'Booking date (YYYY-MM-DD)',
  })
  @ApiQuery({
    name: 'time',
    required: true,
    type: String,
    example: '19:00',
    description: 'Booking time (HH:mm)',
  })
  @ApiQuery({
    name: 'partySize',
    required: true,
    type: Number,
    example: 4,
    description: 'Number of guests',
  })
  @ApiResponse({ status: 200, description: 'Available tables retrieved' })
  async getAvailableTables(
    @Query('restaurantId', ParseUUIDPipe) restaurantId: string,
    @Query('date') date: string,
    @Query('time') time: string,
    @Query('partySize', ParseIntPipe) partySize: number,
  ) {
    return this.restaurantsService.getAvailableTables(
      restaurantId,
      date,
      time,
      partySize,
    );
  }

  @Get('tables')
  @ApiOperation({ summary: 'Get all tables with filters' })
  @ApiQuery({ name: 'page', required: false, type: Number, example: 1 })
  @ApiQuery({ name: 'limit', required: false, type: Number, example: 10 })
  @ApiQuery({
    name: 'restaurantId',
    required: false,
    type: String,
    description: 'Filter by restaurant ID',
  })
  @ApiQuery({
    name: 'status',
    required: false,
    enum: ['available', 'occupied', 'reserved'],
    description: 'Filter by table status',
  })
  @ApiQuery({
    name: 'areaId',
    required: false,
    type: String,
    description: 'Filter by area ID',
  })
  @ApiResponse({ status: 200, description: 'Tables retrieved successfully' })
  async findAllTables(
    @Query('page', ParseIntPipe) page: number = 1,
    @Query('limit', ParseIntPipe) limit: number = 10,
    @Query('restaurantId') restaurantId?: string,
    @Query('status') status?: string,
    @Query('areaId') areaId?: string,
  ) {
    return this.restaurantsService.findAllTables(
      page,
      limit,
      restaurantId,
      status,
      areaId,
    );
  }

  @Get('tables/:id')
  @ApiOperation({ summary: 'Get table by ID' })
  @ApiParam({ name: 'id', type: String, description: 'Table ID' })
  @ApiResponse({ status: 200, description: 'Table found' })
  @ApiResponse({ status: 404, description: 'Table not found' })
  async findTableById(@Param('id', ParseUUIDPipe) id: string) {
    return this.restaurantsService.findTableById(id);
  }

  @Put('tables/:id')
  @ApiOperation({ summary: 'Update a table' })
  @ApiParam({ name: 'id', type: String, description: 'Table ID' })
  @ApiBody({ type: UpdateTableDto })
  @ApiResponse({ status: 200, description: 'Table updated successfully' })
  @ApiResponse({ status: 404, description: 'Table not found' })
  async updateTable(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateTableDto: UpdateTableDto,
  ) {
    return this.restaurantsService.updateTable(id, updateTableDto);
  }

  @Delete('tables/:id')
  @ApiOperation({ summary: 'Delete a table' })
  @ApiParam({ name: 'id', type: String, description: 'Table ID' })
  @ApiResponse({ status: 200, description: 'Table deleted successfully' })
  @ApiResponse({ status: 404, description: 'Table not found' })
  async deleteTable(@Param('id', ParseUUIDPipe) id: string) {
    await this.restaurantsService.deleteTable(id);
    return { message: 'Table deleted successfully' };
  }

  // Table Booking Management Endpoints
  @Post('bookings')
  @ApiOperation({ summary: 'Create a new table booking' })
  @ApiBody({ type: CreateTableBookingDto })
  @ApiResponse({ status: 201, description: 'Booking created successfully' })
  @ApiResponse({ status: 400, description: 'Invalid input data or no tables available' })
  async createTableBooking(@Body() createBookingDto: CreateTableBookingDto) {
    return this.restaurantsService.createTableBooking(createBookingDto);
  }

  @Get('bookings')
  @ApiOperation({ summary: 'Get all bookings with filters' })
  @ApiQuery({ name: 'page', required: false, type: Number, example: 1 })
  @ApiQuery({ name: 'limit', required: false, type: Number, example: 10 })
  @ApiQuery({
    name: 'restaurantId',
    required: false,
    type: String,
    description: 'Filter by restaurant ID',
  })
  @ApiQuery({
    name: 'status',
    required: false,
    enum: ['pending', 'confirmed', 'seated', 'completed', 'no_show', 'cancelled'],
    description: 'Filter by booking status',
  })
  @ApiQuery({
    name: 'date',
    required: false,
    type: String,
    example: '2025-12-25',
    description: 'Filter by booking date',
  })
  @ApiResponse({ status: 200, description: 'Bookings retrieved successfully' })
  async findAllBookings(
    @Query('page', ParseIntPipe) page: number = 1,
    @Query('limit', ParseIntPipe) limit: number = 10,
    @Query('restaurantId') restaurantId?: string,
    @Query('status') status?: string,
    @Query('date') date?: string,
  ) {
    return this.restaurantsService.findAllBookings(
      page,
      limit,
      restaurantId,
      status,
      date,
    );
  }

  @Get('bookings/:id')
  @ApiOperation({ summary: 'Get booking by ID' })
  @ApiParam({ name: 'id', type: String, description: 'Booking ID' })
  @ApiResponse({ status: 200, description: 'Booking found' })
  @ApiResponse({ status: 404, description: 'Booking not found' })
  async findBookingById(@Param('id', ParseUUIDPipe) id: string) {
    return this.restaurantsService.findBookingById(id);
  }

  @Put('bookings/:id')
  @ApiOperation({ summary: 'Update a booking' })
  @ApiParam({ name: 'id', type: String, description: 'Booking ID' })
  @ApiBody({ type: UpdateTableBookingDto })
  @ApiResponse({ status: 200, description: 'Booking updated successfully' })
  @ApiResponse({ status: 404, description: 'Booking not found' })
  async updateBooking(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateBookingDto: UpdateTableBookingDto,
  ) {
    return this.restaurantsService.updateBooking(id, updateBookingDto);
  }

  @Delete('bookings/:id')
  @ApiOperation({ summary: 'Cancel a booking' })
  @ApiParam({ name: 'id', type: String, description: 'Booking ID' })
  @ApiResponse({ status: 200, description: 'Booking cancelled successfully' })
  @ApiResponse({ status: 404, description: 'Booking not found' })
  async deleteBooking(@Param('id', ParseUUIDPipe) id: string) {
    await this.restaurantsService.deleteBooking(id);
    return { message: 'Booking cancelled successfully' };
  }

  // Booking Workflow Endpoints
  @Post('bookings/:id/confirm')
  @ApiOperation({ summary: 'Confirm a booking' })
  @ApiParam({ name: 'id', type: String, description: 'Booking ID' })
  @ApiResponse({ status: 200, description: 'Booking confirmed successfully' })
  @ApiResponse({ status: 404, description: 'Booking not found' })
  async confirmBooking(@Param('id', ParseUUIDPipe) id: string) {
    return this.restaurantsService.confirmBooking(id);
  }

  @Post('bookings/:id/cancel')
  @ApiOperation({ summary: 'Cancel a confirmed booking' })
  @ApiParam({ name: 'id', type: String, description: 'Booking ID' })
  @ApiResponse({ status: 200, description: 'Booking cancelled successfully' })
  @ApiResponse({ status: 404, description: 'Booking not found' })
  async cancelBooking(@Param('id', ParseUUIDPipe) id: string) {
    return this.restaurantsService.cancelBooking(id);
  }

  @Post('bookings/:id/seat')
  @ApiOperation({ summary: 'Seat guests for a booking' })
  @ApiParam({ name: 'id', type: String, description: 'Booking ID' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        tableId: { type: 'string', format: 'uuid', description: 'Table ID to assign' },
      },
      required: ['tableId'],
    },
  })
  @ApiResponse({ status: 200, description: 'Guests seated successfully' })
  @ApiResponse({ status: 404, description: 'Booking or table not found' })
  async seatBooking(
    @Param('id', ParseUUIDPipe) id: string,
    @Body('tableId', ParseUUIDPipe) tableId: string,
  ) {
    return this.restaurantsService.seatBooking(id, tableId);
  }

  @Post('bookings/:id/complete')
  @ApiOperation({ summary: 'Complete a booking' })
  @ApiParam({ name: 'id', type: String, description: 'Booking ID' })
  @ApiResponse({ status: 200, description: 'Booking completed successfully' })
  @ApiResponse({ status: 404, description: 'Booking not found' })
  async completeBooking(@Param('id', ParseUUIDPipe) id: string) {
    return this.restaurantsService.completeBooking(id);
  }
}
