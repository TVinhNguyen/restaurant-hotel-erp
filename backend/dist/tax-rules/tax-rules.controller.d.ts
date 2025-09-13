import { TaxRulesService } from './tax-rules.service';
import { CreateTaxRuleDto } from './dto/create-tax-rule.dto';
import { UpdateTaxRuleDto } from './dto/update-tax-rule.dto';
export declare class TaxRulesController {
    private readonly taxRulesService;
    constructor(taxRulesService: TaxRulesService);
    findAll(page?: string, limit?: string, propertyId?: string, type?: string): Promise<{
        data: import("../entities").TaxRule[];
        total: number;
        page: number;
        limit: number;
        totalPages: number;
        hasNext: boolean;
        hasPrev: boolean;
    }>;
    findOne(id: string): Promise<import("../entities").TaxRule>;
    create(createTaxRuleDto: CreateTaxRuleDto): Promise<import("../entities").TaxRule>;
    update(id: string, updateTaxRuleDto: UpdateTaxRuleDto): Promise<import("../entities").TaxRule>;
    remove(id: string): Promise<{
        message: string;
    }>;
    findByProperty(propertyId: string): Promise<import("../entities").TaxRule[]>;
    calculateTax(body: {
        amount: number;
        propertyId: string;
        taxType?: string;
    }): Promise<{
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
