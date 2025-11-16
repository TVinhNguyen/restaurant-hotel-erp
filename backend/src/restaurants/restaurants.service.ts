import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Restaurant } from '../entities/restaurant/restaurant.entity';
import { RestaurantArea } from '../entities/restaurant/restaurant-area.entity';
import { RestaurantTable } from '../entities/restaurant/restaurant-table.entity';
import { TableBooking } from '../entities/restaurant/table-booking.entity';
import { Property } from '../entities/core/property.entity';
import { Guest } from '../entities/core/guest.entity';
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

@Injectable()
export class RestaurantsService {
  constructor(
    @InjectRepository(Restaurant)
    private restaurantRepository: Repository<Restaurant>,
    @InjectRepository(RestaurantArea)
    private areaRepository: Repository<RestaurantArea>,
    @InjectRepository(RestaurantTable)
    private tableRepository: Repository<RestaurantTable>,
    @InjectRepository(TableBooking)
    private bookingRepository: Repository<TableBooking>,
    @InjectRepository(Property)
    private propertyRepository: Repository<Property>,
    @InjectRepository(Guest)
    private guestRepository: Repository<Guest>,
  ) {}

  // Restaurant CRUD
  async createRestaurant(
    createRestaurantDto: CreateRestaurantDto,
  ): Promise<Restaurant> {
    // Verify property exists
    const property = await this.propertyRepository.findOne({
      where: { id: createRestaurantDto.propertyId },
    });
    if (!property) {
      throw new NotFoundException('Property not found');
    }

    const restaurant = this.restaurantRepository.create(createRestaurantDto);
    return await this.restaurantRepository.save(restaurant);
  }

  async findAllRestaurants(
    page: number = 1,
    limit: number = 10,
    propertyId?: string,
    cuisine?: string,
  ): Promise<{ restaurants: Restaurant[]; total: number }> {
    const queryBuilder = this.restaurantRepository
      .createQueryBuilder('restaurant')
      .leftJoinAndSelect('restaurant.property', 'property')
      .leftJoinAndSelect('restaurant.areas', 'areas')
      .leftJoinAndSelect('restaurant.tables', 'tables');

    if (propertyId) {
      queryBuilder.andWhere('restaurant.propertyId = :propertyId', {
        propertyId,
      });
    }

    if (cuisine) {
      queryBuilder.andWhere('restaurant.cuisine = :cuisine', { cuisine });
    }

    const total = await queryBuilder.getCount();
    const restaurants = await queryBuilder
      .skip((page - 1) * limit)
      .take(limit)
      .getMany();

    return { restaurants, total };
  }

  async findRestaurantById(id: string): Promise<Restaurant> {
    const restaurant = await this.restaurantRepository.findOne({
      where: { id },
      relations: ['property', 'areas', 'tables'],
    });
    if (!restaurant) {
      throw new NotFoundException('Restaurant not found');
    }
    return restaurant;
  }

  async updateRestaurant(
    id: string,
    updateRestaurantDto: UpdateRestaurantDto,
  ): Promise<Restaurant> {
    const restaurant = await this.findRestaurantById(id);
    Object.assign(restaurant, updateRestaurantDto);
    return await this.restaurantRepository.save(restaurant);
  }

  async deleteRestaurant(id: string): Promise<void> {
    const restaurant = await this.findRestaurantById(id);
    await this.restaurantRepository.remove(restaurant);
  }

  // RestaurantArea CRUD
  async createArea(
    createAreaDto: CreateRestaurantAreaDto,
  ): Promise<RestaurantArea> {
    // Verify restaurant exists
    await this.findRestaurantById(createAreaDto.restaurantId);

    const area = this.areaRepository.create(createAreaDto);
    return await this.areaRepository.save(area);
  }

  async findAreasByRestaurant(restaurantId: string): Promise<RestaurantArea[]> {
    return await this.areaRepository.find({
      where: { restaurantId },
      relations: ['restaurant', 'tables'],
    });
  }

  async findAreaById(id: string): Promise<RestaurantArea> {
    const area = await this.areaRepository.findOne({
      where: { id },
      relations: ['restaurant', 'tables'],
    });
    if (!area) {
      throw new NotFoundException('Restaurant area not found');
    }
    return area;
  }

  async updateArea(
    id: string,
    updateAreaDto: UpdateRestaurantAreaDto,
  ): Promise<RestaurantArea> {
    const area = await this.findAreaById(id);
    Object.assign(area, updateAreaDto);
    return await this.areaRepository.save(area);
  }

  async deleteArea(id: string): Promise<void> {
    const area = await this.findAreaById(id);

    // Check if area has tables
    const tablesCount = await this.tableRepository.count({
      where: { areaId: id },
    });
    if (tablesCount > 0) {
      throw new BadRequestException('Cannot delete area that contains tables');
    }

    await this.areaRepository.remove(area);
  }

  // Table CRUD
  async createTable(createTableDto: CreateTableDto): Promise<RestaurantTable> {
    // Verify restaurant exists
    const restaurant = await this.findRestaurantById(
      createTableDto.restaurantId,
    );

    // Check if table number already exists in this restaurant
    const existingTable = await this.tableRepository.findOne({
      where: {
        restaurantId: createTableDto.restaurantId,
        tableNumber: createTableDto.tableNumber,
      },
    });
    if (existingTable) {
      throw new BadRequestException(
        'Table number already exists in this restaurant',
      );
    }

    const table = this.tableRepository.create(createTableDto);
    return await this.tableRepository.save(table);
  }

  async findTablesByRestaurant(
    restaurantId: string,
  ): Promise<RestaurantTable[]> {
    return await this.tableRepository.find({
      where: { restaurantId },
      relations: ['restaurant', 'area'],
    });
  }

  async findTableById(id: string): Promise<RestaurantTable> {
    const table = await this.tableRepository.findOne({
      where: { id },
      relations: ['restaurant', 'area'],
    });
    if (!table) {
      throw new NotFoundException('Table not found');
    }
    return table;
  }

  async updateTable(
    id: string,
    updateTableDto: UpdateTableDto,
  ): Promise<RestaurantTable> {
    const table = await this.findTableById(id);
    Object.assign(table, updateTableDto);
    return await this.tableRepository.save(table);
  }

  async deleteTable(id: string): Promise<void> {
    const table = await this.findTableById(id);
    await this.tableRepository.remove(table);
  }

  // Table Booking CRUD
  async createTableBooking(
    createBookingDto: CreateTableBookingDto,
  ): Promise<TableBooking> {
    // Verify restaurant exists
    await this.findRestaurantById(createBookingDto.restaurantId);

    // Verify guest exists if provided
    if (createBookingDto.guestId) {
      const guest = await this.guestRepository.findOne({
        where: { id: createBookingDto.guestId },
      });
      if (!guest) {
        throw new NotFoundException('Guest not found');
      }
    }

    const booking = this.bookingRepository.create(createBookingDto);
    return await this.bookingRepository.save(booking);
  }

  async findBookingsByRestaurant(
    restaurantId: string,
  ): Promise<TableBooking[]> {
    return await this.bookingRepository.find({
      where: { restaurantId },
      relations: ['restaurant', 'guest', 'reservation'],
      order: { bookingDate: 'DESC', bookingTime: 'ASC' },
    });
  }

  async findBookingById(id: string): Promise<TableBooking> {
    const booking = await this.bookingRepository.findOne({
      where: { id },
      relations: ['restaurant', 'guest', 'reservation'],
    });
    if (!booking) {
      throw new NotFoundException('Table booking not found');
    }
    return booking;
  }

  async updateTableBooking(
    id: string,
    updateBookingDto: UpdateTableBookingDto,
  ): Promise<TableBooking> {
    const booking = await this.findBookingById(id);

    // Verify guest exists if being updated
    if (updateBookingDto.guestId) {
      const guest = await this.guestRepository.findOne({
        where: { id: updateBookingDto.guestId },
      });
      if (!guest) {
        throw new NotFoundException('Guest not found');
      }
    }

    Object.assign(booking, updateBookingDto);
    return await this.bookingRepository.save(booking);
  }

  async deleteTableBooking(id: string): Promise<void> {
    const booking = await this.findBookingById(id);
    await this.bookingRepository.remove(booking);
  }

  // Additional utility methods
  async getAvailableTables(
    restaurantId: string,
    date: string,
    time: string,
    partySize?: number,
  ): Promise<RestaurantTable[]> {
    // Get all tables for the restaurant
    const allTables = await this.findTablesByRestaurant(restaurantId);

    // Get booked tables for the specific date and time
    const bookedTables = await this.bookingRepository
      .createQueryBuilder('booking')
      .select('booking.tableId')
      .where('booking.restaurantId = :restaurantId', { restaurantId })
      .andWhere('booking.bookingDate = :date', { date })
      .andWhere('booking.bookingTime = :time', { time })
      .andWhere('booking.status IN (:...statuses)', {
        statuses: ['confirmed', 'seated'],
      })
      .getRawMany();

    const bookedTableIds = bookedTables.map((bt) => bt.tableId);

    return allTables.filter(
      (table) =>
        !bookedTableIds.includes(table.id) && table.status === 'available',
    );
  }

  // Table management methods
  async findAllTables(
    page: number = 1,
    limit: number = 10,
    restaurantId?: string,
    status?: string,
    areaId?: string,
  ): Promise<{ tables: RestaurantTable[]; total: number }> {
    const queryBuilder = this.tableRepository
      .createQueryBuilder('table')
      .leftJoinAndSelect('table.restaurant', 'restaurant')
      .leftJoinAndSelect('table.area', 'area');

    if (restaurantId) {
      queryBuilder.andWhere('table.restaurantId = :restaurantId', {
        restaurantId,
      });
    }

    if (status) {
      queryBuilder.andWhere('table.status = :status', { status });
    }

    if (areaId) {
      queryBuilder.andWhere('table.areaId = :areaId', { areaId });
    }

    const total = await queryBuilder.getCount();
    const tables = await queryBuilder
      .skip((page - 1) * limit)
      .take(limit)
      .getMany();

    return { tables, total };
  }

  // Booking management methods
  async findAllBookings(
    page: number = 1,
    limit: number = 10,
    restaurantId?: string,
    status?: string,
    date?: string,
  ): Promise<{ bookings: TableBooking[]; total: number }> {
    const queryBuilder = this.bookingRepository
      .createQueryBuilder('booking')
      .leftJoinAndSelect('booking.restaurant', 'restaurant')
      .leftJoinAndSelect('booking.guest', 'guest');

    if (restaurantId) {
      queryBuilder.andWhere('booking.restaurantId = :restaurantId', {
        restaurantId,
      });
    }

    if (status) {
      queryBuilder.andWhere('booking.status = :status', { status });
    }

    if (date) {
      queryBuilder.andWhere('booking.bookingDate = :date', { date });
    }

    const total = await queryBuilder.getCount();
    const bookings = await queryBuilder
      .skip((page - 1) * limit)
      .take(limit)
      .getMany();

    return { bookings, total };
  }

  async updateBooking(
    id: string,
    updateBookingDto: UpdateTableBookingDto,
  ): Promise<TableBooking> {
    const booking = await this.findBookingById(id);
    Object.assign(booking, updateBookingDto);
    await this.bookingRepository.save(booking);
    return this.findBookingById(id);
  }

  async deleteBooking(id: string): Promise<void> {
    const booking = await this.findBookingById(id);
    await this.bookingRepository.remove(booking);
  }

  async confirmBooking(id: string): Promise<TableBooking> {
    const booking = await this.findBookingById(id);
    booking.status = 'confirmed';
    await this.bookingRepository.save(booking);
    return this.findBookingById(id);
  }

  async cancelBooking(id: string): Promise<TableBooking> {
    const booking = await this.findBookingById(id);
    booking.status = 'cancelled';
    await this.bookingRepository.save(booking);
    return this.findBookingById(id);
  }

  async seatGuests(id: string, tableId: string): Promise<TableBooking> {
    const booking = await this.findBookingById(id);
    const table = await this.findTableById(tableId);

    // Update table status
    table.status = 'occupied';
    await this.tableRepository.save(table);

    // Update booking status
    booking.status = 'seated';
    await this.bookingRepository.save(booking);

    return this.findBookingById(id);
  }

  async completeBooking(id: string): Promise<TableBooking> {
    const booking = await this.findBookingById(id);

    // Find and free up the table
    const tables = await this.tableRepository.find({
      where: { restaurantId: booking.restaurantId, status: 'occupied' },
    });

    // This is a simplified approach - in a real system you'd track table assignments
    if (tables.length > 0) {
      const table = tables[0];
      table.status = 'available';
      await this.tableRepository.save(table);
    }

    booking.status = 'completed';
    await this.bookingRepository.save(booking);
    return this.findBookingById(id);
  }
}
