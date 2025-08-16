import React from "react";
import SearchBox from "@/components/Common/Filters/SearchBox";
import CheckboxItem from "@/components/Common/Filters/CheckboxItem";
import ClearButton from "@/components/Common/Filters/ClearButton";
import type {FilterOption} from "@/components/App/Customer/Landing/RightSideFilters";
import Dropdown from "@/components/Common/Filters/Dropdown";

interface IProps {
    title: string;
    isOpen: boolean;
    onToggle: () => void;
    options: FilterOption[];
    selectedOptions: string[];
    onOptionChange: (optionId: string, checked: boolean) => void;
    onClear: () => void;
    searchTerm: string;
    onSearchChange: (value: string) => void;
    isLoading?: boolean;
}

const FilterItem: React.FC<IProps> = (props: IProps) => {
    const {
        title,
        isOpen,
        onToggle,
        options,
        selectedOptions,
        onOptionChange,
        onClear,
        searchTerm,
        onSearchChange,
        isLoading = false
    } = props;

    const filteredOptions = options.filter(option =>
        option.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <Dropdown title={title} isOpen={isOpen} onToggle={onToggle}>
            <SearchBox
                placeholder={`Search ${title.toLowerCase()}...`}
                value={searchTerm}
                onChange={onSearchChange}
            />

            {isLoading ? (
                <div className="flex items-center justify-center py-4">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-green-500"></div>
                </div>
            ) : (
                <div className="space-y-1 max-h-60 overflow-y-auto">
                    {filteredOptions.length > 0 ? (
                        filteredOptions.map((option) => (
                            <CheckboxItem
                                key={option.id}
                                label={option.name}
                                checked={selectedOptions.includes(option.id)}
                                onChange={(e) => onOptionChange(option.id, e.target.checked)}
                            />
                        ))
                    ) : (
                        <div className="text-sm text-gray-500 text-center py-2">
                            No options found
                        </div>
                    )}
                </div>
            )}

            <ClearButton onClear={onClear}/>
        </Dropdown>
    );
};

export default FilterItem;
