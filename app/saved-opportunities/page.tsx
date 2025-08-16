'use client';

import CustomerLayout, {CustomerCurrentPage} from "@/components/App/Layouts/CustomerLayout";
import PageHeader from "@/components/Common/PageHeader";
import type React from "react";
import OpportunityListTable from "@/components/App/Customer/OpportunityListTable";
import {apiUrl} from "@/lib/helpers/url";

export default function OpportunitiesPage() {
    return (
        <CustomerLayout currentPage={CustomerCurrentPage.SavedOpportunities}>
            <div className="p-6 bg-gray-50 min-h-screen">
                <div className="max-w-7xl mx-auto">
                    {/* Header */}
                    <div className="flex justify-between items-center mb-6">
                        <PageHeader name="Saved Opportunities"/>
                    </div>

                    <OpportunityListTable
                        isSavedList={true}
                        searchPlaceholder="Search saved opportunities"
                        loadingMessage="Loading saved opportunities..."
                        endpoint={apiUrl('opportunities/saved-items')}
                        aiRecommendation={false}
                    />
                </div>
            </div>
        </CustomerLayout>
    )
}