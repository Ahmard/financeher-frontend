'use client';

import React, {useState} from 'react';
import {MessageSquare, Sparkles} from 'lucide-react';
import CustomerLayout, {CustomerCurrentPage} from "@/components/App/Layouts/CustomerLayout";
import {useSession} from "next-auth/react";
import type {AuthUserData} from "@/lib/types/auth";
import {greet, greetingIcon} from "@/lib/helpers/time";
import RightSideFilters, {FilterData} from "@/components/App/Customer/Landing/RightSideFilters";
import OpportunityListTable from "@/components/App/Customer/OpportunityListTable";
import {apiUrl} from "@/lib/helpers/url";

const MainScreen: React.FC<IProps> = () => {
    const [aiRecommendation, setAiRecommendation] = useState<boolean>(true);

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
                        <OpportunityListTable
                            isSavedList={false}
                            endpoint={apiUrl('opportunities')}
                            aiRecommendation={aiRecommendation}
                            onFilterChange={setFilters}
                        />
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