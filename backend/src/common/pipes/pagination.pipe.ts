import { PipeTransform, Injectable, BadRequestException } from '@nestjs/common';

export interface PaginationDto {
  limit: number;
  page: number;
  skip: number;
}

/**
 * Pagination Validation Pipe
 *
 * Validates and transforms pagination query parameters with:
 * - Max limit of 100 items per page (prevents memory exhaustion)
 * - Min limit of 1
 * - Min page of 1
 * - Auto-calculates skip offset
 *
 * Usage:
 * @Get()
 * async findAll(@Query(PaginationPipe) pagination: PaginationDto) { ... }
 */
@Injectable()
export class PaginationPipe implements PipeTransform<any, PaginationDto> {
  private readonly MAX_LIMIT = 100;
  private readonly DEFAULT_LIMIT = 10;
  private readonly DEFAULT_PAGE = 1;

  transform(value: { limit?: string; page?: string }) {
    // Limit validation
    const limit =
      parseInt(value?.limit || String(this.DEFAULT_LIMIT)) ||
      this.DEFAULT_LIMIT;

    if (isNaN(limit) || limit < 1) {
      throw new BadRequestException('Limit must be a positive number');
    }

    if (limit > this.MAX_LIMIT) {
      throw new BadRequestException(`Limit cannot exceed ${this.MAX_LIMIT}`);
    }

    // Page validation
    const page =
      parseInt(value?.page || String(this.DEFAULT_PAGE)) || this.DEFAULT_PAGE;

    if (isNaN(page) || page < 1) {
      throw new BadRequestException('Page must be a positive number');
    }

    // Calculate skip offset
    const skip = (page - 1) * limit;

    return {
      limit,
      page,
      skip,
    };
  }
}
