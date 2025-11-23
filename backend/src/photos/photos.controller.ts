import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { PhotosService } from './photos.service';
import { CreatePhotoDto, UpdatePhotoDto, PhotoQueryDto } from './dto/photo.dto';

@ApiTags('Photos')
@Controller('photos')
export class PhotosController {
  constructor(private readonly photosService: PhotosService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new photo' })
  @ApiResponse({
    status: 201,
    description: 'The photo has been successfully created.',
  })
  create(@Body() createPhotoDto: CreatePhotoDto) {
    return this.photosService.create(createPhotoDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all photos' })
  @ApiResponse({ status: 200, description: 'Return all photos.' })
  findAll(@Query() query: PhotoQueryDto) {
    return this.photosService.findAll(query);
  }

  @Get('room-type/:roomTypeId')
  @ApiOperation({ summary: 'Get all photos for a specific room type' })
  @ApiResponse({
    status: 200,
    description: 'Return all photos for the room type.',
  })
  findByRoomType(@Param('roomTypeId') roomTypeId: string) {
    return this.photosService.findByRoomType(roomTypeId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a photo by id' })
  @ApiResponse({ status: 200, description: 'Return the photo.' })
  @ApiResponse({ status: 404, description: 'Photo not found.' })
  findOne(@Param('id') id: string) {
    return this.photosService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a photo' })
  @ApiResponse({
    status: 200,
    description: 'The photo has been successfully updated.',
  })
  @ApiResponse({ status: 404, description: 'Photo not found.' })
  update(@Param('id') id: string, @Body() updatePhotoDto: UpdatePhotoDto) {
    return this.photosService.update(id, updatePhotoDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a photo' })
  @ApiResponse({
    status: 200,
    description: 'The photo has been successfully deleted.',
  })
  @ApiResponse({ status: 404, description: 'Photo not found.' })
  remove(@Param('id') id: string) {
    return this.photosService.remove(id);
  }

  @Delete('room-type/:roomTypeId')
  @ApiOperation({ summary: 'Delete all photos for a specific room type' })
  @ApiResponse({
    status: 200,
    description: 'All photos for the room type have been deleted.',
  })
  removeByRoomType(@Param('roomTypeId') roomTypeId: string) {
    return this.photosService.removeByRoomType(roomTypeId);
  }
}
