import type {DataTableColumnProps} from "@/lib/types/data.table";
import {User} from "@/lib/models/user";
import StatusBadge from "@/components/App/Admin/User/StatusBadge";
import ActionButton from "@/components/App/Admin/User/ActionButton";
import React, {useState} from "react";
import DataTable from "@/components/Common/DataTable";
import {apiUrl} from "@/lib/helpers/url";
import {cmk} from "@/lib/helpers/str";
import Tag from "@/components/Common/Tag";
import {formatDatetime} from "@/lib/helpers/time";

export default function TabAdminTable() {
    const [cmkTable, setCmkTable] = useState<string | null>(cmk('table'));

    const endpointList = apiUrl('admin/users/admins')

    const handleView = (_opportunity: User) => {
        // redirect(`/admin/opportunities/${opportunity.id}`)
    };

    const handleRowDoubleClick = ({data}: { event: React.MouseEvent; data: User }) => {
        handleView(data)
    };

    const handleRefresh = () => {
        setCmkTable(cmk('table'));
    };

    const columns: DataTableColumnProps<User>[] = [
        {
            dataIndex: 'first_name',
            title: 'Name',
            width: '40%',
            sortable: true,
            render: (_: string, record) => (
                <span>{record.first_name} {record.last_name}</span>
            ),
        },
        {
            dataIndex: 'role_names',
            k: 'role_names',
            title: 'Role',
            width: '20%',
            align: 'left' as const,
            sortable: true,
            render: (names: string) => {
                return names
                    .replaceAll('_', ' ')
                    .split(', ')
                    .map(r => {
                        return (
                            <Tag key={r} className="rounded-3xl mr-0.5">{r}</Tag>
                        )
                    });
            }
        },
        {
            dataIndex: 'status',
            title: 'Status',
            width: '10%',
            align: 'left' as const,
            render: (value: string) => <StatusBadge status={value}/>,
        },
        {
            dataIndex: 'created_at',
            title: 'Created At',
            width: '15%',
            align: 'left' as const,
            sortable: true,
            render: (value: string) => (
                <span className="text-gray-700">{formatDatetime(value)}</span>
            ),
        },
        {
            dataIndex: 'actions',
            title: '',
            width: '5%',
            align: 'center' as const,
            render: (_: string, record: User) => (
                <ActionButton user={record} onRefresh={handleRefresh}/>
            ),
        },
    ];

    return (
        <div>
            <DataTable<User>
                key={cmkTable}
                rowKey="id"
                endpoint={endpointList}
                columns={columns}
                withSelection={false}
                withTopSegment={false}
                withPagination={true}
                searchPlaceholder="Search admins..."
                pageSize={5}
                pageSizeOptions={['5', '10', '20', '50', '100']}
                eventHandler={{
                    onDoubleClick: handleRowDoubleClick,
                }}
                scroll={{y: 600, x: 800}}
            />
        </div>
    )
}