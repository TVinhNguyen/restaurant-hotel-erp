import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RoomType } from '../entities/inventory/room-type.entity';
import { RoomTypeAmenity } from '../entities/inventory/room-type-amenity.entity';
import { Amenity } from '../entities/inventory/amenity.entity';
import { CreateRoomTypeDto, RoomTypeQueryDto } from './dto/create-room-type.dto';
import { UpdateRoomTypeDto } from './dto/update-room-type.dto';

@Injectable()
export class RoomTypesService {
  constructor(
    @InjectRepository(RoomType)
    private roomTypeRepository: Repository<RoomType>,
    @InjectRepository(RoomTypeAmenity)
    private roomTypeAmenityRepository: Repository<RoomTypeAmenity>,
    @InjectRepository(Amenity)
    private amenityRepository: Repository<Amenity>,
  ) {}

  async findAll(query: RoomTypeQueryDto) {
    const { page = 1, limit = 10, propertyId, search } = query;
    const skip = (page - 1) * limit;

    const queryBuilder = this.roomTypeRepository.createQueryBuilder('roomType')
      .leftJoinAndSelect('roomType.property', 'property')
      .leftJoinAndSelect('roomType.roomTypeAmenities', 'roomTypeAmenities')
      .leftJoinAndSelect('roomTypeAmenities.amenity', 'amenity')
      .leftJoinAndSelect('roomType.photos', 'photos')
      .leftJoinAndSelect('roomType.rooms', 'rooms');

    if (propertyId) {
      queryBuilder.where('roomType.propertyId = :propertyId', { propertyId });
    }

    if (search) {
      queryBuilder.andWhere('(roomType.name ILIKE :search OR roomType.description ILIKE :search)', 
        { search: `%${search}%` });
    }

    const [roomTypes, total] = await queryBuilder
      .skip(skip)
      .take(limit)
      .getManyAndCount();

    // Transform data for frontend
    const data = roomTypes.map((roomType: any) => {
      const amenities = roomType.roomTypeAmenities?.map((rta: any) => ({
        id: rta.amenity.id,
        name: rta.amenity.name,
        description: rta.amenity.description,
        category: rta.amenity.category,
      })) || [];

      const totalRooms = roomType.rooms?.length || 0;
      const availableRooms = roomType.rooms?.filter((room: any) => 
        room.operationalStatus === 'available'
      ).length || 0;

      return {
        id: roomType.id,
        property_id: roomType.propertyId,
        name: roomType.name,
        description: roomType.description,
        max_adults: roomType.maxAdults,
        max_children: roomType.maxChildren,
        base_price: roomType.basePrice,
        bed_type: roomType.bedType,
        amenities,
        photos: roomType.photos || [],
        total_rooms: totalRooms,
        available_rooms: availableRooms,
        created_at: roomType.createdAt,
        updated_at: roomType.updatedAt,
      };
    });

    return {
      data,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
      hasNext: page * limit < total,
      hasPrev: page > 1,
    };
  }

  async findOne(id: string): Promise<any> {
    const roomType = await this.roomTypeRepository.findOne({
      where: { id },
      relations: ['property', 'rooms', 'roomTypeAmenities', 'roomTypeAmenities.amenity', 'photos'],
    });

    if (!roomType) {
      throw new NotFoundException(`Room type with ID ${id} not found`);
    }

    // Transform amenities for easier frontend consumption
    const amenities = roomType.roomTypeAmenities?.map((rta: any) => ({
      id: rta.amenity.id,
      name: rta.amenity.name,
      description: rta.amenity.description,
      category: rta.amenity.category,
    })) || [];

    // Calculate total and available rooms
    const totalRooms = roomType.rooms?.length || 0;
    const availableRooms = roomType.rooms?.filter((room: any) => 
      room.operationalStatus === 'available'
    ).length || 0;

    return {
      id: roomType.id,
      property_id: roomType.propertyId,
      name: roomType.name,
      description: roomType.description,
      max_adults: roomType.maxAdults,
      max_children: roomType.maxChildren,
      base_price: roomType.basePrice,
      bed_type: roomType.bedType,
      amenities,
      photos: roomType.photos || [],
      rooms: roomType.rooms?.map((room: any) => ({
        id: room.id,
        number: room.number,
        floor: room.floor,
        operational_status: room.operationalStatus,
        housekeeping_status: room.housekeepingStatus,
      })) || [],
      total_rooms: totalRooms,
      available_rooms: availableRooms,
      
    };
  }

  async create(createRoomTypeDto: CreateRoomTypeDto): Promise<RoomType> {
    const { amenityIds, ...roomTypeData } = createRoomTypeDto;
    
    const roomType = this.roomTypeRepository.create(roomTypeData);
    const savedRoomType = await this.roomTypeRepository.save(roomType);

    // Add amenities if provided
    if (amenityIds && amenityIds.length > 0) {
      await this.addMultipleAmenities(savedRoomType.id, amenityIds);
    }

    return await this.findOne(savedRoomType.id);
  }

  async update(id: string, updateRoomTypeDto: UpdateRoomTypeDto): Promise<RoomType> {
    const roomType = await this.findOne(id);
    
    Object.assign(roomType, updateRoomTypeDto);
    
    return await this.roomTypeRepository.save(roomType);
  }

  async remove(id: string): Promise<void> {
    const roomType = await this.findOne(id);
    await this.roomTypeRepository.remove(roomType);
  }

  // Amenity management methods
  async addAmenity(roomTypeId: string, amenityId: string) {
    // Validate room type and amenity exist
    const roomType = await this.findOne(roomTypeId);
    const amenity = await this.amenityRepository.findOne({ where: { id: amenityId } });
    
    if (!amenity) {
      throw new NotFoundException(`Amenity with ID ${amenityId} not found`);
    }

    // Check if association already exists
    const existingAssociation = await this.roomTypeAmenityRepository.findOne({
      where: { roomTypeId, amenityId },
    });

    if (existingAssociation) {
      throw new ConflictException('Amenity is already associated with this room type');
    }

    const roomTypeAmenity = this.roomTypeAmenityRepository.create({
      roomTypeId,
      amenityId,
    });

    await this.roomTypeAmenityRepository.save(roomTypeAmenity);

    return {
      roomTypeId,
      amenityId,
      amenity: {
        id: amenity.id,
        name: amenity.name,
        category: amenity.category,
      },
    };
  }

  async removeAmenity(roomTypeId: string, amenityId: string) {
    await this.findOne(roomTypeId); // Validate room type exists

    const association = await this.roomTypeAmenityRepository.findOne({
      where: { roomTypeId, amenityId },
    });

    if (!association) {
      throw new NotFoundException('Amenity association not found');
    }

    await this.roomTypeAmenityRepository.remove(association);
  }

  async addMultipleAmenities(roomTypeId: string, amenityIds: string[]) {
    await this.findOne(roomTypeId); // Validate room type exists

    // Validate all amenities exist
    const amenities = await this.amenityRepository.findByIds(amenityIds);
    if (amenities.length !== amenityIds.length) {
      throw new NotFoundException('One or more amenities not found');
    }

    // Get existing associations
    const existingAssociations = await this.roomTypeAmenityRepository.find({
      where: { roomTypeId },
    });
    const existingAmenityIds = existingAssociations.map((assoc: any) => assoc.amenityId);

    // Filter out already associated amenities
    const newAmenityIds = amenityIds.filter(id => !existingAmenityIds.includes(id));

    if (newAmenityIds.length === 0) {
      return {
        roomTypeId,
        addedAmenities: [],
        createdCount: 0,
        message: 'All amenities are already associated with this room type',
      };
    }

    // Create new associations
    const newAssociations = newAmenityIds.map(amenityId => 
      this.roomTypeAmenityRepository.create({ roomTypeId, amenityId })
    );

    await this.roomTypeAmenityRepository.save(newAssociations);

    const addedAmenities = amenities
      .filter((amenity: any) => newAmenityIds.includes(amenity.id))
      .map((amenity: any) => ({
        amenityId: amenity.id,
        name: amenity.name,
      }));

    return {
      roomTypeId,
      addedAmenities,
      createdCount: newAmenityIds.length,
    };
  }

  async getAmenities(roomTypeId: string) {
    await this.findOne(roomTypeId); // Validate room type exists

    const associations = await this.roomTypeAmenityRepository.find({
      where: { roomTypeId },
      relations: ['amenity'],
    });

    return {
      data: associations.map((assoc: any) => ({
        id: assoc.id,
        roomTypeId: assoc.roomTypeId,
        amenityId: assoc.amenityId,
        amenity: {
          id: assoc.amenity.id,
          name: assoc.amenity.name,
          description: assoc.amenity.description,
          category: assoc.amenity.category,
        },
        createdAt: assoc.createdAt,
      })),
      total: associations.length,
    };
  }
}