/** biome-ignore-all lint/correctness/useExhaustiveDependencies: true */
'use client';

import {Trash2} from 'lucide-react';
import type React from 'react';
import {useEffect} from 'react';
import {useState} from 'react';
import AdminLayout, {CurrentPage} from "@/components/App/Layouts/AdminLayout";
import DataTable from "@/components/Common/DataTable";
import {Badge} from '@/components/ui/badge';
import {Button} from '@/components/ui/button';
import {apiUrl} from "@/lib/helpers/url";
import type {DataTableColumnProps} from "@/lib/types/data.table";
import {formatMoney} from "@/lib/helpers/monetery";
import ActionButton from "@/components/App/Admin/LoanVc/ActionButton";
import {cmk} from "@/lib/helpers/str";
import Link from "next/link";
import PageHeader from "@/components/Common/PageHeader";
import {xhrGet} from "@/lib/xhr";
import type {LoanVc} from "@/lib/models/loan.vc";

interface IPageMetrics {
  all: number;
  ongoing: number;
  closed: number;
}

const OpportunitiesPage = () => {
  const [selectedTab, setSelectedTab] = useState('all');
  const [selectedRowKeys, setSelectedRowKeys] = useState<string[]>([]);
  const [_selectedRows, setSelectedRows] = useState<LoanVc[]>([]);

  const [cmkTable, setCmkTable] = useState<string | null>(cmk('table'));

  const [pageMetrics, setPageMetrics] = useState<IPageMetrics>({
    all: 0,
    ongoing: 0,
    closed: 0
  });

  const endpointList = apiUrl('admin/loan-vcs', {
    'filter[status]': selectedTab,
  })

  const tabs = [
    {key: 'all', label: `All (${pageMetrics.all})`, count: pageMetrics.all},
    {key: 'ongoing', label: `Ongoing (${pageMetrics.ongoing})`, count: pageMetrics.ongoing},
    {key: 'closed', label: `Closed (${pageMetrics.closed})`, count: pageMetrics.closed}
  ];

  const changeTab = (tab: string) => {
    setSelectedTab(tab);
    handleRefresh();
  };

  const handleView = (_opportunity: LoanVc) => {
    // redirect(`/admin/loan-vcs/${opportunity.id}`)
  };

  const handleRowDoubleClick = ({data}: { event: React.MouseEvent; data: LoanVc }) => {
    handleView(data)
  };

  const handleRefresh = () => {
    setCmkTable(cmk('table'));
  };

  const handleRowSelection = (selectedRowKeys: string[], selectedRows: LoanVc[]) => {
    setSelectedRowKeys(selectedRowKeys);
    setSelectedRows(selectedRows);
  };

  const fetchPageMetrics = () => {
    xhrGet<IPageMetrics>(apiUrl('admin/loan-vcs/page-metrics'))
      .then(resp => {
        setPageMetrics(resp.data)
      })
  }

  const columns: DataTableColumnProps<LoanVc>[] = [
    {
      dataIndex: 'organisation',
      title: 'Organisation',
      width: '40%',
      sortable: true,
      render: (value: string) => (
        <span className="font-medium text-gray-900" dangerouslySetInnerHTML={{__html: value}}/>
      ),
    },
    {
      dataIndex: 'lower_amount',
      title: 'Amount',
      width: '20%',
      align: 'left' as const,
      sortable: true,
      render: (value: number, record) => (
        <span className="text-gray-700">{formatMoney(value, 0)} - {formatMoney(record.upper_amount, 0)}</span>
      ),
    },
    {
      dataIndex: 'closing_at',
      title: 'Closing Date',
      width: '15%',
      align: 'left' as const,
      sortable: true,
      render: (value: string) => (
        <span className="text-gray-700">{value}</span>
      ),
    },
    {
      dataIndex: 'status',
      title: 'Status',
      width: '10%',
      align: 'left' as const,
      render: (value: string) => (
        <Badge variant="secondary" className="bg-green-100 text-green-800 hover:bg-green-100">
          {value}
        </Badge>
      ),
    },
    {
      dataIndex: 'opportunity_type_name',
      title: 'Type',
      width: '10%',
      align: 'left' as const,
      render: (value: string) => (
        <span className="font-medium text-gray-900" dangerouslySetInnerHTML={{__html: value}}/>
      ),
    },
    {
      dataIndex: 'actions',
      title: '',
      width: '5%',
      align: 'center' as const,
      render: (_: string, record: LoanVc) => (
        <ActionButton opp={record} onRefresh={handleRefresh}/>
      ),
    },
  ];

  useEffect(() => {
    fetchPageMetrics();
  }, []);

  return (
    <AdminLayout currentPage={CurrentPage.LoanList}>
      <div className="p-6 bg-gray-50 min-h-screen">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <PageHeader name="Loans/VCs"/>

            <Link href="/admin/loan-vcs/create">
              <Button className="cursor-pointer bg-green-700 hover:bg-green-800 text-white">
                Create
              </Button>
            </Link>
          </div>

          {/* Tabs */}
          <div className="flex space-x-1 mb-6">
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

          {/* DataTable */}
          <DataTable<LoanVc>
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