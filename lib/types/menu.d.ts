import type { ItemType } from 'antd/lib/menu/interface';

export interface IConditionalMenuItem {
	visible: boolean;
	item: ItemType;
}

export type IConditionalMenuItems = IConditionalMenuItem[];
