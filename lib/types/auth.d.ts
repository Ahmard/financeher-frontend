import type {UserRegistrationStage} from "@/lib/models/user";

export interface ILoginResponse {
	access_token: string;
	expires_in: number;
	expires_at: number;
	token_type: string;
	device_id: string;
	user: LoggedUserInfoInterface;
	biometric: BiometricLoginInterface | null;
}

export interface LoggedUserInfoInterface {
	id: string;
	username: string;
	first_name: string;
	last_name: string;
	email: string;
	profile_picture?: string;
}

export interface BiometricLoginInterface {
	token: string;
	kind: string;
	usage_policy: string;
}

export interface AuthUserData extends AuthMe {
	access_token: string;
	access_token_expires_at: number;
	device_id: string;
	biometric: BiometricLoginInterface | null;
}

export interface AuthMe {
	id: string;
	application_id: string;
	first_name: string;
	last_name: string;
	full_name: string;
	username: string;
	email: string | null;
	mobile_number: string;
	price_type: string;
	profile_picture: string;
	cover_picture: undefined;
	status: string;
	registration_stage: UserRegistrationStage;
	unit_names: string[];
	role_names: string[];
	auth_data: AuthMeData;
}

interface AuthMeData {
	role_names: string[];
	permission_names: string[];
}
