import BaseModel from '@/lib/models/base.model';

export class LogTrail extends BaseModel {
	user_id: string;
	entity_id: string;
	sub_entity_id: string | null;
	entity_type: string;
	sub_entity_type: string | null;
	action: LogTrailAction;
	sub_action: string | null;
	description: string;
	reason: string | null;
	old_data: string | null;
}

export enum LogTrailAction {
	Create = 'CREATE',
	Read = 'READ',
	Update = 'UPDATE',
	Delete = 'DELETE',
}
