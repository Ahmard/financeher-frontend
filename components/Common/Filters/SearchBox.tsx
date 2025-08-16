import {SearchIcon} from "lucide-react";

interface SearchBoxProps {
    placeholder: string;
    value: string;
    onChange: (value: string) => void;
}

const SearchBox: React.FC<SearchBoxProps> = ({placeholder, value, onChange}) => (
    <div className="relative mb-3">
        <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4"/>
        <input
            type="text"
            placeholder={placeholder}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
        />
    </div>
);

export default SearchBox;