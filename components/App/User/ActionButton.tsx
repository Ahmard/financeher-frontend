import {Button} from "@/components/ui/button";
import {Eye, MoreHorizontal, Trash2} from "lucide-react";
import {useState} from "react";
import type {Opportunity} from "@/lib/models/opportunity";
import {redirect} from "next/navigation";
import {cmk} from "@/lib/helpers/str";
import {HttpMethod} from "@/lib/enums/http";
import {apiUrl} from "@/lib/helpers/url";
import ConfirmWithReason from "@/components/Common/ConfirmWithReason";
import {User} from "@/lib/models/user";
import Confirm from "@/components/Common/Confirm";

interface IProps {
    user: User,
    onRefresh: () => void;
}

export default function ActionButton({user, onRefresh}: IProps) {
    const [openDropdown, setOpenDropdown] = useState<string | null>(null);

    const [confirmModal, setConfirmModal] = useState({
        state: false,
        cmk: '',
        title: '',
        okText: '',
        successMessage: '',
        endpoint: '',
    });

    const handleDelete = () => {
        setOpenDropdown(null);
        setConfirmModal({
            cmk: cmk(),
            state: true,
            title: 'Delete Opportunity',
            okText: 'Delete',
            successMessage: 'Opportunity deleted successfully',
            endpoint: apiUrl(`admin/opportunities/${user.id}`)
        });
    };

    const handleDropdownToggle = (id: string) => {
        setOpenDropdown(openDropdown === id ? null : id);
    };

    const handleView = () => {
        redirect(`/admin/opportunities/${user.id}`)
    };

    return (
        <>
            <div className="relative">
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => {
                        e.stopPropagation();
                        handleDropdownToggle(user.id);
                    }}
                    className="p-1 h-8 w-8"
                >
                    <MoreHorizontal className="h-4 w-4 text-gray-400"/>
                </Button>

                {openDropdown === user.id && (
                    <div
                        className="absolute right-0 mt-1 w-32 bg-white rounded-md shadow-lg border border-gray-200 z-10">
                        <div className="py-1">
                            <button
                                type="button"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    handleView();
                                }}
                                className="flex items-center w-full px-3 py-2 text-sm text-gray-700 hover:bg-gray-100"
                            >
                                <Eye className="h-4 w-4 mr-2"/>
                                View
                            </button>
                            <button
                                type="button"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    handleDelete();
                                }}
                                className="flex items-center w-full px-3 py-2 text-sm text-red-600 hover:bg-gray-100"
                            >
                                <Trash2 className="h-4 w-4 mr-2"/>
                                Delete
                            </button>
                        </div>
                    </div>
                )}
            </div>

            <Confirm
                key={confirmModal.cmk}
                visible={confirmModal.state}
                title={confirmModal.title}
                okText={confirmModal.okText}
                successMessage={confirmModal.successMessage}
                endpoint={confirmModal.endpoint}
                httpMethod={HttpMethod.Delete}
                onSuccess={onRefresh}
                onCancel={() => {
                    setConfirmModal({
                        ...confirmModal,
                        state: false,
                    });
                }}
            />
        </>
    )
}