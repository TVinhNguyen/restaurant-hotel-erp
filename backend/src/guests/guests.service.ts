import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Guest } from '../entities/core/guest.entity';
import { CreateGuestDto } from './dto/create-guest.dto';
import { UpdateGuestDto } from './dto/update-guest.dto';

@Injectable()
export class GuestsService {
  constructor(
    @InjectRepository(Guest)
    private guestRepository: Repository<Guest>,
  ) {}

  // --- Đã sửa đổi hàm findAll ---
  async findAll(): Promise<Guest[]> {
    return await this.guestRepository.find({
      order: {
        name: 'ASC', // Giữ lại sắp xếp theo tên cho dễ nhìn
      },
    });
  }
  // -----------------------------

  async findOne(id: string): Promise<Guest> {
    const guest = await this.guestRepository.findOne({
      where: { id },
      // relations: ['reservations', 'tableBookings'] // Bỏ comment nếu muốn lấy dữ liệu liên quan
    });

    if (!guest) {
      throw new NotFoundException(`Guest with ID ${id} not found`);
    }

    return guest;
  }

  async create(createGuestDto: CreateGuestDto): Promise<Guest> {
    const guest = this.guestRepository.create(createGuestDto);
    return await this.guestRepository.save(guest);
  }

  async update(id: string, updateGuestDto: UpdateGuestDto): Promise<Guest> {
    const guest = await this.findOne(id);

    Object.assign(guest, updateGuestDto);

    return await this.guestRepository.save(guest);
  }

  async remove(id: string): Promise<void> {
    const guest = await this.findOne(id);
    await this.guestRepository.remove(guest);
  }
}
