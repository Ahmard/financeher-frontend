import BaseModel from '@/lib/models/base.model';

export class MannequinProfile extends BaseModel {
	name: string;
	height: number;
	chest_width: number;
	waist_width: number;
	hip_width: number;
	shoulder_width: number;
	arm_length: number;
	leg_length: number;
	neck_length: number;

	creator_full_name: string;
}
