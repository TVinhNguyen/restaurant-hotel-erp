import {
  Injectable,
  Logger,
  InternalServerErrorException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, MoreThan, In, LessThanOrEqual, MoreThanOrEqual } from 'typeorm';
import { GoogleGenerativeAI, GenerativeModel } from '@google/generative-ai';
import { RoomType } from '../entities/inventory/room-type.entity';
import { Promotion } from '../entities/reservation/promotion.entity';
import { Restaurant } from '../entities/restaurant/restaurant.entity';
import { Property } from '../entities/core/property.entity';
import { Room } from '../entities/inventory/room.entity';
import { Reservation } from '../entities/reservation/reservation.entity';

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
    @InjectRepository(Property)
    private readonly propertyRepository: Repository<Property>,
    @InjectRepository(Room)
    private readonly roomRepository: Repository<Room>,
    @InjectRepository(Reservation)
    private readonly reservationRepository: Repository<Reservation>,
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
   * Check room availability for a date range
   * Returns available rooms grouped by room type
   */
  async checkRoomAvailability(
    checkIn: string,
    checkOut: string,
    propertyId?: string,
  ): Promise<{
    available: boolean;
    checkIn: string;
    checkOut: string;
    availableRooms: Array<{
      roomTypeName: string;
      totalRooms: number;
      bookedRooms: number;
      availableCount: number;
      basePrice: number;
      rooms: Array<{ id: string; number: string; floor: string | number }>;
    }>;
    summary: string;
  }> {
    try {
      const checkInDate = new Date(checkIn);
      const checkOutDate = new Date(checkOut);

      // Get all room types with their rooms
      const roomTypesQuery = this.roomTypeRepository
        .createQueryBuilder('rt')
        .leftJoinAndSelect('rt.rooms', 'room', 'room.operationalStatus = :status', { status: 'available' });

      if (propertyId) {
        roomTypesQuery.where('rt.propertyId = :propertyId', { propertyId });
      }

      const roomTypes = await roomTypesQuery.getMany();

      const result: Array<{
        roomTypeName: string;
        totalRooms: number;
        bookedRooms: number;
        availableCount: number;
        basePrice: number;
        rooms: Array<{ id: string; number: string; floor: string | number }>;
      }> = [];

      for (const roomType of roomTypes) {
        const rooms = roomType.rooms || [];
        const roomIds = rooms.map((r) => r.id);

        if (roomIds.length === 0) {
          result.push({
            roomTypeName: roomType.name,
            totalRooms: 0,
            bookedRooms: 0,
            availableCount: 0,
            basePrice: Number(roomType.basePrice) || 0,
            rooms: [],
          });
          continue;
        }

        // Find conflicting reservations
        const conflictingReservations = await this.reservationRepository.find({
          where: {
            assignedRoomId: In(roomIds),
            status: In(['confirmed', 'checked_in']),
            checkIn: LessThanOrEqual(checkOutDate),
            checkOut: MoreThanOrEqual(checkInDate),
          },
          select: ['assignedRoomId'],
        });

        const bookedRoomIds = new Set(
          conflictingReservations.map((r) => r.assignedRoomId),
        );

        const availableRooms = rooms.filter((r) => !bookedRoomIds.has(r.id));

        result.push({
          roomTypeName: roomType.name,
          totalRooms: rooms.length,
          bookedRooms: bookedRoomIds.size,
          availableCount: availableRooms.length,
          basePrice: Number(roomType.basePrice) || 0,
          rooms: availableRooms.map((r) => ({
            id: r.id,
            number: r.number,
            floor: r.floor,
          })),
        });
      }

      const totalAvailable = result.reduce((sum, r) => sum + r.availableCount, 0);
      const hasAvailability = totalAvailable > 0;

      // Build summary
      const summaryParts: string[] = [];
      if (hasAvailability) {
        summaryParts.push(`Có ${totalAvailable} phòng trống từ ${checkIn} đến ${checkOut}:`);
        result
          .filter((r) => r.availableCount > 0)
          .forEach((r) => {
            summaryParts.push(
              `- ${r.roomTypeName}: ${r.availableCount}/${r.totalRooms} phòng trống (${r.basePrice.toLocaleString('vi-VN')} VNĐ/đêm)`,
            );
          });
      } else {
        summaryParts.push(`Không có phòng trống từ ${checkIn} đến ${checkOut}.`);
      }

      return {
        available: hasAvailability,
        checkIn,
        checkOut,
        availableRooms: result,
        summary: summaryParts.join('\n'),
      };
    } catch (error) {
      this.logger.error('Error checking room availability', error);
      throw new InternalServerErrorException('Unable to check room availability');
    }
  }

  /**
   * Parse date from user message (supports various formats)
   */
  private parseDateFromMessage(message: string): { checkIn?: string; checkOut?: string } {
    // Patterns for Vietnamese date formats
    const datePatterns = [
      /từ\s*(?:ngày\s*)?(\d{1,2})[\/\-](\d{1,2})(?:[\/\-](\d{2,4}))?/i,
      /từ\s*(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{2,4})/i,
      /check.?in[:\s]*(\d{1,2})[\/\-](\d{1,2})(?:[\/\-](\d{2,4}))?/i,
      /ngày\s*(\d{1,2})[\/\-](\d{1,2})(?:[\/\-](\d{2,4}))?/i,
    ];
    
    const dateToPatterns = [
      /đến\s*(?:ngày\s*)?(\d{1,2})[\/\-](\d{1,2})(?:[\/\-](\d{2,4}))?/i,
      /đến\s*(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{2,4})/i,
      /check.?out[:\s]*(\d{1,2})[\/\-](\d{1,2})(?:[\/\-](\d{2,4}))?/i,
    ];

    let checkIn: string | undefined;
    let checkOut: string | undefined;
    const currentYear = new Date().getFullYear();

    // Try to find check-in date
    for (const pattern of datePatterns) {
      const match = message.match(pattern);
      if (match) {
        const day = match[1].padStart(2, '0');
        const month = match[2].padStart(2, '0');
        const year = match[3] ? (match[3].length === 2 ? '20' + match[3] : match[3]) : currentYear.toString();
        checkIn = `${year}-${month}-${day}`;
        break;
      }
    }

    // Try to find check-out date
    for (const pattern of dateToPatterns) {
      const match = message.match(pattern);
      if (match) {
        const day = match[1].padStart(2, '0');
        const month = match[2].padStart(2, '0');
        const year = match[3] ? (match[3].length === 2 ? '20' + match[3] : match[3]) : currentYear.toString();
        checkOut = `${year}-${month}-${day}`;
        break;
      }
    }

    return { checkIn, checkOut };
  }

  /**
   * Check if user is asking about room availability
   */
  private isAskingAboutAvailability(message: string): boolean {
    const keywords = [
      'phòng trống',
      'còn phòng',
      'đặt phòng',
      'book phòng',
      'available',
      'availability',
      'check phòng',
      'kiểm tra phòng',
      'xem phòng',
      'từ ngày',
      'check-in',
      'checkin',
    ];
    const lowerMessage = message.toLowerCase();
    return keywords.some((kw) => lowerMessage.includes(kw));
  }

  /**
   * Build context from database by fetching real data
   */
  private async buildContext(): Promise<string> {
    try {
      const contextParts: string[] = [];

      // Fetch Properties
      const properties = await this.propertyRepository.find({
        select: [
          'id',
          'name',
          'address',
          'city',
          'country',
          'phone',
          'email',
          'website',
          'propertyType',
        ],
      });

      if (properties.length > 0) {
        contextParts.push('=== PROPERTIES ===');
        properties.forEach((prop) => {
          const address = prop.address ? `${prop.address}, ${prop.city}, ${prop.country}` : 'Address not provided';
          const contactInfo = [];
          if (prop.phone) contactInfo.push(`Phone: ${prop.phone}`);
          if (prop.email) contactInfo.push(`Email: ${prop.email}`);
          if (prop.website) contactInfo.push(`Website: ${prop.website}`);
          
          contextParts.push(
            `- Property: ${prop.name} (${prop.propertyType || 'Hotel'})`,
          );
          contextParts.push(`  Address: ${address}`);
          if (contactInfo.length > 0) {
            contextParts.push(`  Contact: ${contactInfo.join(' | ')}`);
          }
        });
      }

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
        contextParts.push('\n=== AVAILABLE ROOM TYPES ===');
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

      // Check if user is asking about room availability
      let availabilityContext = '';
      if (this.isAskingAboutAvailability(userMessage)) {
        const { checkIn, checkOut } = this.parseDateFromMessage(userMessage);
        
        if (checkIn && checkOut) {
          this.logger.log(`Checking availability from ${checkIn} to ${checkOut}`);
          const availability = await this.checkRoomAvailability(checkIn, checkOut);
          availabilityContext = `\n\n=== ROOM AVAILABILITY (${checkIn} to ${checkOut}) ===\n${availability.summary}`;
        } else if (checkIn) {
          // Default to 1 night if only check-in provided
          const checkOutDate = new Date(checkIn);
          checkOutDate.setDate(checkOutDate.getDate() + 1);
          const defaultCheckOut = checkOutDate.toISOString().split('T')[0];
          
          this.logger.log(`Checking availability from ${checkIn} to ${defaultCheckOut} (default 1 night)`);
          const availability = await this.checkRoomAvailability(checkIn, defaultCheckOut);
          availabilityContext = `\n\n=== ROOM AVAILABILITY (${checkIn} to ${defaultCheckOut}) ===\n${availability.summary}`;
        }
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
- When answering about room availability, use the ROOM AVAILABILITY section if provided.
- Format prices in VNĐ (Vietnamese Dong).

**CONTEXT (Real Hotel Data):**
${context}${availabilityContext}

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
