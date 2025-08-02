import type { LooseObject } from '@/lib/types/loose.object';

export default class BaseModel implements LooseObject {
	// biome-ignore lint/suspicious/noExplicitAny: <explanation>
	[key: string]: any;

	id: string;
	created_at: string;
	updated_at: string;

	static fromData<T extends BaseModel>(this: new () => T, data: Partial<T>): T {
		// biome-ignore lint/complexity/noThisInStatic: <explanation>
		return Object.assign(new this(), data);
	}

	static default<T extends BaseModel>(this: new () => T): T {
		// biome-ignore lint/complexity/noThisInStatic: <explanation>
		return new this();
	}
}
