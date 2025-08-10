/** biome-ignore-all lint/a11y/useSemanticElements: true */
/** biome-ignore-all lint/correctness/useExhaustiveDependencies: true */
import type React from 'react';
import {useCallback, useEffect, useState} from 'react';
import {debounce} from 'lodash';
import {Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList,} from "@/components/ui/command";
import {Popover, PopoverContent, PopoverTrigger,} from "@/components/ui/popover";
import {Button} from "@/components/ui/button";
import {Input} from "@/components/ui/input";
import {Badge} from "@/components/ui/badge";
import {Separator} from "@/components/ui/separator";
import {Check, ChevronsUpDown, Loader2, Plus, X} from "lucide-react";
import {cn} from "@/lib/utils";
import {xhrGet, xhrPost} from "@/lib/xhr";
import {HttpMethod} from "@/lib/enums/http";
import type {DataTableData} from "@/lib/types/data.table";
import type {SelectableItem} from "@/lib/types/selectable";
import {Label} from "@/components/ui/label";
import {cmk} from "@/lib/helpers/str";

interface IBaseData {
  [key: string]: any;
}

export type SelectedItem<T> = T | T[] | undefined;

interface IProps<T = SelectableItem> {
  endpoint?: string | (() => string);
  mode?: 'multiple' | 'tags';
  disabled?: boolean;
  allowClear?: boolean;
  label?: string;
  placeholder: string;
  withAdder?: boolean;
  useCustomOptionRender?: boolean;
  adderValueInLowercase?: boolean;
  items?: T[];
  // Whether to embed label in value, turn the format of value from string to { value: string, label: ReactNode }
  labelInValue?: boolean;
  labelField: keyof T;
  valueField: keyof T;
  labelRender?: (props: SelectableItem<T>) => React.ReactNode;
  queryParam?: Record<string, any>;
  postPayload?: Record<string, any> | (() => Record<string, any>);
  httpMethod?: HttpMethod;
  defaultValue?: SelectedItem<T>;
  onChange?: (value: any, options: any | any[] | undefined) => void;
  className?: string;
  style?: React.CSSProperties;
  size?: 'sm' | 'default' | 'lg';
}

const fetchErrorHandler = (error: any) => {
  console.error('Fetch error:', error);
};

const Selectable = <T extends IBaseData>(props: IProps<T>) => {
  const {
    label,
    endpoint,
    labelRender,
    mode = undefined,
    disabled = false,
    allowClear = true,
    placeholder = "Select...",
    withAdder = false,
    adderValueInLowercase = false,
    items,
    labelInValue = true,
    labelField,
    valueField,
    queryParam = {},
    postPayload = {},
    httpMethod = HttpMethod.Get,
    defaultValue,
    onChange,
    className,
    style,
    size = 'default'
  } = props;

  const multiple = mode === 'multiple' || mode === 'tags';

  const [data, setData] = useState<SelectableItem<T>[]>([]);
  const [fetching, setFetching] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [adderValue, setAdderValue] = useState('');
  const [searchValue, setSearchValue] = useState('');
  const [open, setOpen] = useState(false);

  // Initialize selectedValue based on mode and defaultValue
  const getInitialValue = () => {
    if (multiple) {
      return Array.isArray(defaultValue) ? defaultValue : (defaultValue ? [defaultValue] : []);
    }
    return defaultValue;
  };

  const [selectedValue, setSelectedValue] = useState<SelectedItem<T> | undefined>(getInitialValue());

  // Update selected value when prop changes
  useEffect(() => {
    if (multiple) {
      setSelectedValue(Array.isArray(defaultValue) ? defaultValue : (defaultValue ? [defaultValue] : []));
    } else {
      setSelectedValue(defaultValue);
    }
  }, [defaultValue, multiple]);

  // Initialize with items if provided
  useEffect(() => {
    if (items) {
      setData(items.map((item) => {
        return {
          option: item,
          value: item[valueField],
          label: labelRender ? labelRender({
            option: item,
            label: labelField,
            value: valueField,
          }) : item[labelField],
        } as SelectableItem<T>;
      }));

      setHasSearched(true);
    }
  }, [items]);

  const fetchData = useCallback(
    debounce(async (searchQuery: string) => {
      if (!endpoint) return;

      console.log(`[combobox] fetching ${endpoint}`);

      setFetching(true);

      const query = Object.assign(queryParam || {}, {
        start: 0,
        length: 15,
        'filter[search]': searchQuery,
      });

      try {
        let response;
        const endpointUrl = typeof endpoint === 'function' ? endpoint() : endpoint;

        if (httpMethod === HttpMethod.Post) {
          const payload = typeof postPayload === 'function' ? postPayload() : postPayload;
          response = await xhrPost<DataTableData<T>>(endpointUrl, payload, query);
        } else {
          response = await xhrGet<DataTableData<T>>(endpointUrl, query);
        }

        const hasMultipleLabels = (labelField as string)?.includes(',');
        const splLabel = hasMultipleLabels ? (labelField as string)?.split(',') : [];

        const processedData: SelectableItem<T>[] = response.data.data.map((item) => {
          let label: React.ReactNode = '';

          if (hasMultipleLabels) {
            splLabel.forEach(field => {
              label += ` ${item[field]}`;
            });
          } else if (labelRender) {
            label = labelRender({
              option: item,
              label: labelField,
              value: valueField,
            });
          } else {
            label = !hasMultipleLabels ? item[labelField] : '';
          }

          return {
            option: item,
            label: label,
            value: item[valueField],
          } as SelectableItem<T>;
        });

        setData(processedData);
        setFetching(false);
      } catch (error) {
        fetchErrorHandler(error);
        setFetching(false);
      }
    }, 300),
    [endpoint, queryParam, postPayload, httpMethod, labelField, valueField, labelRender]
  );

  const handleOpenChange = (isOpen: boolean) => {
    setOpen(isOpen);
    if (isOpen && !hasSearched) {
      setHasSearched(true);
      fetchData('');
    }
  };

  const handleSearch = (query: string) => {
    setSearchValue(query);
    if (hasSearched) {
      fetchData(query);
    }
  };

  const addItem = () => {
    if (!adderValue.trim()) return;

    const newItem: SelectableItem<T> = {
      label: adderValue,
      value: adderValueInLowercase ? adderValue.toLowerCase() : adderValue,
      option: {
        [valueField]: adderValue,
        [labelField]: adderValue,
      } as T,
    };

    setData(prev => [...prev, newItem]);
    setAdderValue('');
  };

  const handleSelect = (currentValue: string|number) => {
    const selectedOption = data.find(item => item.value === currentValue);

    if (multiple) {
      // Ensure selectedValue is always an array for multiple mode
      const currentSelection = Array.isArray(selectedValue) ? selectedValue : [];

      const exists = currentSelection.some((item: any) =>
        (typeof item === 'object' ? item.value : item) === currentValue
      );

      if (exists) {
        // Remove item
        const newValue = currentSelection.filter((item: any) =>
          (typeof item === 'object' ? item.value : item) !== currentValue
        );
        setSelectedValue(newValue);
        onChange?.(labelInValue ? newValue : newValue.map((item: any) => typeof item === 'object' ? item.value : item), newValue);
      } else {
        // Add item
        const itemToAdd = labelInValue ? selectedOption : currentValue;
        const newValue = [...currentSelection, itemToAdd];
        setSelectedValue(newValue as SelectedItem<T>);
        onChange?.(labelInValue ? newValue : newValue.map((item: any) => typeof item === 'object' ? item.value : item), newValue);
      }
      // Keep dropdown open for multiple selection
      setSearchValue('');
    } else {
      // Single select
      const newValue = labelInValue ? selectedOption : currentValue;
      setSelectedValue(newValue as SelectedItem<T>);
      onChange?.(labelInValue ? newValue : currentValue, selectedOption);
      setOpen(false);
      setSearchValue('');
    }
  };

  const handleRemoveItem = (valueToRemove: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (multiple) {
      const currentSelection = Array.isArray(selectedValue) ? selectedValue : [];
      const newValue = currentSelection.filter((item: any) =>
        (typeof item === 'object' ? item.value : item) !== valueToRemove
      );
      setSelectedValue(newValue);
      onChange?.(labelInValue ? newValue : newValue.map((item: any) => typeof item === 'object' ? item.value : item), newValue);
    }
  };

  const handleClear = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const newValue = multiple ? [] : undefined;
    setSelectedValue(newValue);
    onChange?.(newValue, undefined);
  };

  const getDisplayValue = (): string => {
    if (!selectedValue) return placeholder;

    if (multiple && Array.isArray(selectedValue)) {
      if (selectedValue.length === 0) return placeholder;
      return `${selectedValue.length} item${selectedValue.length > 1 ? 's' : ''} selected`;
    }

    if (typeof selectedValue === 'object') {
      return (selectedValue as any).label || (selectedValue as any)[labelField] || 'Selected';
    }

    // Find the label from data for simple values
    const found = data.find(item => item.value === selectedValue);
    return found ? found.option[labelField] : (selectedValue as string).toString();
  };

  const getSelectedItems = () => {
    if (!multiple) return [];

    const currentSelection = Array.isArray(selectedValue) ? selectedValue : [];

    return currentSelection.map((item: any) => {
      if (typeof item === 'object') {
        return {
          value: item.value || item[valueField],
          label: item.label || item[labelField] || item.value || item[valueField]
        };
      }
      // Find label from data for simple values
      const found = data.find(dataItem => dataItem.value === item);
      return {
        value: item,
        label: found ? (found.option[labelField] || item) : item
      };
    });
  };

  const isSelected = (value: string|number): boolean => {
    if (!selectedValue) return false;

    if (multiple && Array.isArray(selectedValue)) {
      return selectedValue.some((item: any) =>
        (typeof item === 'object' ? item.value : item) === value
      );
    }

    return typeof selectedValue === 'object'
      ? (selectedValue as any).value === value
      : selectedValue === value;
  };

  const getSizeClasses = () => {
    switch (size) {
      case 'sm':
        return 'h-8 text-xs';
      case 'lg':
        return 'h-12 text-base';
      default:
        return 'h-10 text-sm';
    }
  };

  return (
    <Popover open={open} onOpenChange={handleOpenChange}>
      {label && (<Label htmlFor="location">{label}</Label>)}
      <PopoverTrigger asChild>
        <Button
          asChild
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn(
            "w-full justify-between font-normal",
            getSizeClasses(),
            multiple ? "h-auto min-h-10 py-2" : "",
            !selectedValue && "text-muted-foreground",
            className
          )}
          style={style}
          disabled={disabled}
        >
          <div className="flex w-full justify-between items-center">
            <div className="flex flex-wrap gap-1 flex-1 min-w-0">
              {multiple && Array.isArray(selectedValue) && selectedValue.length > 0 ? (
                <div className="flex flex-wrap gap-1">
                  {getSelectedItems().map((item) => (
                    <Badge
                      key={item.value}
                      variant="secondary"
                      className={cn(
                        "text-xs max-w-[200px] truncate",
                        size === 'sm' && "text-xs px-1 py-0",
                        size === 'lg' && "text-sm px-2 py-1"
                      )}
                    >
                      <span className="truncate">{item.label}</span>
                      {allowClear && (
                        <button
                          type="button"
                          className="ml-1 ring-offset-background rounded-full outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                          onKeyDown={(e) => {
                            if (e.key === "Enter") {
                              handleRemoveItem(item.value, e as any);
                            }
                          }}
                          onMouseDown={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                          }}
                          onClick={(e) => handleRemoveItem(item.value, e)}
                        >
                          <X className="h-3 w-3 text-muted-foreground hover:text-foreground"/>
                        </button>
                      )}
                    </Badge>
                  ))}
                </div>
              ) : (
                <span className="truncate text-left">{getDisplayValue()}</span>
              )}
            </div>

            <div className="flex items-center gap-1 ml-2">
              {allowClear && selectedValue && (multiple ? (Array.isArray(selectedValue) && selectedValue.length > 0) : true) && (
                <button
                  type="button"
                  onClick={handleClear}
                  className="hover:text-foreground text-muted-foreground p-1"
                >
                  <X className="h-4 w-4"/>
                </button>
              )}
              <ChevronsUpDown className="h-4 w-4 shrink-0 opacity-50"/>
            </div>
          </div>
        </Button>
      </PopoverTrigger>

      <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0" align="start">
        <Command shouldFilter={false}>
          <CommandInput
            placeholder={`Search ${placeholder.toLowerCase()}...`}
            value={searchValue}
            onValueChange={handleSearch}
          />
          <CommandList>
            {fetching ? (
              <div className="flex items-center justify-center py-6">
                <Loader2 className="h-4 w-4 animate-spin"/>
                <span className="ml-2 text-sm text-muted-foreground">Loading...</span>
              </div>
            ) : (
              <>
                <CommandEmpty>
                  {searchValue ? `No results found for "${searchValue}"` : "No options available"}
                </CommandEmpty>
                {data.length > 0 && (
                  <CommandGroup>
                    {data.map((item) => {
                      const itemValue = (item.value || item.option[valueField]) as string | number;
                      const itemLabel = (item.label || item.option[labelField]) as string | number;

                      return (
                        <CommandItem
                          key={cmk()}
                          value={itemValue as string}
                          onSelect={() => handleSelect(itemValue)}
                          className="cursor-pointer"
                        >
                          <Check
                            className={cn(
                              "mr-2 h-4 w-4",
                              isSelected(itemValue) ? "opacity-100" : "opacity-0"
                            )}
                          />
                          <span className="flex-1 truncate">{itemLabel}</span>
                        </CommandItem>
                      );
                    })}
                  </CommandGroup>
                )}
              </>
            )}

            {withAdder && (
              <>
                <Separator className="my-1"/>
                <div className="p-2">
                  <div className="flex gap-2">
                    <Input
                      value={adderValue}
                      onChange={(e) => setAdderValue(e.target.value)}
                      placeholder="Add new item..."
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          addItem();
                        }
                      }}
                      className="flex-1 h-8 text-sm"
                    />
                    <Button
                      type="button"
                      size="sm"
                      onClick={addItem}
                      disabled={!adderValue.trim()}
                      className="h-8 px-2"
                    >
                      <Plus className="h-3 w-3"/>
                    </Button>
                  </div>
                </div>
              </>
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};

export default Selectable;