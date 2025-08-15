/** biome-ignore-all lint/correctness/useExhaustiveDependencies: true */
'use client';

import {Trash2} from 'lucide-react';
import type React from 'react';
import {useEffect, useState} from 'react';
import AdminLayout, {CurrentPage} from "@/components/App/Layouts/AdminLayout";
import DataTable from "@/components/Common/DataTable";
import {Button} from '@/components/ui/button';
import {apiUrl} from "@/lib/helpers/url";
import type {DataTableColumnProps} from "@/lib/types/data.table";
import ActionButton from "@/components/App/User/ActionButton";
import {cmk} from "@/lib/helpers/str";
import Link from "next/link";
import PageHeader from "@/components/Common/PageHeader";
import {xhrGet} from "@/lib/xhr";
import {User} from "@/lib/models/user";
import StatusBadge from "@/components/App/User/StatusBadge";
import {usePageTitle} from "@/lib/helpers/page.helper";

interface IPageMetrics {
    all: number;
    active: number;
    suspended: number;
}

const UsersPage = () => {
    usePageTitle('Users');

    const [selectedTab, setSelectedTab] = useState('all');
    const [selectedRowKeys, setSelectedRowKeys] = useState<string[]>([]);
    const [_selectedRows, setSelectedRows] = useState<User[]>([]);

    const [cmkTable, setCmkTable] = useState<string | null>(cmk('table'));

    const [pageMetrics, setPageMetrics] = useState<IPageMetrics>({
        all: 0,
        active: 0,
        suspended: 0
    });

    const endpointList = apiUrl('admin/users', {
        'filter[status]': selectedTab,
    })

    const tabs = [
        {key: 'all', label: `All (${pageMetrics.all})`, count: pageMetrics.all},
        {key: 'active', label: `Active (${pageMetrics.active})`, count: pageMetrics.active},
        {key: 'inactive', label: `Suspended (${pageMetrics.suspended})`, count: pageMetrics.suspended}
    ];

    const changeTab = (tab: string) => {
        setSelectedTab(tab);
        handleRefresh();
    };

    const handleView = (_opportunity: User) => {
        // redirect(`/admin/opportunities/${opportunity.id}`)
    };

    const handleRowDoubleClick = ({data}: { event: React.MouseEvent; data: User }) => {
        handleView(data)
    };

    const handleRefresh = () => {
        setCmkTable(cmk('table'));
    };

    const handleRowSelection = (selectedRowKeys: string[], selectedRows: User[]) => {
        setSelectedRowKeys(selectedRowKeys);
        setSelectedRows(selectedRows);
    };

    const fetchPageMetrics = () => {
        xhrGet<IPageMetrics>(apiUrl('admin/users/page-metrics'))
            .then(resp => {
                setPageMetrics(resp.data)
            })
    }

    const columns: DataTableColumnProps<User>[] = [
        {
            dataIndex: 'business_name',
            title: 'Business',
            width: '40%',
            sortable: true,
        },
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
            dataIndex: 'email',
            title: 'Email',
            width: '20%',
            align: 'left' as const,
            sortable: true,
        },
        {
            dataIndex: 'mobile_number',
            title: 'Mobile Number',
            width: '20%',
            align: 'left' as const,
            sortable: true,
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
                <span className="text-gray-700">{value}</span>
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

    useEffect(() => {
        fetchPageMetrics();
    }, []);

    return (
        <AdminLayout currentPage={CurrentPage.Users}>
            <div className="p-6 bg-gray-50 min-h-screen">
                <div className="max-w-7xl mx-auto">
                    {/* Header */}
                    <div className="flex justify-between items-center mb-6">
                        <PageHeader name="Users"/>

                        <Link href="/admin/users/create">
                            <Button className="cursor-pointer bg-green-700 hover:bg-green-800 text-white">
                                Invite User
                            </Button>
                        </Link>
                    </div>

                    {/* Tabs */}
                    <div className="flex space-x-1 mb-6">
                        <div className="bg-[#E5F0ED] p-1 rounded-2xl">
                            {tabs.map((tab) => (
                                <Button
                                    key={tab.key}
                                    variant={selectedTab === tab.key ? "default" : "ghost"}
                                    onClick={() => changeTab(tab.key)}
                                    className={`${
                                        selectedTab === tab.key
                                            ? 'bg-white !text-[#214F47] shadow-sm hover:bg-white'
                                            : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                                    }`}
                                >
                                    {tab.label}
                                </Button>
                            ))}
                        </div>
                    </div>

                    {/* DataTable */}
                    <DataTable<User>
                        key={cmkTable}
                        rowKey="id"
                        endpoint={endpointList}
                        columns={columns}
                        withSelection={true}
                        withTopSegment={false}
                        withPagination={true}
                        searchPlaceholder="Search users..."
                        pageSizeOptions={['10', '20', '50', '100']}
                        onRowSelected={handleRowSelection}
                        eventHandler={{
                            onDoubleClick: handleRowDoubleClick,
                        }}
                        scroll={{y: 600, x: 800}}
                    />

                    {/* Selection Summary */}
                    {selectedRowKeys.length > 0 && (
                        <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                            <div className="flex items-center justify-between">
                <span className="text-sm text-blue-800">
                  {selectedRowKeys.length} opportunity(ies) selected
                </span>
                                <div className="flex space-x-2">
                                    <Button variant="outline" size="sm">
                                        Bulk Edit
                                    </Button>
                                    <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700">
                                        <Trash2 className="h-4 w-4 mr-1"/>
                                        Delete Selected
                                    </Button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </AdminLayout>
    );
};

export default UsersPage;