'use client';

import AuthLayout from "@/components/App/Layouts/AuthLayout";
import {usePageTitle} from "@/lib/helpers/page.helper";
import {useEffect, useState} from "react";
import {useMessage} from "@/lib/hooks/message";
import {apiUrl} from "@/lib/helpers/url";
import {xhrGet, xhrPost} from "@/lib/xhr";
import {redirect} from "next/navigation";

interface IItem {
    id: string;
    name: string;
}

interface IItemResponse {
    opportunity_types: IItem[];
    business_stages: IItem[];
    business_types: IItem[];
}

export default function AccountSetupFinalisePage() {
    usePageTitle('Account Setup - Finalise');

    const [isLoading, setIsLoading] = useState(true);
    const [selectedIndustries, setSelectedIndustries] = useState<string[]>([]);
    const [selectedGrowthStage, setSelectedGrowthStage] = useState<string | null>(null);
    const [selectedOpportunityTypes, setSelectedOpportunityTypes] = useState<string[]>([]);
    const {showMessage} = useMessage();

    const [industries, setIndustries] = useState<IItem[]>([]);
    const [growthStages, setGrowthStages] = useState<IItem[]>([]);
    const [opportunityTypes, setOpportunityTypes] = useState<IItem[]>([]);

    // Handle industry selection (multiple)
    const handleIndustryToggle = (industryId: string) => {
        setSelectedIndustries(prev =>
            prev.includes(industryId)
                ? prev.filter(item => item !== industryId)
                : [...prev, industryId]
        );
    };

    // Handle growth stage selection (multiple)
    const handleGrowthStageToggle = (stageId: string) => {
        setSelectedGrowthStage(prev => (prev === stageId ? null : stageId));
    };


    // Handle opportunity selection (multiple)
    const handleOpportunityToggle = (opportunityId: string) => {
        setSelectedOpportunityTypes(prev =>
            prev.includes(opportunityId)
                ? prev.filter(item => item !== opportunityId)
                : [...prev, opportunityId]
        );
    };

    // biome-ignore lint/correctness/useExhaustiveDependencies: true
    useEffect(() => {
        fetchItems();
    }, []);

    const fetchItems = async () => {
        try {
            setIsLoading(true);
            const response = await xhrGet<IItemResponse>(apiUrl('misc/account-setup-finalise-data'));

            setIndustries(response.data.business_types);
            setGrowthStages(response.data.business_stages);
            setOpportunityTypes(response.data.opportunity_types);

        } catch (error) {
            showMessage("Failed to load setup data", "error");
            console.error('Error fetching setup data:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSubmit = async () => {
        try {
            setIsLoading(true);
            await xhrPost(apiUrl('account-setup/finalise'), {
                industry_ids: selectedIndustries,
                business_stage_id: selectedGrowthStage,
                opportunity_type_ids: selectedOpportunityTypes
            });
            showMessage("Account setup completed successfully", "success");

            setTimeout(() => window.location.href = '/', 1000)
        } catch (error) {
            showMessage("Failed to complete account setup", "error");
            console.error('Error completing account setup:', error);
        }
    }

    if (isLoading) {
        return (
            <AuthLayout>
                <div className="flex-1 bg-white flex items-center justify-center p-8">
                    <div className="w-full max-w-md">
                        <div className="text-right mb-8">
                            <button type="button" className="text-sm text-gray-500 hover:text-gray-700">
                                Logout
                            </button>
                        </div>
                        <div className="flex items-center justify-center h-64">
                            <div className="text-center">
                                <div
                                    className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-700 mx-auto mb-4"></div>
                                <p className="text-gray-600">Loading...</p>
                            </div>
                        </div>
                    </div>
                </div>
            </AuthLayout>
        );
    }

    return (
        <AuthLayout>
            <div className="flex-1 bg-white flex items-center justify-center p-8">
                <div className="w-full max-w-md">
                    {/* Header */}
                    <div className="text-right mb-8">
                        <button type="button" className="text-sm text-gray-500 hover:text-gray-700">
                            Logout
                        </button>
                    </div>

                    {/* Form Content */}
                    <div className="space-y-8">
                        {/* Title */}
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900 mb-2">
                                Let's set up your account
                            </h1>
                            <p className="text-gray-600 text-sm leading-relaxed">
                                Answer a few questions about your business and we'll match you with the most suitable
                                funding opportunities.
                            </p>
                        </div>

                        {/* Industry Section */}
                        <div className="space-y-3">
                            <div>
                                <h2 className="text-sm font-medium text-gray-900 mb-1">Industry</h2>
                                <p className="text-sm text-gray-600">What industry is your business in?</p>
                            </div>

                            <div className="flex flex-wrap gap-2">
                                {industries.map((industry) => (
                                    <button
                                        key={industry.id}
                                        type="button"
                                        onClick={() => handleIndustryToggle(industry.id)}
                                        className={`px-3 py-2 text-sm rounded-full border transition-colors ${
                                            selectedIndustries.includes(industry.id)
                                                ? 'bg-green-700 text-white border-green-700'
                                                : 'bg-white text-gray-700 border-gray-300 hover:border-gray-400'
                                        }`}
                                    >
                                        {industry.name}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Stage of Growth Section */}
                        <div className="space-y-3">
                            <div>
                                <h2 className="text-sm font-medium text-gray-900 mb-1">Stage of Growth</h2>
                                <p className="text-sm text-gray-600">What is the current growth stage of your
                                    business?</p>
                            </div>

                            <div className="flex flex-wrap gap-2">
                                {growthStages.map((stage) => (
                                    <button
                                        key={stage.id}
                                        type="button"
                                        onClick={() => handleGrowthStageToggle(stage.id)}
                                        className={`px-3 py-2 text-sm rounded-full border transition-colors ${
                                            selectedGrowthStage === stage.id
                                                ? 'bg-green-700 text-white border-green-700'
                                                : 'bg-white text-gray-700 border-gray-300 hover:border-gray-400'
                                        }`}
                                    >
                                        {stage.name}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Preferred Opportunity Type Section */}
                        <div className="space-y-3">
                            <div>
                                <h2 className="text-sm font-medium text-gray-900 mb-1">Preferred Opportunity Type</h2>
                                <p className="text-sm text-gray-600">What type of opportunity are you looking for?</p>
                            </div>

                            <div className="flex flex-wrap gap-2">
                                {opportunityTypes.map((opportunity) => (
                                    <button
                                        key={opportunity.id}
                                        type="button"
                                        onClick={() => handleOpportunityToggle(opportunity.id)}
                                        className={`px-3 py-2 text-sm rounded-full border transition-colors ${
                                            selectedOpportunityTypes.includes(opportunity.id)
                                                ? 'bg-green-700 text-white border-green-700'
                                                : 'bg-white text-gray-700 border-gray-300 hover:border-gray-400'
                                        }`}
                                    >
                                        {opportunity.name}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex gap-3 pt-4">
                            <button
                                type="button"
                                onClick={handleSubmit}
                                className="cursor-pointer flex-1 bg-green-700 hover:bg-green-800 text-white font-medium py-3 px-6 rounded-lg transition-colors"
                            >
                                Continue
                            </button>
                            <button
                                type="button"
                                className="px-6 py-3 text-gray-600 hover:text-gray-800 font-medium transition-colors"
                            >
                                Skip
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </AuthLayout>
    );
}