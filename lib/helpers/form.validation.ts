import type { SelectableItem } from '@/lib/types/selectable';
import type { Rule, RuleType, StoreValue } from 'rc-field-form/lib/interface';

export function val_required(): Rule {
	return { required: true, validateTrigger: ['blur', 'change'] };
}

export function val_req_length(
	min: number,
	max: number,
	type: RuleType = 'string',
): Rule {
	return {
		type,
		required: true,
		min,
		max,
		validateTrigger: ['blur', 'change'],
	};
}

export function val_min(min: number, type: RuleType = 'string'): Rule {
	return { type, min, validateTrigger: ['blur', 'change'] };
}

export function val_mobile_number(): Rule {
	return {
		type: 'string',
		required: true,
		len: 11,
		validateTrigger: ['blur', 'change'],
	};
}

export function val_length(
	min: number,
	max: number,
	type: RuleType = 'string',
): Rule {
	return { type, min, max, validateTrigger: ['blur', 'change'] };
}

export function val_email(required = true): Rule {
	return { type: 'email', required, validateTrigger: ['blur', 'change'] };
}

export function val_url(required = true): Rule {
	return { type: 'url', required, validateTrigger: ['blur', 'change'] };
}

export function val_date(required = true): Rule {
	return { type: 'date', required, validateTrigger: ['blur', 'change'] };
}

export function val_number(field: string, min: number, max: number): Rule {
	return {
		type: 'number',
		validateTrigger: ['blur', 'change'],
		validator: (rule: Rule, value: number) => {
			return new Promise((resolve, reject) => {
				if (value < min) {
					reject(`${field} must be greater than ${min}`);
				} else if (value > max) {
					reject(`${field} must be less than ${max}`);
				} else {
					resolve(value);
				}
			});
		},
	};
}

export function val_uuid(field: string, required = true): Rule {
	const uuidRegex =
		/^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

	return {
		type: 'string',
		validateTrigger: ['blur', 'change'],
		validator: (_rule: Rule, value?: string) => {
			return new Promise<void>((resolve, reject) => {
				if (required && !value) {
					reject(`${field} is required.`);
					return;
				}

				if (value && !uuidRegex.test(value)) {
					reject(`${field} must be a valid UUID.`);
					return;
				}

				resolve();
			});
		},
	};
}

export function val_select(
	fieldName?: string,
	multiple = false,
	required = true,
): Rule {
	return {
		required,
		type: multiple ? 'array' : 'object',
		validateTrigger: ['blur', 'change'],
		validator: async (
			rule: Rule,
			value: StoreValue | SelectableItem | SelectableItem[],
		) => {
			return new Promise((resolve, reject) => {
				if (
					(Array.isArray(value) && value.length > 0) ||
					(!Array.isArray(value) && value.value) ||
					(typeof value === 'string' && value.length > 0)
				) {
					resolve(value);
				} else {
					// @ts-ignore
					let label = fieldName ?? (rule.field as string);
					label = label.replaceAll('_', ' ');

					reject(`Please select ${label}`);
				}
			});
		},
	};
}

/**
 * Validates that a field value matches another field's value, typically used for password confirmation
 * @param fieldToMatch The name of the field that this value should match
 * @returns A validation rule that checks if values match
 */
export function val_password_match(fieldToMatch: string): Rule {
	return {
		validateTrigger: ['blur', 'change'],
		validator: (rule, value, getFieldValue) => {
			if (!value || getFieldValue(fieldToMatch) === value) {
				return Promise.resolve();
			}
			return Promise.reject('The two passwords do not match');
		},
		// @ts-ignore
		dependencies: [fieldToMatch],
	};
}
