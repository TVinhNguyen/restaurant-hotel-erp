import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RestaurantsController } from './restaurants.controller';
import { RestaurantsService } from './restaurants.service';
import { Restaurant } from '../entities/restaurant/restaurant.entity';
import { RestaurantArea } from '../entities/restaurant/restaurant-area.entity';
import { RestaurantTable } from '../entities/restaurant/restaurant-table.entity';
import { TableBooking } from '../entities/restaurant/table-booking.entity';
import { Property } from '../entities/core/property.entity';
import { Guest } from '../entities/core/guest.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Restaurant,
      RestaurantArea,
      RestaurantTable,
      TableBooking,
      Property,
      Guest,
    ]),
  ],
  controllers: [RestaurantsController],
  providers: [RestaurantsService],
  exports: [RestaurantsService],
})
export class RestaurantsModule {}