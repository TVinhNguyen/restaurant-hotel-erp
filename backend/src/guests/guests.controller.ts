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
import { GuestsService } from './guests.service';
import { CreateGuestDto } from './dto/create-guest.dto';
import { UpdateGuestDto } from './dto/update-guest.dto';

@Controller('guests')
@UseGuards(AuthGuard('jwt'))
export class GuestsController {
  constructor(private readonly guestsService: GuestsService) {}

  @Get()
  async findAll(
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('search') search?: string,
  ) {
    const pageNum = page ? parseInt(page, 10) : 1;
    const limitNum = limit ? parseInt(limit, 10) : 10;

    return await this.guestsService.findAll({
      page: pageNum,
      limit: limitNum,
      search,
    });
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.guestsService.findOne(id);
  }

  @Post()
  async create(@Body() createGuestDto: CreateGuestDto) {
    return await this.guestsService.create(createGuestDto);
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updateGuestDto: UpdateGuestDto,
  ) {
    return await this.guestsService.update(id, updateGuestDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  async remove(@Param('id') id: string) {
    await this.guestsService.remove(id);
    return { message: 'Guest deleted successfully' };
  }
}
