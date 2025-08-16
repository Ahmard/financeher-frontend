import React from "react";

interface CheckboxItemProps {
    label: string;
    checked: boolean;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    count?: number;
}

const CheckboxItem: React.FC<CheckboxItemProps> = ({ label, checked, onChange, count }) => (
    <label className="flex items-center justify-between py-1.5 cursor-pointer hover:bg-gray-50 px-2 rounded">
        <div className="flex items-center">
            <input
                type="checkbox"
                checked={checked}
                onChange={onChange}
                className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
            />
            <span className="ml-2 text-sm text-gray-700">{label}</span>
        </div>
        {count && <span className="text-xs text-gray-500">({count})</span>}
    </label>
);

export default CheckboxItem;
