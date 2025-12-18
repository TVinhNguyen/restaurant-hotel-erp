import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { GuestsService } from './guests.service';
import { CreateGuestDto } from './dto/create-guest.dto';
import { UpdateGuestDto } from './dto/update-guest.dto';

@ApiTags('Guests')
@Controller('guests')
export class GuestsController {
  constructor(private readonly guestsService: GuestsService) {}

  @Get()
  @ApiOperation({ summary: 'Get all guests' })
  @ApiResponse({ status: 200, description: 'Return all guests.' })
  async findAll() {
    return await this.guestsService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a guest by id' })
  @ApiResponse({ status: 200, description: 'Return the guest.' })
  @ApiResponse({ status: 404, description: 'Guest not found.' })
  async findOne(@Param('id') id: string) {
    return await this.guestsService.findOne(id);
  }

  @Post()
  @ApiOperation({ summary: 'Create a new guest' })
  @ApiResponse({ status: 201, description: 'Guest created successfully.' })
  async create(@Body() createGuestDto: CreateGuestDto) {
    return await this.guestsService.create(createGuestDto);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update a guest' })
  @ApiResponse({ status: 200, description: 'Guest updated successfully.' })
  @ApiResponse({ status: 404, description: 'Guest not found.' })
  async update(
    @Param('id') id: string,
    @Body() updateGuestDto: UpdateGuestDto,
  ) {
    return await this.guestsService.update(id, updateGuestDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Delete a guest' })
  @ApiResponse({ status: 200, description: 'Guest deleted successfully.' })
  @ApiResponse({ status: 404, description: 'Guest not found.' })
  async remove(@Param('id') id: string) {
    await this.guestsService.remove(id);
    return { message: 'Guest deleted successfully' };
  }
}
