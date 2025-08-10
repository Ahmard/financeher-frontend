import type { LooseObject } from '@/lib/types/loose.object';
import type { XhrResponse } from '@/lib/types/xhr';
import type { TablePaginationConfig } from 'ant-design-vue';
import type { ColumnType } from 'antd/lib/table/interface';
import type React from 'react';
import type { DataIndex } from 'rc-table/lib/interface';

export interface DataTableColumnProps<T> extends ColumnType<T> {
	title: string;
	sortable?: boolean;
	dataIndex?: DataIndex<T> | keyof T;
	canDisplay?: () => boolean;
}

export interface DatatablePagination extends TablePaginationConfig {
	total: number;
	pageSize: number;
	current: number;
	size?: 'default' | 'small';
	showQuickJumper?: boolean;
	showSizeChanger?: boolean;
	pageSizeOptions?: string[];
}

export interface DatatableResponse<T> extends XhrResponse<T> {
	data: DataTableData<T>;
}

export interface DataTableData<T> {
	data: Array<T>;
	total_pages: number;
	recordsTotal: number;
}

export interface DataTableSorter {
	column?: LooseObject;
	columnKey?: string;
	field?: string;
	order?: string;
}

export interface DataTableFilter {
	action: string;
	currentDataSource: LooseObject[];
}

export interface DataTableQueryParam extends LooseObject {
	draw: number;
	start: number;
	length: number;
}

export interface DataTableScroll {
	x?: string | number | true;
	y?: string | number;
	scrollToFirstRowOnChange?: boolean;
}

export interface DataTableTriggeredEvent<D> {
	data: D;
	event: React.MouseEvent;
}

export interface DatatableEventHandler<T> {
	onClick?: (event: DataTableTriggeredEvent<T>) => void;
	onDoubleClick?: (event: DataTableTriggeredEvent<T>) => void;
	onContextMenu?: (event: DataTableTriggeredEvent<T>) => void;
	onMouseenter?: (event: DataTableTriggeredEvent<T>) => void;
	onMouseLeave?: (event: DataTableTriggeredEvent<T>) => void;
}

export interface DataTableEventHandlerInternal {
	onClick?: (event: React.MouseEvent) => void;
	onDoubleClick?: (event: React.MouseEvent) => void;
	onContextMenu?: (event: React.MouseEvent) => void;
	onMouseEnter?: (event: React.MouseEvent) => void;
	onMouseLeave?: (event: React.MouseEvent) => void;
}
