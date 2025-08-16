'use client';

import OpportunityItem from "@/components/App/Customer/Landing/OpportunityItem";
import React, {useEffect, useState} from "react";
import {Opportunity} from "@/lib/models/opportunity";
import {xhrGet} from "@/lib/xhr";
import {DataTableData} from "@/lib/types/data.table";
import {useMessage} from "@/lib/hooks/message";
import {Search} from "lucide-react";
import {FilterData} from "@/components/App/Customer/Landing/RightSideFilters";

export interface IProps {
    endpoint: string;
    searchPlaceholder: string;
    loadingMessage?: string;
    onFilterChange?: (filters: FilterData) => void;
    aiRecommendation: boolean;
    isSavedList: boolean;
}

export default function OpportunityListTable(props: IProps) {
    const {
        endpoint,
        isSavedList,
        onFilterChange,
        aiRecommendation,
        searchPlaceholder = 'Search for opportunities',
        loadingMessage = 'Loading opportunities...',
    } = props;
    const [opportunities, setOpportunities] = useState<Opportunity[]>([]);

    const [mainSearchTerm, setMainSearchTerm] = useState<string>('');
    const {showMessage} = useMessage();

    const [isLoading, setIsLoading] = useState<boolean>(false);

    const [filters, setFilters] = useState<FilterData>({
        amounts: [],
        opportunity_types: [],
        industries: [],
        countries: [],
        statuses: [],
        search: '',
    });

    const handleSearch = (searchTerm: string) => {
        setMainSearchTerm(searchTerm);
        setFilters({
            ...filters,
            search: searchTerm
        });

        onFilterChange?.(filters)

        fetchOpportunities()
    };

    const fetchOpportunities = async () => {
        setIsLoading(true);
        try {
            const resp = await xhrGet<DataTableData<Opportunity>>(endpoint, {
                'filter[search]': filters.search,
                'filter[amount]': filters.amounts.join(','),
                'filter[funding_type]': filters.opportunity_types.join(','),
                'filter[sector]': filters.industries.join(','),
                'filter[location]': filters.countries.join(','),
                'filter[status]': filters.statuses.join(','),
                'filter[recommended]': aiRecommendation ? 'true' : 'false'
            });
            setOpportunities(resp.data.data);
        } catch (e) {
            console.error(e)
            showMessage("Failed to load opportunities", "error")
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchOpportunities();
    }, []);
    return (
        <div className="flex-1">
            {/* Search Bar */}
            <div className="relative mb-8">
                <Search
                    className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5"/>
                <input
                    type="text"
                    placeholder={searchPlaceholder}
                    value={mainSearchTerm}
                    onChange={(e) => handleSearch(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
            </div>

            {/* Opportunities */}
            <div className="">
                {isLoading && (
                    <div className="min-h-screen bg-gray-50 flex items-center justify-center -mt-50">
                        <div className="text-center">
                            <div
                                className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto mb-4"></div>
                            <p className="text-gray-600">{loadingMessage}</p>
                        </div>
                    </div>
                )}

                {opportunities.map((opportunity) => (
                    <OpportunityItem
                        isSaved={isSavedList}
                        key={opportunity.id}
                        opp={opportunity}
                    />
                ))}
            </div>
        </div>
    )
}