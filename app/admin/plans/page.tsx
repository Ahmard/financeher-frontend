/** biome-ignore-all lint/correctness/useExhaustiveDependencies: true */
'use client';

import {Trash2} from 'lucide-react';
import type React from 'react';
import {useEffect, useState} from 'react';
import AdminLayout, {CurrentPage} from "@/components/App/Layouts/AdminLayout";
import DataTable from "@/components/Common/DataTable";
import {Badge} from '@/components/ui/badge';
import {Button} from '@/components/ui/button';
import {apiUrl} from "@/lib/helpers/url";
import type {DataTableColumnProps} from "@/lib/types/data.table";
import {formatMoney} from "@/lib/helpers/monetery";
import ActionButton from "@/components/App/Admin/Plan/ActionButton";
import {cmk} from "@/lib/helpers/str";
import Link from "next/link";
import PageHeader from "@/components/Common/PageHeader";
import {xhrGet} from "@/lib/xhr";
import type {Plan} from "@/lib/models/plan";
import {redirect} from "next/navigation";

interface IPageMetrics {
    all: number;
}

const OpportunitiesPage = () => {
    const [selectedTab, setSelectedTab] = useState('all');
    const [selectedRowKeys, setSelectedRowKeys] = useState<string[]>([]);
    const [_selectedRows, setSelectedRows] = useState<Plan[]>([]);

    const [cmkTable, setCmkTable] = useState<string | null>(cmk('table'));

    const [pageMetrics, setPageMetrics] = useState<IPageMetrics>({
        all: 0,
    });

    const endpointList = apiUrl('admin/plans', {
        'filter[status]': selectedTab,
    })

    const tabs = [
        {key: 'all', label: `All (${pageMetrics.all})`, count: pageMetrics.all},
    ];

    const changeTab = (tab: string) => {
        setSelectedTab(tab);
        handleRefresh();
    };

    const handleView = (plan: Plan) => {
        redirect(`/admin/plans/${plan.id}`)
    };

    const handleRowDoubleClick = ({data}: { event: React.MouseEvent; data: Plan }) => {
        handleView(data)
    };

    const handleRefresh = () => {
        setCmkTable(cmk('table'));
    };

    const handleRowSelection = (selectedRowKeys: string[], selectedRows: Plan[]) => {
        setSelectedRowKeys(selectedRowKeys);
        setSelectedRows(selectedRows);
    };

    const fetchPageMetrics = () => {
        xhrGet<IPageMetrics>(apiUrl('admin/plans/page-metrics'))
            .then(resp => {
                setPageMetrics(resp.data)
            })
    }

    const columns: DataTableColumnProps<Plan>[] = [
        {
            dataIndex: 'name',
            title: 'Name',
            width: '40%',
            sortable: true,
            render: (value: string) => (
                <span className="font-medium text-gray-900" dangerouslySetInnerHTML={{__html: value}}/>
            ),
        },
        {
            dataIndex: 'price',
            title: 'Price',
            width: '20%',
            align: 'left' as const,
            sortable: true,
            render: (value: number) => (
                <span className="text-gray-700">{formatMoney(value, 0)}</span>
            ),
        },
        {
            dataIndex: 'billing_cycle',
            title: 'Billing Cycle',
            width: '15%',
            align: 'left' as const,
            sortable: true,
            render: (value: string) => (
                <Badge variant="outline">
                    {value}
                </Badge>
            ),
        },
        {
            dataIndex: 'created_at',
            title: 'Created At',
            width: '10%',
            align: 'left' as const,
            render: (value: string) => (
                <span className="text-gray-700">{value}</span>
            ),
        },
        {
            dataIndex: 'actions',
            title: '',
            width: '5%',
            align: 'center' as const,
            render: (_: string, record: Plan) => (
                <ActionButton plan={record} onRefresh={handleRefresh}/>
            ),
        },
    ];

    useEffect(() => {
        fetchPageMetrics();
    }, []);

    return (
        <AdminLayout currentPage={CurrentPage.Plans}>
            <div className="p-6 bg-gray-50 min-h-screen">
                <div className="max-w-7xl mx-auto">
                    {/* Header */}
                    <div className="flex justify-between items-center mb-6">
                        <PageHeader title="Plans"/>

                        <Link href="/admin/plans/create">
                            <Button className="cursor-pointer bg-green-700 hover:bg-green-800 text-white">
                                Create Plan
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
                                            ? 'bg-white text-gray-900 shadow-sm hover:bg-white'
                                            : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                                    }`}
                                >
                                    {tab.label}
                                </Button>
                            ))}
                        </div>
                    </div>

                    {/* DataTable */}
                    <DataTable<Plan>
                        key={cmkTable}
                        rowKey="id"
                        endpoint={endpointList}
                        columns={columns}
                        withSelection={true}
                        withTopSegment={false}
                        withPagination={true}
                        searchPlaceholder="Search opportunities..."
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

export default OpportunitiesPage;