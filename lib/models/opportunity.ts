import BaseModel from '@/lib/models/base.model';

export class Opportunity extends BaseModel {
	name: string;
	currency: string;
	lower_amount: number;
	upper_amount: number;
	closing_at: string;
	opportunity_type_name: string;
	status: string;

	creator_full_name: string;
}
