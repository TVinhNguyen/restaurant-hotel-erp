import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { GeminiController } from './gemini.controller';
import { GeminiService } from './gemini.service';
import { RoomType } from '../entities/inventory/room-type.entity';
import { Promotion } from '../entities/reservation/promotion.entity';
import { Restaurant } from '../entities/restaurant/restaurant.entity';
import { Property } from '../entities/core/property.entity';

@Module({
  imports: [
    ConfigModule,
    TypeOrmModule.forFeature([RoomType, Promotion, Restaurant, Property]),
  ],
  controllers: [GeminiController],
  providers: [GeminiService],
  exports: [GeminiService],
})
export class GeminiModule {}
