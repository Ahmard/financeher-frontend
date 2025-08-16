import BaseModel from '@/lib/models/base.model';

export class Opportunity extends BaseModel {
	name: string;
    organisation: string;
    overview: string;
    logo: string;
    application_url: string;
	currency: string;
	lower_amount: number;
	upper_amount: number;
	closing_at: string;
    industry_name: string;
	opportunity_type_name: string;
	status: string;
    is_saved?: boolean;
	is_ai_recommended?: boolean;

	creator_full_name: string;
}
