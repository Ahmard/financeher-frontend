import type React from "react";
import {Badge} from "@/components/ui/badge";

interface IProps {
    status: string;
}


const StatusBadge: React.FC<IProps> = ({status}) => {
    let colorClass = '';
    switch (status) {
        case 'active':
            colorClass = 'bg-green-100 text-green-800 hover:bg-green-100';
            break;
        case 'inactive':
            colorClass = 'bg-red-100 text-red-800 hover:bg-red-100';
            break;
        case 'pending':
            colorClass = 'bg-yellow-100 text-yellow-800 hover:bg-yellow-100';
            break;
        default:
            colorClass = 'bg-gray-100 text-gray-800 hover:bg-gray-100';
    }

    return <Badge variant="secondary" className={colorClass}>{status}</Badge>;
}

export default StatusBadge;