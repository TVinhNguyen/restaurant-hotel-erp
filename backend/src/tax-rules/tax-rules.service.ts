import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TaxRule } from '../entities/reservation/tax-rule.entity';
import { CreateTaxRuleDto } from './dto/create-tax-rule.dto';
import { UpdateTaxRuleDto } from './dto/update-tax-rule.dto';

@Injectable()
export class TaxRulesService {
  constructor(
    @InjectRepository(TaxRule)
    private taxRuleRepository: Repository<TaxRule>,
  ) {}

  async findAll(query: {
    page?: number;
    limit?: number;
    propertyId?: string;
    type?: string;
  }) {
    const { page = 1, limit = 10, propertyId, type } = query;
    const skip = (page - 1) * limit;

    const queryBuilder = this.taxRuleRepository.createQueryBuilder('taxRule')
      .leftJoinAndSelect('taxRule.property', 'property');

    if (propertyId) {
      queryBuilder.andWhere('taxRule.propertyId = :propertyId', { propertyId });
    }

    if (type) {
      queryBuilder.andWhere('taxRule.taxName = :type', { type });
    }

    const [data, total] = await queryBuilder
      .orderBy('taxRule.taxName', 'ASC')
      .addOrderBy('taxRule.taxRate', 'ASC')
      .skip(skip)
      .take(limit)
      .getManyAndCount();

    return {
      data,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
      hasNext: page * limit < total,
      hasPrev: page > 1,
    };
  }

  async findOne(id: string): Promise<TaxRule> {
    const taxRule = await this.taxRuleRepository.findOne({
      where: { id },
      relations: ['property'],
    });

    if (!taxRule) {
      throw new NotFoundException(`Tax rule with ID ${id} not found`);
    }

    return taxRule;
  }

  async create(createTaxRuleDto: CreateTaxRuleDto): Promise<TaxRule> {
    const taxRule = this.taxRuleRepository.create(createTaxRuleDto);
    return await this.taxRuleRepository.save(taxRule);
  }

  async update(id: string, updateTaxRuleDto: UpdateTaxRuleDto): Promise<TaxRule> {
    const taxRule = await this.findOne(id);
    Object.assign(taxRule, updateTaxRuleDto);
    return await this.taxRuleRepository.save(taxRule);
  }

  async remove(id: string): Promise<void> {
    const taxRule = await this.findOne(id);
    await this.taxRuleRepository.remove(taxRule);
  }

  async findByProperty(propertyId: string): Promise<TaxRule[]> {
    return await this.taxRuleRepository.find({
      where: { propertyId },
      order: { taxName: 'ASC', taxRate: 'ASC' },
    });
  }

  async calculateTax(amount: number, propertyId: string, taxType?: string): Promise<{
    vatAmount: number;
    serviceAmount: number;
    totalTax: number;
    breakdown: Array<{ type: string; rate: number; amount: number }>;
  }> {
    const taxRules = await this.findByProperty(propertyId);
    
    let vatAmount = 0;
    let serviceAmount = 0;
    const breakdown = [];

    for (const taxRule of taxRules) {
      if (taxType && taxRule.taxName !== taxType) continue;

      const taxAmount = (amount * taxRule.taxRate) / 100;
      
      if (taxRule.taxName === 'VAT') {
        vatAmount += taxAmount;
      } else if (taxRule.taxName === 'service') {
        serviceAmount += taxAmount;
      }

      breakdown.push({
        type: taxRule.taxName,
        rate: taxRule.taxRate,
        amount: taxAmount,
      });
    }

    return {
      vatAmount,
      serviceAmount,
      totalTax: vatAmount + serviceAmount,
      breakdown,
    };
  }
}
