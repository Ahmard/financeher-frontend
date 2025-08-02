import type { LooseObject } from '@/lib/types/loose.object';
import type { SelectableItem } from '@/lib/types/selectable';
import _ from 'lodash';

interface INumberFormatterOpt {
	userTyping: boolean;
	input: string;
}

export function numberFormatter(
	value: number | undefined,
	opt: INumberFormatterOpt,
) {
	return `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

export function currencyFormatter(value: number) {
	return `₦ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

export function numberParser(value: string | undefined): number {
	return Number(value?.replace(/₦\s?|(,*)/g, ''));
}

export function date_format() {
	return 'YYYY-MM-DD';
}

export function datetime_format() {
	return 'YYYY-MM-DDTHH:mm:ss';
}

export function apiPayload<D>(data: D): D {
	const payload: LooseObject = {};
	for (const key in data) {
		const field_value = data[key];

		if (Array.isArray(field_value)) {
			payload[key] = field_value.map((v: SelectableItem) => v.value);
			continue;
		}

		if (_.isPlainObject(field_value)) {
			// @ts-ignore
			payload[key] = field_value.value;
			continue;
		}

		payload[key] = data[key];
	}

	// @ts-ignore
	return payload;
}

function currency() {
	return '₵';
}
