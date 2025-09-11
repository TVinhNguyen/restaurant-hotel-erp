import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RestaurantsController } from './restaurants.controller';
import { RestaurantsService } from './restaurants.service';
import { Restaurant } from '../entities/restaurant/restaurant.entity';
import { RestaurantTable } from '../entities/restaurant/restaurant-table.entity';
import { TableBooking } from '../entities/restaurant/table-booking.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Restaurant,
      RestaurantTable,
      TableBooking,
    ]),
  ],
  controllers: [RestaurantsController],
  providers: [RestaurantsService],
  exports: [RestaurantsService],
})
export class RestaurantsModule {}