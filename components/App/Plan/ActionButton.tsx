import {Button} from "@/components/ui/button";
import {Eye, MoreHorizontal, Trash2} from "lucide-react";
import {useState} from "react";
import {redirect} from "next/navigation";
import {cmk} from "@/lib/helpers/str";
import {HttpMethod} from "@/lib/enums/http";
import {apiUrl} from "@/lib/helpers/url";
import ConfirmWithReason from "@/components/Common/ConfirmWithReason";
import type {Plan} from "@/lib/models/plan";

interface IProps {
  plan: Plan,
  onRefresh: () => void;
}

export default function ActionButton({plan, onRefresh}: IProps) {
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  const [confirmModal, setConfirmModal] = useState({
    state: false,
    cmk: '',
    title: '',
    label: '',
    okText: '',
    placeholder: '',
    statement: '',
    successMessage: '',
    endpoint: '',
  });

  const handleDelete = () => {
    setOpenDropdown(null);
    setConfirmModal({
      cmk: cmk(),
      state: true,
      title: 'Delete Plan',
      okText: 'Delete',
      label: 'Deletion Reason',
      statement: `This action cannot be undone. This will permanently delete the plan "${plan.name}" and all associated data.`,
      placeholder: 'Why are you deleting this plan?',
      successMessage: 'Plan deleted successfully',
      endpoint: apiUrl(`admin/plans/${plan.id}`)
    });
  };

  const handleDropdownToggle = (id: string) => {
    setOpenDropdown(openDropdown === id ? null : id);
  };

  const handleView = (plan: Plan) => {
    redirect(`/admin/plans/${plan.id}`)
  };

  return (
    <>
      <div className="relative">
        <Button
          variant="ghost"
          size="sm"
          onClick={(e) => {
            e.stopPropagation();
            handleDropdownToggle(plan.id);
          }}
          className="p-1 h-8 w-8"
        >
          <MoreHorizontal className="h-4 w-4 text-gray-400"/>
        </Button>

        {openDropdown === plan.id && (
          <div className="absolute right-0 mt-1 w-32 bg-white rounded-md shadow-lg border border-gray-200 z-10">
            <div className="py-1">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleView(plan);
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

      <ConfirmWithReason
        key={confirmModal.cmk}
        visible={confirmModal.state}
        title={confirmModal.title}
        label={confirmModal.label}
        okText={confirmModal.okText}
        placeholder={confirmModal.placeholder}
        statement={confirmModal.statement}
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