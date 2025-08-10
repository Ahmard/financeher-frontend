import BaseModel from '@/lib/models/base.model';

export class LoanVc extends BaseModel {
	organisation: string;
	currency: string;
	lower_amount: number;
	upper_amount: number;
	description: string;
	closing_at: string;
	opportunity_type_name: string;
	status: string;

	creator_full_name: string;
}
