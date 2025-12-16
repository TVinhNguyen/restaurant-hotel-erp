import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class ChatRequestDto {
  @ApiProperty({
    description: 'User message to send to the AI chatbot',
    example: 'What types of rooms are available?',
  })
  @IsNotEmpty()
  @IsString()
  message: string;
}

export class ChatResponseDto {
  @ApiProperty({
    description: 'AI-generated response based on hotel data',
    example:
      'We have the following room types available: Deluxe Room ($150/night), Suite ($300/night)...',
  })
  response: string;
}
