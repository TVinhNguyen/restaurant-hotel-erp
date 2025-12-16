import {
  Injectable,
  Logger,
  InternalServerErrorException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, MoreThan } from 'typeorm';
import { GoogleGenerativeAI, GenerativeModel } from '@google/generative-ai';
import { RoomType } from '../entities/inventory/room-type.entity';
import { Promotion } from '../entities/reservation/promotion.entity';
import { Restaurant } from '../entities/restaurant/restaurant.entity';

@Injectable()
export class GeminiService {
  private readonly logger = new Logger(GeminiService.name);
  private genAI: GoogleGenerativeAI;
  private model: GenerativeModel | null = null;

  constructor(
    @InjectRepository(RoomType)
    private readonly roomTypeRepository: Repository<RoomType>,
    @InjectRepository(Promotion)
    private readonly promotionRepository: Repository<Promotion>,
    @InjectRepository(Restaurant)
    private readonly restaurantRepository: Repository<Restaurant>,
    private readonly configService: ConfigService,
  ) {
    const apiKey = this.configService.get<string>('GEMINI_API_KEY');
    if (!apiKey) {
      this.logger.warn('GEMINI_API_KEY not found in environment variables');
    } else {
      this.genAI = new GoogleGenerativeAI(apiKey);
      this.model = this.genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });
    }
  }

  /**
   * Build context from database by fetching real data
   */
  private async buildContext(): Promise<string> {
    try {
      const contextParts: string[] = [];

      // Fetch Room Types
      const roomTypes = await this.roomTypeRepository.find({
        select: [
          'id',
          'name',
          'description',
          'basePrice',
          'maxAdults',
          'maxChildren',
          'bedType',
        ],
      });

      if (roomTypes.length > 0) {
        contextParts.push('=== AVAILABLE ROOM TYPES ===');
        roomTypes.forEach((room) => {
          contextParts.push(
            `- ${room.name}: ${room.description || 'No description'} | Price: $${room.basePrice || 'N/A'}/night | Max Adults: ${room.maxAdults || 'N/A'} | Max Children: ${room.maxChildren || 'N/A'} | Bed: ${room.bedType || 'N/A'}`,
          );
        });
      }

      // Fetch Active Promotions (valid_to > now)
      const today = new Date();
      const promotions = await this.promotionRepository.find({
        where: {
          active: true,
          validTo: MoreThan(today),
        },
        select: [
          'code',
          'discountPercent',
          'validFrom',
          'validTo',
          'description',
        ],
      });

      if (promotions.length > 0) {
        contextParts.push('\n=== ACTIVE PROMOTIONS ===');
        promotions.forEach((promo) => {
          const validFromStr = promo.validFrom
            ? new Date(promo.validFrom).toISOString().split('T')[0]
            : 'N/A';
          const validToStr = promo.validTo
            ? new Date(promo.validTo).toISOString().split('T')[0]
            : 'N/A';
          contextParts.push(
            `- Code: ${promo.code} | Discount: ${promo.discountPercent}% | Valid: ${validFromStr} to ${validToStr} | ${promo.description || 'No description'}`,
          );
        });
      }

      // Fetch Restaurants
      const restaurants = await this.restaurantRepository.find({
        select: [
          'name',
          'description',
          'location',
          'openingHours',
          'cuisineType',
        ],
      });

      if (restaurants.length > 0) {
        contextParts.push('\n=== RESTAURANTS ===');
        restaurants.forEach((rest) => {
          contextParts.push(
            `- ${rest.name}: ${rest.description || 'No description'} | Location: ${rest.location || 'N/A'} | Hours: ${rest.openingHours || 'N/A'} | Cuisine: ${rest.cuisineType || 'N/A'}`,
          );
        });
      }

      // If no data available
      if (contextParts.length === 0) {
        return 'No data available at the moment. Please contact support for more information.';
      }

      return contextParts.join('\n');
    } catch (error) {
      this.logger.error('Error building context from database', error);
      throw new InternalServerErrorException(
        'Unable to retrieve hotel information. Please try again later.',
      );
    }
  }

  /**
   * Handle chat with user using Gemini AI
   */
  async chat(userMessage: string): Promise<string> {
    try {
      if (!this.model) {
        this.logger.error(
          'Gemini API is not configured - GEMINI_API_KEY missing',
        );
        throw new InternalServerErrorException(
          'Gemini AI service is currently unavailable. Please contact support.',
        );
      }

      // Build context from real database data
      const context = await this.buildContext();

      // Construct the prompt
      const prompt = `
You are a helpful and professional Hotel Receptionist AI assistant.

**IMPORTANT CONSTRAINTS:**
- Answer STRICTLY based on the provided Context below.
- If the information is not in the Context, politely tell the user to contact support or visit the front desk.
- Be friendly, concise, and helpful.
- Do not make up information.

**CONTEXT (Real Hotel Data):**
${context}

**USER QUESTION:**
${userMessage}

**YOUR RESPONSE:**
`;

      // Call Gemini API
      this.logger.log('Sending request to Gemini API...');
      const result = await this.model.generateContent(prompt);
      const response = result.response;
      const text = response.text();

      this.logger.log('Received response from Gemini API');
      return text;
    } catch (error) {
      this.logger.error('Error calling Gemini API', error);

      // Re-throw known exceptions
      if (error instanceof InternalServerErrorException) {
        throw error;
      }

      // Handle Gemini API specific errors
      if (error?.message?.includes('API_KEY_INVALID')) {
        throw new InternalServerErrorException(
          'AI service configuration error. Please contact support.',
        );
      }

      if (error?.message?.includes('quota')) {
        throw new InternalServerErrorException(
          'AI service is temporarily unavailable due to high demand. Please try again later.',
        );
      }

      // Generic error
      throw new InternalServerErrorException(
        'Unable to process your request. Please try again later.',
      );
    }
  }
}
