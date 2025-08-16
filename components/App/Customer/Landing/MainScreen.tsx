'use client';

import React, {useEffect, useState} from 'react';
import {MessageSquare, Search, Sparkles} from 'lucide-react';
import CustomerLayout, {CustomerCurrentPage} from "@/components/App/Layouts/CustomerLayout";
import {useSession} from "next-auth/react";
import type {AuthUserData} from "@/lib/types/auth";
import {greet, greetingIcon} from "@/lib/helpers/time";
import RightSideFilters, {FilterData} from "@/components/App/Customer/Landing/RightSideFilters";
import {xhrGet} from "@/lib/xhr";
import {apiUrl} from "@/lib/helpers/url";
import {useMessage} from "@/lib/hooks/message";
import {DataTableData} from "@/lib/types/data.table";
import OpportunityItem from "@/components/App/Customer/Landing/OpportunityItem";
import {Opportunity} from "@/lib/models/opportunity";


const MainScreen: React.FC = () => {
    const [aiRecommendation, setAiRecommendation] = useState<boolean>(true);
    const [mainSearchTerm, setMainSearchTerm] = useState<string>('');
    const [opportunities, setOpportunities] = useState<Opportunity[]>([]);

    const [filters, setFilters] = useState<FilterData>({
        amounts: [],
        opportunity_types: [],
        industries: [],
        countries: [],
        statuses: [],
        search: '',
    });

    const {data: session} = useSession({required: true});
    const user: AuthUserData = session?.user;
    const greeting = greet(user?.first_name);

    const {showMessage} = useMessage();

    // Loading states
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const handleSearch = (searchTerm: string) => {
        setMainSearchTerm(searchTerm);
        setFilters({
            ...filters,
            search: searchTerm
        });

        fetchOpportunities()
    };

    const fetchOpportunities = async () => {
        setIsLoading(true);
        try {
            const resp = await xhrGet<DataTableData<Opportunity>>(apiUrl('opportunities'), {
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
            showMessage("Failed to load opportunities", "error")
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchOpportunities();
    }, []);

    return (
        <CustomerLayout currentPage={CustomerCurrentPage.Opportunities}>
            <div className="flex-1 flex flex-col">
                {/* Header */}
                <header className="px-8 py-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                                {greeting}
                                <span className="text-2xl">{greetingIcon()}</span>
                            </h1>
                            <p className="text-gray-600 mt-1">See your matches!</p>
                        </div>
                        <div className="flex items-center space-x-4">
                            <button
                                className="cursor-pointer hover:shadow flex items-center space-x-2 bg-white text-green-800 border !border-green-800 px-4 py-2 rounded-lg hover:bg-green-50 transition-colors">
                                <MessageSquare className="w-4 h-4"/>
                                <span>Ask AI</span>
                            </button>
                        </div>
                    </div>
                </header>

                <div className="flex flex-1">
                    {/* Opportunities List */}
                    <div className="flex-1 p-8">
                        {/* Search Bar */}
                        <div className="relative mb-8">
                            <Search
                                className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5"/>
                            <input
                                type="text"
                                placeholder="Search for opportunities"
                                value={mainSearchTerm}
                                onChange={(e) => handleSearch(e.target.value)}
                                className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                            />
                        </div>

                        {/* Opportunities */}
                        <div className="">
                            {isLoading && (
                                <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                                    <div className="text-center">
                                        <div
                                            className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto mb-4"></div>
                                        <p className="text-gray-600">Loading plan details...</p>
                                    </div>
                                </div>
                            )}

                            {opportunities.map((opportunity) => (
                                <OpportunityItem key={opportunity.id} opp={opportunity}/>
                            ))}
                        </div>
                    </div>

                    {/* Right Sidebar - RightSideFilters */}
                    <div className="w-80 bg-white border-l p-6">
                        {/* AI Recommendation Toggle */}
                        <div className="mb-8">
                            <div className="flex items-center justify-between mb-2">
                                <div className="flex items-center space-x-2">
                                    <Sparkles className="w-5 h-5 text-green-600"/>
                                    <span className="font-semibold text-gray-900">AI Recommendation</span>
                                    <span
                                        className="bg-green-700 text-white px-2 py-0.5 rounded-2xl text-xs font-medium">Beta</span>
                                </div>
                                <button
                                    onClick={() => setAiRecommendation(!aiRecommendation)}
                                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                                        aiRecommendation ? 'bg-green-600' : 'bg-gray-200'
                                    }`}
                                >
                                  <span
                                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                                          aiRecommendation ? 'translate-x-6' : 'translate-x-1'
                                      }`}
                                  />
                                </button>
                            </div>
                            <p className="text-sm text-gray-600">
                                Our AI engine recommends the most suitable funding opportunities for you.
                            </p>
                        </div>

                        {/* RightSideFilters */}
                        <RightSideFilters/>
                    </div>
                </div>
            </div>
        </CustomerLayout>
    );
};

export default MainScreen;