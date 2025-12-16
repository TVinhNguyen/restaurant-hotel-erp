import {
  Controller,
  Post,
  Body,
  HttpCode,
  HttpStatus,
  UseGuards,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { GeminiService } from './gemini.service';
import { ChatRequestDto, ChatResponseDto } from './dto/chat.dto';

@ApiTags('Gemini AI Chatbot')
@Controller('gemini')
@UseGuards(AuthGuard('jwt'))
@ApiBearerAuth()
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
}
