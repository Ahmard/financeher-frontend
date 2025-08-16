import React from "react";
import {ChevronDown, ChevronUp} from "lucide-react";

interface FilterDropdownProps {
    title: string;
    children: React.ReactNode;
    isOpen: boolean;
    onToggle: () => void;
}

const Dropdown: React.FC<FilterDropdownProps> = ({title, children, isOpen, onToggle}) => {
    return (
        <div className="mb-4">
            <button
                onClick={onToggle}
                className="flex items-center justify-between w-full px-4 py-2.5 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-green-500 text-left"
            >
                <span className="text-sm text-gray-600">{title}</span>
                {isOpen ? <ChevronUp className="w-4 h-4 text-gray-400"/> :
                    <ChevronDown className="w-4 h-4 text-gray-400"/>}
            </button>

            {isOpen && (
                <div className="mt-2 bg-white border border-gray-200 rounded-lg shadow-sm p-4">
                    {children}
                </div>
            )}
        </div>
    );
};

export default Dropdown;