import type { ResponseCode } from '@/lib/enums/http';

export interface XhrResponse<T> {
	code: ResponseCode;
	success: boolean;
	status: string;
	timestamp: number;
	message: string;
	data: T;
}
