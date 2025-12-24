import {
  Controller,
  Post,
  Get,
  Body,
  Query,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiQuery,
} from '@nestjs/swagger';
import { GeminiService } from './gemini.service';
import { ChatRequestDto, ChatResponseDto } from './dto/chat.dto';

@ApiTags('Gemini AI Chatbot')
@Controller('gemini')
export class GeminiController {
  constructor(private readonly geminiService: GeminiService) {}

  @Post('chat')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Chat with AI Assistant',
    description:
      'Send a message to the AI chatbot and receive an answer based on real hotel data (rooms, promotions, restaurants)',
  })
  @ApiResponse({
    status: 200,
    description: 'Successfully received AI response',
    type: ChatResponseDto,
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - JWT token missing or invalid',
  })
  @ApiResponse({
    status: 400,
    description: 'Bad Request - Invalid input',
  })
  @ApiResponse({
    status: 500,
    description: 'Internal server error - failed to process chat',
  })
  async chat(@Body() chatRequestDto: ChatRequestDto): Promise<ChatResponseDto> {
    const response = await this.geminiService.chat(chatRequestDto.message);
    return { response };
  }

  @Get('check-availability')
  @ApiOperation({
    summary: 'Check room availability',
    description: 'Check room availability for a specific date range',
  })
  @ApiQuery({ name: 'checkIn', required: true, description: 'Check-in date (YYYY-MM-DD)', example: '2025-12-25' })
  @ApiQuery({ name: 'checkOut', required: true, description: 'Check-out date (YYYY-MM-DD)', example: '2025-12-27' })
  @ApiQuery({ name: 'propertyId', required: false, description: 'Property ID (optional)' })
  @ApiResponse({
    status: 200,
    description: 'Room availability information',
  })
  async checkAvailability(
    @Query('checkIn') checkIn: string,
    @Query('checkOut') checkOut: string,
    @Query('propertyId') propertyId?: string,
  ) {
    return await this.geminiService.checkRoomAvailability(checkIn, checkOut, propertyId);
  }
}
