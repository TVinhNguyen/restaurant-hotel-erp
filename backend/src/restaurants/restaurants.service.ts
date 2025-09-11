import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { Restaurant } from '../entities/restaurant/restaurant.entity';
import { RestaurantTable } from '../entities/restaurant/restaurant-table.entity';
import { TableBooking as RestaurantTableBooking } from '../entities/restaurant/table-booking.entity';
import { CreateRestaurantDto } from './dto/create-restaurant.dto';
import { UpdateRestaurantDto } from './dto/update-restaurant.dto';
import { CreateTableDto, UpdateTableDto, TableStatus } from './dto/create-table.dto';
import { CreateTableBookingDto, UpdateTableBookingDto } from './dto/create-table-booking.dto';

@Injectable()
export class RestaurantsService {
  constructor(
    @InjectRepository(Restaurant)
    private restaurantRepository: Repository<Restaurant>,
    @InjectRepository(RestaurantTable)
    private tableRepository: Repository<RestaurantTable>,
    @InjectRepository(RestaurantTableBooking)
    private bookingRepository: Repository<RestaurantTableBooking>,
  ) {}

  // Restaurant CRUD Operations
  async createRestaurant(createRestaurantDto: CreateRestaurantDto): Promise<Restaurant> {
    const restaurant = this.restaurantRepository.create(createRestaurantDto);
    return await this.restaurantRepository.save(restaurant);
  }

  async findAllRestaurants(
    page: number = 1,
    limit: number = 10,
    propertyId?: string,
    cuisine?: string,
  ) {
    const queryBuilder = this.restaurantRepository
      .createQueryBuilder('restaurant')
      .leftJoinAndSelect('restaurant.property', 'property')
      .leftJoinAndSelect('restaurant.areas', 'areas')
      .leftJoinAndSelect('restaurant.tables', 'tables');

    if (propertyId) {
      queryBuilder.andWhere('restaurant.propertyId = :propertyId', { propertyId });
    }

    if (cuisine) {
      queryBuilder.andWhere('restaurant.cuisine ILIKE :cuisine', { cuisine: `%${cuisine}%` });
    }

    const [restaurants, total] = await queryBuilder
      .skip((page - 1) * limit)
      .take(limit)
      .getManyAndCount();

    return {
      data: restaurants,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findRestaurantById(id: string): Promise<Restaurant> {
    const restaurant = await this.restaurantRepository.findOne({
      where: { id },
      relations: ['property', 'areas', 'tables'],
    });

    if (!restaurant) {
      throw new NotFoundException(`Restaurant with ID ${id} not found`);
    }

    return restaurant;
  }

  async updateRestaurant(id: string, updateRestaurantDto: UpdateRestaurantDto): Promise<Restaurant> {
    await this.findRestaurantById(id);
    await this.restaurantRepository.update(id, updateRestaurantDto);
    return this.findRestaurantById(id);
  }

  async deleteRestaurant(id: string): Promise<void> {
    const restaurant = await this.findRestaurantById(id);
    await this.restaurantRepository.remove(restaurant);
  }

  // Table CRUD Operations
  async createTable(createTableDto: CreateTableDto): Promise<RestaurantTable> {
    // Check if restaurant exists
    await this.findRestaurantById(createTableDto.restaurantId);

    // Check for duplicate table number in the same restaurant
    const existingTable = await this.tableRepository.findOne({
      where: {
        restaurantId: createTableDto.restaurantId,
        tableNumber: createTableDto.tableNumber,
      },
    });

    if (existingTable) {
      throw new BadRequestException('Table number already exists in this restaurant');
    }

    const table = this.tableRepository.create({
      ...createTableDto,
      status: createTableDto.status || TableStatus.AVAILABLE,
    });

    return await this.tableRepository.save(table);
  }

  async findAllTables(
    page: number = 1,
    limit: number = 10,
    restaurantId?: string,
    status?: string,
    areaId?: string,
  ) {
    const queryBuilder = this.tableRepository
      .createQueryBuilder('table')
      .leftJoinAndSelect('table.restaurant', 'restaurant')
      .leftJoinAndSelect('table.area', 'area');

    if (restaurantId) {
      queryBuilder.andWhere('table.restaurantId = :restaurantId', { restaurantId });
    }

    if (status) {
      queryBuilder.andWhere('table.status = :status', { status });
    }

    if (areaId) {
      queryBuilder.andWhere('table.areaId = :areaId', { areaId });
    }

    const [tables, total] = await queryBuilder
      .skip((page - 1) * limit)
      .take(limit)
      .getManyAndCount();

    return {
      data: tables,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findTableById(id: string): Promise<RestaurantTable> {
    const table = await this.tableRepository.findOne({
      where: { id },
      relations: ['restaurant', 'area'],
    });

    if (!table) {
      throw new NotFoundException(`Table with ID ${id} not found`);
    }

    return table;
  }

  async updateTable(id: string, updateTableDto: UpdateTableDto): Promise<RestaurantTable> {
    await this.findTableById(id);
    await this.tableRepository.update(id, updateTableDto);
    return this.findTableById(id);
  }

  async deleteTable(id: string): Promise<void> {
    const table = await this.findTableById(id);
    await this.tableRepository.remove(table);
  }

  async getAvailableTables(
    restaurantId: string,
    date: string,
    time: string,
    partySize: number,
  ): Promise<RestaurantTable[]> {
    // Get all tables that can accommodate the party size
    const availableTables = await this.tableRepository.find({
      where: {
        restaurantId,
        status: TableStatus.AVAILABLE,
      },
    });

    // Filter tables by capacity
    const suitableTables = availableTables.filter(table => table.capacity >= partySize);

    // Check for existing bookings at the same time
    const bookings = await this.bookingRepository.find({
      where: {
        restaurantId,
        bookingDate: new Date(date),
        bookingTime: time,
        status: In(['confirmed', 'seated']),
      },
    });

    const bookedTableIds = bookings.map(booking => booking.assignedTableId).filter(Boolean);
    
    return suitableTables.filter(table => !bookedTableIds.includes(table.id));
  }

  // Table Booking CRUD Operations
  async createTableBooking(createBookingDto: CreateTableBookingDto): Promise<RestaurantTableBooking> {
    // Check if restaurant exists
    await this.findRestaurantById(createBookingDto.restaurantId);

    const booking = this.bookingRepository.create(createBookingDto);
    return await this.bookingRepository.save(booking);
  }

  async findAllBookings(
    page: number = 1,
    limit: number = 10,
    restaurantId?: string,
    status?: string,
    date?: string,
  ) {
    const queryBuilder = this.bookingRepository
      .createQueryBuilder('booking')
      .leftJoinAndSelect('booking.restaurant', 'restaurant')
      .leftJoinAndSelect('booking.assignedTable', 'assignedTable');

    if (restaurantId) {
      queryBuilder.andWhere('booking.restaurantId = :restaurantId', { restaurantId });
    }

    if (status) {
      queryBuilder.andWhere('booking.status = :status', { status });
    }

    if (date) {
      queryBuilder.andWhere('booking.bookingDate = :date', { date });
    }

    const [bookings, total] = await queryBuilder
      .orderBy('booking.bookingDate', 'DESC')
      .addOrderBy('booking.bookingTime', 'ASC')
      .skip((page - 1) * limit)
      .take(limit)
      .getManyAndCount();

    return {
      data: bookings,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findBookingById(id: string): Promise<RestaurantTableBooking> {
    const booking = await this.bookingRepository.findOne({
      where: { id },
      relations: ['restaurant', 'assignedTable'],
    });

    if (!booking) {
      throw new NotFoundException(`Booking with ID ${id} not found`);
    }

    return booking;
  }

  async updateBooking(id: string, updateBookingDto: UpdateTableBookingDto): Promise<RestaurantTableBooking> {
    await this.findBookingById(id);
    await this.bookingRepository.update(id, updateBookingDto);
    return this.findBookingById(id);
  }

  async deleteBooking(id: string): Promise<void> {
    const booking = await this.findBookingById(id);
    await this.bookingRepository.remove(booking);
  }

  // Additional booking management methods
  async confirmBooking(id: string): Promise<RestaurantTableBooking> {
    const booking = await this.findBookingById(id);
    
    if (booking.status !== 'pending') {
      throw new BadRequestException(`Cannot confirm booking with status: ${booking.status}`);
    }

    await this.bookingRepository.update(id, { status: 'confirmed' });
    return this.findBookingById(id);
  }

  async cancelBooking(id: string): Promise<RestaurantTableBooking> {
    const booking = await this.findBookingById(id);
    
    if (booking.status === 'completed') {
      throw new BadRequestException('Cannot cancel completed booking');
    }

    await this.bookingRepository.update(id, { status: 'cancelled' });
    return this.findBookingById(id);
  }

  async seatGuests(id: string, tableId: string): Promise<RestaurantTableBooking> {
    const booking = await this.findBookingById(id);
    
    if (booking.status !== 'confirmed') {
      throw new BadRequestException(`Cannot seat guests for booking with status: ${booking.status}`);
    }

    // Check if table exists and is available
    const table = await this.findTableById(tableId);
    if (table.status !== TableStatus.AVAILABLE) {
      throw new BadRequestException('Selected table is not available');
    }

    // Update table status and assign to booking
    await this.tableRepository.update(tableId, { status: TableStatus.OCCUPIED });
    await this.bookingRepository.update(id, { 
      status: 'seated',
      assignedTableId: tableId 
    });

    return this.findBookingById(id);
  }

  async completeBooking(id: string): Promise<RestaurantTableBooking> {
    const booking = await this.findBookingById(id);
    
    if (booking.status !== 'seated') {
      throw new BadRequestException(`Cannot complete booking with status: ${booking.status}`);
    }

    // Free up the table if assigned
    if (booking.assignedTableId) {
      await this.tableRepository.update(booking.assignedTableId, { 
        status: TableStatus.AVAILABLE 
      });
    }

    await this.bookingRepository.update(id, { status: 'completed' });
    return this.findBookingById(id);
  }
}