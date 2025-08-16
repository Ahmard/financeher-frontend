'use client';

import FilterItem from "@/components/Common/Filters/FilterItem";
import React, {useEffect, useState} from "react";
import {xhrGet} from "@/lib/xhr";
import {apiUrl} from "@/lib/helpers/url";

interface SelectedFilters {
    amounts: string[];
    fundingTypes: string[];
    sectors: string[];
    locations: string[];
    statuses: string[];
}

interface SearchTerms {
    amounts: string;
    fundingTypes: string;
    sectors: string;
    locations: string;
    statuses: string;
}

interface FilterStates {
    amount: boolean;
    fundingType: boolean;
    sector: boolean;
    location: boolean;
    status: boolean;
}

export interface FilterOption {
    id: string;
    name: string;
}

export interface FilterData {
    amounts: FilterOption[];
    opportunity_types: FilterOption[];
    industries: FilterOption[];
    countries: FilterOption[];
    statuses: FilterOption[];
    search?: string;
}

export default function RightSideFilters() {

    // Filter data from API
    const [filterData, setFilterData] = useState<FilterData>({
        amounts: [],
        opportunity_types: [],
        industries: [],
        countries: [],
        statuses: []
    });

    const filterDataKey = Object.keys(filterData);

    // Filter dropdown states
    const [filterStates, setFilterStates] = useState<FilterStates>({
        amount: false,
        fundingType: false,
        sector: false,
        location: false,
        status: false
    });

    // Selected filter values
    const [selectedFilters, setSelectedFilters] = useState<SelectedFilters>({
        amounts: [],
        fundingTypes: [],
        sectors: [],
        locations: [],
        statuses: []
    });

    // Search terms for each filter
    const [searchTerms, setSearchTerms] = useState<SearchTerms>({
        amounts: '',
        fundingTypes: '',
        sectors: '',
        locations: '',
        statuses: ''
    });

    // Loading states
    const [isLoading, setIsLoading] = useState<{ [key: string]: boolean }>({
        amounts: false,
        fundingTypes: false,
        sectors: false,
        locations: false,
        statuses: false
    });

    const clearFilters = (filterType: keyof SelectedFilters): void => {
        setSelectedFilters(prev => ({
            ...prev,
            [filterType]: []
        }));
    };

    const updateSearchTerm = (filterType: keyof SearchTerms, value: string): void => {
        setSearchTerms(prev => ({
            ...prev,
            [filterType]: value
        }));
    };

    const toggleFilter = (filterName: keyof FilterStates): void => {
        setFilterStates(prev => ({
            ...prev,
            [filterName]: !prev[filterName]
        }));
    };

    const handleFilterOptionChange = (
        filterType: keyof SelectedFilters,
        optionId: string,
        checked: boolean
    ): void => {
        setSelectedFilters(prev => ({
            ...prev,
            [filterType]: checked
                ? [...prev[filterType], optionId]
                : prev[filterType].filter(id => id !== optionId)
        }));
    };

    const fetchFilterData = async () => {
        filterDataKey.map(filterType => {
            setIsLoading(prev => ({...prev, [filterType]: true}));
        })

        try {
            const {data} = await xhrGet<FilterData>(apiUrl('misc/opportunity-filters'));
            setFilterData(data);
        } catch (error) {
            console.error(`Error fetching:`, error);
        } finally {
            filterDataKey.map(filterType => {
                setIsLoading(prev => ({...prev, [filterType]: false}));
            })
        }
    };

    // Load filter data on component mount
    useEffect(() => {
        fetchFilterData();
    }, []);

    return (
        <div className="space-y-4">
            <FilterItem
                title="By Funding Amount"
                isOpen={filterStates.amount}
                onToggle={() => toggleFilter('amount')}
                options={filterData.amounts}
                selectedOptions={selectedFilters.amounts}
                onOptionChange={(optionId, checked) => handleFilterOptionChange('amounts', optionId, checked)}
                onClear={() => clearFilters('amounts')}
                searchTerm={searchTerms.amounts}
                onSearchChange={(value) => updateSearchTerm('amounts', value)}
                isLoading={isLoading.amounts}
            />

            <FilterItem
                title="By Funding Type"
                isOpen={filterStates.fundingType}
                onToggle={() => toggleFilter('fundingType')}
                options={filterData.opportunity_types}
                selectedOptions={selectedFilters.fundingTypes}
                onOptionChange={(optionId, checked) => handleFilterOptionChange('fundingTypes', optionId, checked)}
                onClear={() => clearFilters('fundingTypes')}
                searchTerm={searchTerms.fundingTypes}
                onSearchChange={(value) => updateSearchTerm('fundingTypes', value)}
                isLoading={isLoading.fundingTypes}
            />

            <FilterItem
                title="By Sector"
                isOpen={filterStates.sector}
                onToggle={() => toggleFilter('sector')}
                options={filterData.industries}
                selectedOptions={selectedFilters.sectors}
                onOptionChange={(optionId, checked) => handleFilterOptionChange('sectors', optionId, checked)}
                onClear={() => clearFilters('sectors')}
                searchTerm={searchTerms.sectors}
                onSearchChange={(value) => updateSearchTerm('sectors', value)}
                isLoading={isLoading.sectors}
            />

            <FilterItem
                title="By Location"
                isOpen={filterStates.location}
                onToggle={() => toggleFilter('location')}
                options={filterData.countries}
                selectedOptions={selectedFilters.locations}
                onOptionChange={(optionId, checked) => handleFilterOptionChange('locations', optionId, checked)}
                onClear={() => clearFilters('locations')}
                searchTerm={searchTerms.locations}
                onSearchChange={(value) => updateSearchTerm('locations', value)}
                isLoading={isLoading.locations}
            />

            <FilterItem
                title="By Status"
                isOpen={filterStates.status}
                onToggle={() => toggleFilter('status')}
                options={filterData.statuses}
                selectedOptions={selectedFilters.statuses}
                onOptionChange={(optionId, checked) => handleFilterOptionChange('statuses', optionId, checked)}
                onClear={() => clearFilters('statuses')}
                searchTerm={searchTerms.statuses}
                onSearchChange={(value) => updateSearchTerm('statuses', value)}
                isLoading={isLoading.statuses}
            />

            {/* Footer */}
            <div className="pt-6 mt-8 border-t border-gray-200">
                <p className="text-xs text-gray-500 text-center">
                    © 2025 · Financeher Limited · All right reserved.
                </p>
                <div className="flex justify-center space-x-4 mt-2">
                    <a href="#" className="text-xs !underline !text-gray-500 hover:text-gray-700">
                        Terms of Service
                    </a>
                    <span className="text-xs text-gray-500">and</span>
                    <a href="#" className="text-xs !underline !text-gray-500 hover:text-gray-700">
                        Privacy Policy
                    </a>
                </div>
            </div>
        </div>
    )
}