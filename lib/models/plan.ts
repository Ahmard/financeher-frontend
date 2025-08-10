import BaseModel from '@/lib/models/base.model';

export class Plan extends BaseModel {
	name: string;
	price: number;
	billing_cycle: string;
	features: string[];

	creator_full_name: string;
}
