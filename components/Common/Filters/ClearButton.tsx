import React from "react";

interface ClearButtonProps {
    onClear: () => void;
}

const ClearButton: React.FC<ClearButtonProps> = ({ onClear }) => (
    <button
        onClick={onClear}
        className="text-blue-500 text-sm hover:text-blue-600 mt-2 underline"
    >
        Clear Filters
    </button>
);

export default ClearButton;
