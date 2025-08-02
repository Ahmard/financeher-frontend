import type { LooseObject } from '~/types/loose.object';
import type * as React from 'react';

export interface SelectableItem<T = LooseObject> extends LooseObject {
	label: string;
	value: string | number;
	option?: T;
}

export type RawValueType = string | number;
export interface LabelInValueType {
	label: React.ReactNode;
	value: RawValueType;
	/** @deprecated `key` is useless since it should always same as `value` */
	key?: React.Key;
}
