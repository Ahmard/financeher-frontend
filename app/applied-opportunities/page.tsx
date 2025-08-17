'use client';

import CustomerLayout, {CustomerCurrentPage} from "@/components/App/Layouts/CustomerLayout";
import PageHeader from "@/components/Common/PageHeader";
import type React from "react";
import OpportunityListTable from "@/components/App/Customer/OpportunityListTable";
import {apiUrl} from "@/lib/helpers/url";
import {OppItemKind} from "@/lib/models/opportunity";

export default function AppliedOpportunitiesPage() {
    return (
        <CustomerLayout currentPage={CustomerCurrentPage.AppliedOpportunities}>
            <div className="p-6 bg-gray-50 min-h-screen">
                <div className="max-w-7xl mx-auto">
                    {/* Header */}
                    <div className="flex justify-between items-center mb-6">
                        <PageHeader title="Applied Opportunities"/>
                    </div>

                    <OpportunityListTable
                        searchPlaceholder="Search applied opportunities"
                        loadingMessage="Loading applied opportunities..."
                        endpoint={apiUrl('opportunities/applied-items')}
                        itemKind={OppItemKind.Applied}
                        aiRecommendation={false}
                    />
                </div>
            </div>
        </CustomerLayout>
    )
}