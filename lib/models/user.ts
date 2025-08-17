import BaseModel from '@/lib/models/base.model';

export class User extends BaseModel {
	invited_by: number | null;
    industry_name: string;
    business_stage_name: string;
	first_name: string;
    role_names: string;
	last_name: string;
	mobile_number: string;
	email: string;
	nin: string | null;
	profile_picture: string | null;
	status: string;
	registration_stage: UserRegistrationStage;
	last_login_at: string | null;
}

export interface UsernameAvailabilityInterface {
	is_available: boolean;
	username: string;
	message: string;
}

export enum UserStatus {
	Active = 'active',
	Inactive = 'inactive',
	Pending = 'pending',
}

export enum UserRegistrationStage {
	EmailVerification = 'email_verification',
	PlanSubscription = 'plan_subscription',
	AccountSetup = 'account_setup',
	Completed = 'completed',
}
