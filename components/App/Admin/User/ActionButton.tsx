import {Button} from "@/components/ui/button";
import {MoreHorizontal, UserRoundCheckIcon, UserRoundXIcon} from "lucide-react";
import {useState} from "react";
import {redirect} from "next/navigation";
import {cmk} from "@/lib/helpers/str";
import {HttpMethod} from "@/lib/enums/http";
import {apiUrl} from "@/lib/helpers/url";
import {User, UserStatus} from "@/lib/models/user";
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
        statement: '',
        successMessage: '',
        endpoint: '',
        httpMethod: HttpMethod.Patch,
    });

    const handleActivate = () => {
        setOpenDropdown(null);
        setConfirmModal({
            cmk: cmk(),
            state: true,
            title: 'Activate User',
            okText: 'Activate',
            statement: 'Are you sure you want to activate this user?',
            successMessage: 'User has been activated successfully',
            endpoint: apiUrl(`admin/users/${user.id}/activate`)
        });
    };

    const handleSuspension = () => {
        setOpenDropdown(null);
        setConfirmModal({
            cmk: cmk(),
            state: true,
            title: 'Suspend User?',
            okText: 'Suspend',
            statement: 'Are you sure you want to suspend this user?',
            successMessage: 'User has been suspended successfully',
            endpoint: apiUrl(`admin/users/${user.id}/deactivate`)
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
                            {user.status == UserStatus.Inactive && (
                                <button
                                    type="button"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleActivate();
                                    }}
                                    className="flex items-center w-full px-3 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                >
                                    <UserRoundCheckIcon/>
                                    Activate User
                                </button>
                            )}

                            {user.status == UserStatus.Active && (
                                <button
                                    type="button"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleSuspension();
                                    }}
                                    className="flex items-center w-full px-3 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                >
                                    <UserRoundXIcon/>
                                    Suspend User
                                </button>
                            )}
                        </div>
                    </div>
                )}
            </div>

            <Confirm
                key={confirmModal.cmk}
                visible={confirmModal.state}
                title={confirmModal.title}
                statement={confirmModal.statement}
                okText={confirmModal.okText}
                successMessage={confirmModal.successMessage}
                endpoint={confirmModal.endpoint}
                httpMethod={confirmModal.httpMethod}
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