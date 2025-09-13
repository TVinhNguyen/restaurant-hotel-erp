import { Repository } from 'typeorm';
import { TaxRule } from '../entities/reservation/tax-rule.entity';
import { CreateTaxRuleDto } from './dto/create-tax-rule.dto';
import { UpdateTaxRuleDto } from './dto/update-tax-rule.dto';
export declare class TaxRulesService {
    private taxRuleRepository;
    constructor(taxRuleRepository: Repository<TaxRule>);
    findAll(query: {
        page?: number;
        limit?: number;
        propertyId?: string;
        type?: string;
    }): Promise<{
        data: TaxRule[];
        total: number;
        page: number;
        limit: number;
        totalPages: number;
        hasNext: boolean;
        hasPrev: boolean;
    }>;
    findOne(id: string): Promise<TaxRule>;
    create(createTaxRuleDto: CreateTaxRuleDto): Promise<TaxRule>;
    update(id: string, updateTaxRuleDto: UpdateTaxRuleDto): Promise<TaxRule>;
    remove(id: string): Promise<void>;
    findByProperty(propertyId: string): Promise<TaxRule[]>;
    calculateTax(amount: number, propertyId: string, taxType?: string): Promise<{
        vatAmount: number;
        serviceAmount: number;
        totalTax: number;
        breakdown: Array<{
            type: string;
            rate: number;
            amount: number;
        }>;
    }>;
}
