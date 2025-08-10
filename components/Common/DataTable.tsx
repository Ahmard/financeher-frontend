/** biome-ignore-all lint/correctness/useExhaustiveDependencies: true */

import {App, Checkbox, type CheckboxChangeEvent, Skeleton} from "antd";
import {cloneDeep, debounce} from 'lodash';
import {
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  ChevronUp,
  RefreshCw,
  Search
} from 'lucide-react';
import {usePathname} from "next/navigation";
import type React from 'react';
import type { ReactNode } from 'react';
import {useCallback, useEffect, useRef, useState} from 'react';
import {Badge} from '@/components/ui/badge';
import {Button} from '@/components/ui/button';
import {Card, CardContent} from '@/components/ui/card';
import type {
  DataTableColumnProps,
  DataTableData,
  DatatableEventHandler,
  DatatablePagination,
  DataTableQueryParam,
  DataTableScroll
} from "@/lib/types/data.table";
import type {LooseObject} from '@/lib/types/loose.object';
import type {XhrResponse} from "@/lib/types/xhr";
import {xhrGet} from '@/lib/xhr';
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from '../ui/table';
import {cmk} from "@/lib/helpers/str";

interface SegmentedOption {
  value: number;
  title: string;
  payload?: {
    color: string;
    count: number;
  };
}

interface IProps<T> {
  rowKey: string;
  endpoint?: string;
  query?: Record<string, string | number>;
  columns: DataTableColumnProps<T>[];
  items?: T[];
  search?: string;
  searchPlaceholder?: string;
  topSegmentTitle?: string;
  withTopSegment?: boolean;
  withSelection?: boolean;
  preserveSelectedRowKeys?: boolean;
  withPagination?: boolean;
  pageSizeOptions?: string[];
  getCheckboxProps?: (record: LooseObject) => object;
  eventHandler?: DatatableEventHandler<T>;
  scroll?: DataTableScroll;
  bordered?: boolean;
  onSearchChange?: (value: string) => void;
  onRowSelected?: (selectedRowKeys: string[], selectedRows: T[]) => void;
  onFetched?: (data: XhrResponse<DataTableData<T>>) => void;
  onFailure?: (error: Error) => void;
  onFinally?: () => void;
}

interface IBaseData {
  [key: string]: any;
}

interface ICachedTableState {
  query: ({
    'search': string | null
  } & DataTableQueryParam) | undefined;
}

// Page Segment Component
const PageSegment: React.FC<{
  withSearch: boolean;
  searchValue: string;
  searchPlaceholder: string;
  options: SegmentedOption[];
  onRefresh: () => void;
  onSearchChange: (value: string) => void;
}> = ({withSearch, searchValue, searchPlaceholder, options, onRefresh, onSearchChange}) => {
  return (
    <div className="flex items-center justify-between mb-4">
      <div className="flex items-center space-x-4">
        {options.map(option => (
          <Badge key={option.value} variant="secondary" className="px-3 py-1">
            {option.title} {option.payload?.count !== undefined && `(${option.payload.count})`}
          </Badge>
        ))}
      </div>
      <div className="flex items-center space-x-2">
        {withSearch && (
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4"/>
            <input
              type="text"
              placeholder={searchPlaceholder}
              value={searchValue}
              onChange={(e) => onSearchChange(e.target.value)}
              className="pl-10 w-64 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        )}
        <Button variant="outline" size="sm" onClick={onRefresh}>
          <RefreshCw className="h-4 w-4"/>
        </Button>
      </div>
    </div>
  );
};

const DataTable = <T extends IBaseData>(props: IProps<T>) => {
  const {
    rowKey,
    endpoint,
    query,
    columns,
    items,
    search,
    withSelection = false,
    withTopSegment = false,
    topSegmentTitle,
    searchPlaceholder = 'Search Table',
    withPagination = true,
    pageSizeOptions = ['5', '10', '20', '50', '100'],
    getCheckboxProps,
    eventHandler,
    scroll = {y: 485, x: 600},
    onSearchChange,
    onRowSelected,
    onFetched,
    onFailure,
    onFinally,
  } = props;

  if (!endpoint && !items) {
    throw new Error('Either endpoint or items must be provided');
  }

  const {message} = App.useApp();

  const [isFetching, setIsFetching] = useState(!items);
  const isFirstRender = useRef(true);
  const isSearchingAllowed = useRef(false);
  const shouldShowRestoreMessage = useRef(false);

  const [tableData, setTableData] = useState<T[]>([]);
  const [selected, setSelected] = useState<React.Key[]>([]);
  const [columnMetaData, setColumnMetaData] = useState<LooseObject>({});
  const [sortConfig, setSortConfig] = useState<{ key: string; direction: 'asc' | 'desc' } | null>(null);

  const isExternalSearch = !!search;

  const topSegmentOptions = useRef<SegmentedOption[]>([
    {
      value: 0,
      title: topSegmentTitle || 'All Entities',
      payload: {color: "green", count: 0},
    },
  ]);

  const tableColumns = columns.filter((column) => {
    return column.canDisplay ? column.canDisplay() : true;
  });

  const pathname = usePathname();
  const columnIndex = useRef<Record<string | number, number>>({}).current;

  const isBrowser = () => typeof window !== 'undefined';

  const getCacheKey = () => {
    const url = pathname.replace('/', '').replaceAll('/', '_');
    const endpointKey = endpoint?.split('://')[1]
      ?.replaceAll('/', '_')
      .replaceAll(':', '_')
      .replaceAll('?', '');

    return url + '-' + endpointKey;
  };

  const getCachedTableState = (): ICachedTableState => {
    const defaultVal = '{}';
    const raw = isBrowser()
      ? localStorage.getItem(getCacheKey()) || defaultVal
      : defaultVal;
    return JSON.parse(raw);
  };

  const handleRefresh = () => {
    fetchData({...params, ...cachedTableState.query});
  };

  const performSearch = (value: string) => {
    isSearchingAllowed.current = true;
    setSearchQuery(value);
  };

  const cacheTableState = (queryParams: DataTableQueryParam) => {
    if (typeof window === 'undefined') return;
    const queryClone = cloneDeep(queryParams);

    if (columnMetaData['order_dir']) {
      queryClone['order_dir'] = columnMetaData['order_dir'];
      queryClone['order_col'] = columnMetaData['order_col'];
    }

    localStorage.setItem(
      getCacheKey(),
      JSON.stringify({query: queryClone})
    );
  };

  const cachedTableState = getCachedTableState();

  const [searchQuery, setSearchQuery] = useState(cachedTableState.query
    ? (search || (cachedTableState.query["search"] || ''))
    : (search || '')
  );

  const makeDefaultParams = () => ({
    'search': searchQuery,
    draw: cachedTableState?.query?.draw || 1,
    start: cachedTableState?.query?.start || 0,
    length: cachedTableState?.query?.length || 10,
  });

  const [params, setParams] = useState<DataTableQueryParam>(makeDefaultParams);

  const [pagination, setPagination] = useState<DatatablePagination>({
    pageSizeOptions,
    total: 0,
    current: cachedTableState?.query?.draw || 1,
    pageSize: cachedTableState?.query?.length || 10,
  });

  // Initial preparations and data load
  useEffect(() => {
    const defaultParams = cachedTableState.query || makeDefaultParams();
    let apiParams = {...defaultParams, ...query};

    if (cachedTableState.query) {
      try {
        const cachedParams = cachedTableState.query;
        const searchValue = cachedParams['search'] as string | undefined;

        if (searchValue) {
          setSearchQuery(searchValue);
          onSearchChange?.(searchValue);
          shouldShowRestoreMessage.current = true;
        }

        apiParams = {...defaultParams, ...cachedParams};

        if (searchQuery) {
          apiParams['search'] = searchQuery;
        }

      } catch (e) {
        console.error('Error parsing cached params', e);
      }
    }

    if (items) {
      setTableData(items);
    } else {
      fetchData(apiParams);
    }
  }, [items, query]);

  // Search term restored message
  useEffect(() => {
    if (!isExternalSearch && isFirstRender.current && shouldShowRestoreMessage.current) {
      message
        .info('Previous table state restored', 3)
        .then(() => {
          shouldShowRestoreMessage.current = false
        });

      isFirstRender.current = false;
    }
  }, [shouldShowRestoreMessage, message, isExternalSearch]);

  useEffect(() => {
    if (columns) {
      const newMetaData: LooseObject = {};
      columns.forEach((item, index) => {
        newMetaData[`columns[${index}][data]`] = item.dataIndex;
        newMetaData[`columns[${index}][orderable]`] = true;
        newMetaData[`columns[${index}][searchable]`] = true;
        columnIndex[item.dataIndex as string] = index;
      });
      setColumnMetaData(newMetaData);
    }
  }, [columns]);

  const fetchData = useCallback(
    debounce((fetchParam: DataTableQueryParam) => {
      if (!endpoint) return;

      console.info(`Fetching data from ${endpoint}`);

      const queryParams = {...columnMetaData, ...fetchParam};

      if (Number.isNaN(queryParams.start)) queryParams.start = 0;

      cacheTableState(queryParams);
      setIsFetching(true);

      xhrGet<DataTableData<T>>(endpoint, queryParams)
        .then((resp) => {
          setPagination((prev) => ({
            ...prev,
            pageSize: queryParams.length,
            current: queryParams.draw,
            total: resp.data.recordsTotal,
          }));

          topSegmentOptions.current[0]!.payload!.count = resp.data.recordsTotal;

          setTableData(
            resp.data.data.map((item) => ({
              ...item,
              key: item[rowKey] as unknown as string,
            }))
          );

          onFetched?.(resp);
          isSearchingAllowed.current = false;
        })
        .catch((e) => {
          onFailure?.(e);
        })
        .finally(() => {
          onFinally?.();
          setIsFetching(false);
        });
    }, 200),
    [endpoint, columnMetaData, rowKey, isSearchingAllowed]
  );

  const handleSort = (columnKey: string) => {
    if (!tableColumns.find(col => col.dataIndex === columnKey)?.sortable) return;

    let direction: 'asc' | 'desc' = 'asc';

    if (sortConfig?.key === columnKey && sortConfig.direction === 'asc') {
      direction = 'desc';
    }

    setSortConfig({key: columnKey, direction});

    const newMetaData = {...columnMetaData};
    newMetaData['order_col'] = columnIndex[columnKey];
    newMetaData['order_dir'] = direction;

    setColumnMetaData(newMetaData);

    const newParams = {...params};
    newParams.start = 0;
    newParams.draw = 1;

    fetchData(newParams);
  };

  const clearSelection = () => setSelected([]);

  const handleSelectAll = (checked: CheckboxChangeEvent) => {
    if (checked.target.checked) {
      const allKeys = tableData.map(item => item[rowKey] as React.Key);
      setSelected(allKeys);
      onRowSelected?.(allKeys as string[], tableData);
    } else {
      setSelected([]);
      onRowSelected?.([], []);
    }
  };

  const handleSelectRow = (key: React.Key, checked: boolean, record: T) => {
    let newSelected: React.Key[];

    if (checked) {
      newSelected = [...selected, key];
    } else {
      newSelected = selected.filter(k => k !== key);
    }

    setSelected(newSelected);

    const selectedRecords = tableData.filter(item =>
      newSelected.includes(item[rowKey] as React.Key)
    );

    onRowSelected?.(newSelected as string[], selectedRecords);
  };

  const handlePageChange = (page: number) => {
    const newParams = {...params};
    newParams.draw = page;
    newParams.start = (page - 1) * pagination.pageSize;

    setParams(newParams);
    fetchData(newParams);
  };

  const handlePageSizeChange = (pageSize: string) => {
    const newSize = parseInt(pageSize);
    const newParams = {...params};
    newParams.length = newSize;
    newParams.draw = 1;
    newParams.start = 0;

    setParams(newParams);
    setPagination(prev => ({...prev, pageSize: newSize, current: 1}));
    fetchData(newParams);
  };

  const customRow = (record: T) => ({
    onClick: (event: React.MouseEvent) => eventHandler?.onClick?.({event, data: record}),
    onDoubleClick: (event: React.MouseEvent) => eventHandler?.onDoubleClick?.({event, data: record}),
    onContextMenu: (event: React.MouseEvent) => eventHandler?.onContextMenu?.({event, data: record}),
    onMouseEnter: (event: React.MouseEvent) => eventHandler?.onMouseenter?.({event, data: record}),
    onMouseLeave: (event: React.MouseEvent) => eventHandler?.onMouseLeave?.({event, data: record}),
  });

  // Watch search term and fetch
  useEffect(() => {
    if (!isSearchingAllowed.current) return;

    console.info(`Searching for ${searchQuery}`);

    const updatedParams = {
      ...params,
      'search': searchQuery || '',
    };

    updatedParams.draw = 1;
    updatedParams.start = 0;
    updatedParams.length = pagination.pageSize;

    setParams(updatedParams);
    fetchData(updatedParams);
  }, [searchQuery, isFirstRender, isSearchingAllowed]);

  const renderSortIcon = (columnKey: string) => {
    if (!tableColumns.find(col => col.dataIndex === columnKey)?.sortable) return null;

    if (sortConfig?.key === columnKey) {
      return sortConfig.direction === 'asc' ?
        <ChevronUp className="h-4 w-4"/> :
        <ChevronDown className="h-4 w-4"/>;
    }
    return <ChevronDown className="h-4 w-4 opacity-30"/>;
  };

  const isAllSelected = selected.length === tableData.length && tableData.length > 0;
  const isIndeterminate = selected.length > 0 && selected.length < tableData.length;

  const totalPages = Math.ceil(pagination.total / pagination.pageSize);
  const startItem = (pagination.current - 1) * pagination.pageSize + 1;
  const endItem = Math.min(pagination.current * pagination.pageSize, pagination.total);

  // @ts-ignore
  function isRenderedCell<T>(value: any): value is RenderedCell<T> {
    return value && typeof value === 'object' && 'children' in value;
  }

  return (
    <div className="space-y-4">
      {withTopSegment && (
        <PageSegment
          withSearch={true}
          searchValue={searchQuery}
          searchPlaceholder={searchPlaceholder}
          options={topSegmentOptions.current}
          onRefresh={handleRefresh}
          onSearchChange={performSearch}
        />
      )}

      <Card>
        <CardContent className="p-0">
          <div style={{maxHeight: scroll?.y, overflowY: 'auto', overflowX: 'auto'}}>
            <Table>
              <TableHeader>
                <TableRow>
                  {withSelection && (
                    <TableHead className="w-12">
                      <Checkbox
                        checked={isAllSelected}
                        onChange={handleSelectAll}
                        ref={(ref) => {
                          if (ref) {
                            // @ts-ignore
                            ref.indeterminate = isIndeterminate;
                          }
                        }}
                      />
                    </TableHead>
                  )}
                  {tableColumns.map((column) => (
                    <TableHead
                      key={column.dataIndex as string}
                      className={`${column.align === 'center' ? 'text-center' : column.align === 'right' ? 'text-right' : 'text-left'} ${column.sortable ? 'cursor-pointer select-none' : ''}`}
                      style={{width: column.width}}
                      onClick={() => column.sortable && handleSort(column.dataIndex as string)}
                    >
                      <div className="flex items-center space-x-1">
                        <span className="text-gray-400 font-bold">{column.title}</span>
                        {renderSortIcon(column.dataIndex as string)}
                      </div>
                    </TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {isFetching ? (
                  Array.from({length: pagination.pageSize}).map((_, _index) => (
                    <TableRow key={cmk('row')}>
                      {withSelection && (
                        <TableCell>
                          <Skeleton className="h-4 w-4"/>
                        </TableCell>
                      )}
                      {tableColumns.map((column) => (
                        <TableCell key={column.dataIndex as string}>
                          <Skeleton className="h-4 w-full"/>
                        </TableCell>
                      ))}
                    </TableRow>
                  ))
                ) : tableData.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={(tableColumns.length + (withSelection ? 1 : 0))} className="text-center py-8">
                      No data available
                    </TableCell>
                  </TableRow>
                ) : (
                  tableData.map((record, index) => {
                    const rowKey = record[props.rowKey] as React.Key;
                    const rowEvents = customRow(record);

                    return (
                      <TableRow
                        key={rowKey}
                        className="hover:bg-muted/50 cursor-pointer"
                        {...rowEvents}
                      >
                        {withSelection && (
                          <TableCell>
                            <Checkbox
                              checked={selected.includes(rowKey)}
                              onChange={(e) => handleSelectRow(rowKey, e.target.checked, record)}
                              {...(getCheckboxProps ? getCheckboxProps(record) : {})}
                            />
                          </TableCell>
                        )}
                        {tableColumns.map((column) => (
                          <TableCell
                            key={column.dataIndex as string}
                            className={
                              column.align === 'center'
                                ? 'text-center'
                                : column.align === 'right'
                                  ? 'text-right'
                                  : 'text-left'
                            }
                          >
                            {(() => {
                              const rendered = column.render
                                ? column.render(record[column.dataIndex as keyof T], record, index)
                                : String(record[column.dataIndex as keyof T] || '');

                              if (!rendered) return null;

                              if (isRenderedCell(rendered)) return (rendered as { children: ReactNode }).children;

                              return rendered;
                            })()}
                          </TableCell>
                        ))}
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Footer with pagination and selection actions */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          {selected.length > 0 && (
            <>
              <Button variant="outline" onClick={clearSelection}>
                Clear Selection
              </Button>
              <Button disabled>
                Export ({selected.length})
              </Button>
            </>
          )}
        </div>

        {withPagination && pagination.total > 0 && (
          <div className="flex items-center space-x-6">
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-600">Rows per page:</span>
              <select
                value={pagination.pageSize.toString()}
                onChange={(e) => handlePageSizeChange(e.target.value)}
                className="px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {pageSizeOptions.map((size) => (
                  <option key={size} value={size.toString()}>
                    {size}
                  </option>
                ))}
              </select>
            </div>

            <div className="text-sm text-gray-600">
              {startItem}-{endItem} of {pagination.total}
            </div>

            <div className="flex items-center space-x-1">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(1)}
                disabled={pagination.current === 1}
              >
                <ChevronsLeft className="h-4 w-4"/>
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(pagination.current - 1)}
                disabled={pagination.current === 1}
              >
                <ChevronLeft className="h-4 w-4"/>
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(pagination.current + 1)}
                disabled={pagination.current === totalPages}
              >
                <ChevronRight className="h-4 w-4"/>
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(totalPages)}
                disabled={pagination.current === totalPages}
              >
                <ChevronsRight className="h-4 w-4"/>
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DataTable;