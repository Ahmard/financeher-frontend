'use client';

import React, {useState, useEffect} from 'react';
import {BookOpen, ChevronDown, ChevronUp, Database, Heart, Info, MessageSquare, Search, Settings, Sparkles} from 'lucide-react';
import CustomerLayout, {CustomerCurrentPage} from "@/components/App/Layouts/CustomerLayout";
import {useSession} from "next-auth/react";
import type {AuthUserData} from "@/lib/types/auth";
import {greet, greetingIcon} from "@/lib/helpers/time";

// Type definitions
interface FilterOption {
    id: string;
    name: string;
    value: string;
}

interface FilterDropdownProps {
    title: string;
    children: React.ReactNode;
    isOpen: boolean;
    onToggle: () => void;
}

interface CheckboxItemProps {
    label: string;
    checked: boolean;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    count?: number;
}

interface ClearButtonProps {
    onClear: () => void;
}

interface SearchBoxProps {
    placeholder: string;
    value: string;
    onChange: (value: string) => void;
}

interface FilterSectionProps {
    title: string;
    isOpen: boolean;
    onToggle: () => void;
    options: FilterOption[];
    selectedOptions: string[];
    onOptionChange: (optionId: string, checked: boolean) => void;
    onClear: () => void;
    searchTerm: string;
    onSearchChange: (value: string) => void;
    isLoading?: boolean;
}

interface Opportunity {
    id: number;
    title: string;
    logo: string;
    description: string;
    amount: string;
    closingDate: string;
    fundingType: string;
    sector: string;
    location: string;
    status: string;
    recommended: boolean;
}

interface FilterStates {
    amount: boolean;
    fundingType: boolean;
    sector: boolean;
    location: boolean;
    status: boolean;
}

interface FilterData {
    amounts: FilterOption[];
    fundingTypes: FilterOption[];
    sectors: FilterOption[];
    locations: FilterOption[];
    statuses: FilterOption[];
}

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

// Component implementations
const SearchBox: React.FC<SearchBoxProps> = ({ placeholder, value, onChange }) => (
    <div className="relative mb-3">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
        <input
            type="text"
            placeholder={placeholder}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
        />
    </div>
);

const FilterDropdown: React.FC<FilterDropdownProps> = ({ title, children, isOpen, onToggle }) => {
    return (
        <div className="mb-4">
            <button
                onClick={onToggle}
                className="flex items-center justify-between w-full px-4 py-2.5 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-green-500 text-left"
            >
                <span className="text-sm text-gray-600">{title}</span>
                {isOpen ? <ChevronUp className="w-4 h-4 text-gray-400" /> : <ChevronDown className="w-4 h-4 text-gray-400" />}
            </button>

            {isOpen && (
                <div className="mt-2 bg-white border border-gray-200 rounded-lg shadow-sm p-4">
                    {children}
                </div>
            )}
        </div>
    );
};

const CheckboxItem: React.FC<CheckboxItemProps> = ({ label, checked, onChange, count }) => (
    <label className="flex items-center justify-between py-1.5 cursor-pointer hover:bg-gray-50 px-2 rounded">
        <div className="flex items-center">
            <input
                type="checkbox"
                checked={checked}
                onChange={onChange}
                className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
            />
            <span className="ml-2 text-sm text-gray-700">{label}</span>
        </div>
        {count && <span className="text-xs text-gray-500">({count})</span>}
    </label>
);

const ClearButton: React.FC<ClearButtonProps> = ({ onClear }) => (
    <button
        onClick={onClear}
        className="text-blue-500 text-sm hover:text-blue-600 mt-2 underline"
    >
        Clear Filters
    </button>
);

const FilterSection: React.FC<FilterSectionProps> = ({
                                                         title,
                                                         isOpen,
                                                         onToggle,
                                                         options,
                                                         selectedOptions,
                                                         onOptionChange,
                                                         onClear,
                                                         searchTerm,
                                                         onSearchChange,
                                                         isLoading = false
                                                     }) => {
    const filteredOptions = options.filter(option =>
        option.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <FilterDropdown title={title} isOpen={isOpen} onToggle={onToggle}>
            <SearchBox
                placeholder={`Search ${title.toLowerCase()}...`}
                value={searchTerm}
                onChange={onSearchChange}
            />

            {isLoading ? (
                <div className="flex items-center justify-center py-4">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-green-500"></div>
                </div>
            ) : (
                <div className="space-y-1 max-h-60 overflow-y-auto">
                    {filteredOptions.length > 0 ? (
                        filteredOptions.map((option) => (
                            <CheckboxItem
                                key={option.id}
                                label={option.name}
                                checked={selectedOptions.includes(option.id)}
                                onChange={(e) => onOptionChange(option.id, e.target.checked)}
                            />
                        ))
                    ) : (
                        <div className="text-sm text-gray-500 text-center py-2">
                            No options found
                        </div>
                    )}
                </div>
            )}

            <ClearButton onClear={onClear} />
        </FilterDropdown>
    );
};

const Dashboard: React.FC = () => {
    const [aiRecommendation, setAiRecommendation] = useState<boolean>(true);
    const [mainSearchTerm, setMainSearchTerm] = useState<string>('');

    // Filter dropdown states
    const [filterStates, setFilterStates] = useState<FilterStates>({
        amount: false,
        fundingType: false,
        sector: false,
        location: false,
        status: false
    });

    // Filter data from API
    const [filterData, setFilterData] = useState<FilterData>({
        amounts: [],
        fundingTypes: [],
        sectors: [],
        locations: [],
        statuses: []
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
    const [isLoading, setIsLoading] = useState<{[key: string]: boolean}>({
        amounts: false,
        fundingTypes: false,
        sectors: false,
        locations: false,
        statuses: false
    });

    const {data: session} = useSession({required: true});
    const user: AuthUserData = session?.user;

    // Sample opportunities data (this would come from API)
    const opportunities: Opportunity[] = [
        {
            id: 1,
            title: "The Rosa Rise Fund",
            logo: "ROSA",
            description: "Rosa's Rise Fund provides organisational development funding for Black and racially minoritised-led women's and girls' organisations across the UK.",
            amount: "$10,000 - $30,000",
            closingDate: "18/11/2025",
            fundingType: "Grant",
            sector: "Healthcare",
            location: "UK, US + 3",
            status: "Ongoing",
            recommended: true
        },
        {
            id: 2,
            title: "Visa Immerse Catalyst x Lloyds Banks",
            logo: "VISA",
            description: "For young founder (18-30 years) leading a project or startup with a focus on social impact, Grant funding & free support for young impact founders.",
            amount: "$10,000 - $30,000",
            closingDate: "18/11/2025",
            fundingType: "Grant",
            sector: "Healthcare",
            location: "UK, US + 3",
            status: "Ongoing",
            recommended: true
        },
        {
            id: 3,
            title: "The Global Good Fund",
            logo: "GGF",
            description: "This fellowship is designed for social entrepreneurs who are creating social impact within their communities",
            amount: "$10,000 - $30,000",
            closingDate: "18/11/2025",
            fundingType: "Grant",
            sector: "Healthcare",
            location: "UK, US + 3",
            status: "Ongoing",
            recommended: true
        }
    ];

    // API calls to fetch filter data
    const fetchFilterData = async (filterType: keyof FilterData, endpoint: string) => {
        setIsLoading(prev => ({ ...prev, [filterType]: true }));

        try {
            // Replace with your actual API call
            const response = await fetch(`/api/filters/${endpoint}`);
            const data: FilterOption[] = await response.json();

            setFilterData(prev => ({
                ...prev,
                [filterType]: data
            }));
        } catch (error) {
            console.error(`Error fetching ${filterType}:`, error);

            // Fallback data for development
            const fallbackData: {[key: string]: FilterOption[]} = {
                amounts: [
                    { id: '1', name: 'Less than $5,000', value: '0-5000' },
                    { id: '2', name: '$5,000 - $10,000', value: '5000-10000' },
                    { id: '3', name: '$10,000 - $30,000', value: '10000-30000' },
                    { id: '4', name: '$30,000 - $100,000', value: '30000-100000' },
                    { id: '5', name: '$100,000+', value: '100000+' },
                ],
                fundingTypes: [
                    { id: '1', name: 'Grants', value: 'grants' },
                    { id: '2', name: 'Investments', value: 'investments' },
                    { id: '3', name: 'Loans', value: 'loans' },
                    { id: '4', name: 'Mentorship', value: 'mentorship' },
                    { id: '5', name: 'Training', value: 'training' },
                ],
                sectors: [
                    { id: '1', name: 'Healthcare', value: 'healthcare' },
                    { id: '2', name: 'Education', value: 'education' },
                    { id: '3', name: 'Fintech', value: 'fintech' },
                    { id: '4', name: 'Agriculture', value: 'agriculture' },
                    { id: '5', name: 'Renewable Energy', value: 'renewable-energy' },
                    { id: '6', name: 'Financial Services', value: 'financial-services' },
                ],
                locations: [
                    { id: '1', name: 'United Kingdom', value: 'uk' },
                    { id: '2', name: 'United States', value: 'us' },
                    { id: '3', name: 'Nigeria', value: 'nigeria' },
                    { id: '4', name: 'Kenya', value: 'kenya' },
                    { id: '5', name: 'Rwanda', value: 'rwanda' },
                ],
                statuses: [
                    { id: '1', name: 'Ongoing', value: 'ongoing' },
                    { id: '2', name: 'Closed', value: 'closed' },
                    { id: '3', name: 'Upcoming', value: 'upcoming' },
                ]
            };

            setFilterData(prev => ({
                ...prev,
                [filterType]: fallbackData[filterType] || []
            }));
        } finally {
            setIsLoading(prev => ({ ...prev, [filterType]: false }));
        }
    };

    // Load filter data on component mount
    useEffect(() => {
        fetchFilterData('amounts', 'funding-amounts');
        fetchFilterData('fundingTypes', 'funding-types');
        fetchFilterData('sectors', 'sectors');
        fetchFilterData('locations', 'locations');
        fetchFilterData('statuses', 'statuses');
    }, []);

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
                        {/* Search Bar */}
                        <div className="relative mb-8">
                            <Search
                                className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5"/>
                            <input
                                type="text"
                                placeholder="Search for opportunities"
                                value={mainSearchTerm}
                                onChange={(e) => setMainSearchTerm(e.target.value)}
                                className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                            />
                        </div>

                        {/* Opportunities */}
                        <div className="space-y-6">
                            {opportunities.map((opportunity) => (
                                <div key={opportunity.id} className="bg-white rounded-lg border border-gray-200 p-6">
                                    {/* Header */}
                                    <div className="flex items-start justify-between mb-4">
                                        <div className="flex items-center space-x-4">
                                            <div
                                                className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                        <span className="font-bold text-sm text-gray-700">
                          {opportunity.logo}
                        </span>
                                            </div>
                                            <div>
                                                <h3 className="text-lg font-semibold text-gray-900">
                                                    {opportunity.title}
                                                </h3>
                                            </div>
                                        </div>
                                        <div className="flex items-center space-x-2">
                      <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                        {opportunity.status}
                      </span>
                                            {opportunity.recommended && (
                                                <span
                                                    className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1">
                          <Sparkles className="w-3 h-3"/>
                          AI Recommended
                        </span>
                                            )}
                                        </div>
                                    </div>

                                    {/* Description */}
                                    <p className="text-gray-600 mb-6 leading-relaxed">
                                        {opportunity.description}
                                    </p>

                                    {/* Details Grid */}
                                    <div className="grid grid-cols-5 gap-6 text-sm">
                                        <div>
                                            <p className="text-gray-500 font-medium mb-1">Amount</p>
                                            <p className="text-gray-900">{opportunity.amount}</p>
                                        </div>
                                        <div>
                                            <p className="text-gray-500 font-medium mb-1">Closing date</p>
                                            <p className="text-gray-900">{opportunity.closingDate}</p>
                                        </div>
                                        <div>
                                            <p className="text-gray-500 font-medium mb-1">Funding Type</p>
                                            <p className="text-gray-900">{opportunity.fundingType}</p>
                                        </div>
                                        <div>
                                            <p className="text-gray-500 font-medium mb-1">Sector</p>
                                            <p className="text-gray-900">{opportunity.sector}</p>
                                        </div>
                                        <div>
                                            <p className="text-gray-500 font-medium mb-1 flex items-center gap-1">
                                                Location
                                                <Info className="w-3 h-3 text-gray-400"/>
                                            </p>
                                            <p className="text-gray-900">{opportunity.location}</p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Right Sidebar - Filters */}
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

                        {/* Filters */}
                        <div className="space-y-4">
                            <FilterSection
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

                            <FilterSection
                                title="By Funding Type"
                                isOpen={filterStates.fundingType}
                                onToggle={() => toggleFilter('fundingType')}
                                options={filterData.fundingTypes}
                                selectedOptions={selectedFilters.fundingTypes}
                                onOptionChange={(optionId, checked) => handleFilterOptionChange('fundingTypes', optionId, checked)}
                                onClear={() => clearFilters('fundingTypes')}
                                searchTerm={searchTerms.fundingTypes}
                                onSearchChange={(value) => updateSearchTerm('fundingTypes', value)}
                                isLoading={isLoading.fundingTypes}
                            />

                            <FilterSection
                                title="By Sector"
                                isOpen={filterStates.sector}
                                onToggle={() => toggleFilter('sector')}
                                options={filterData.sectors}
                                selectedOptions={selectedFilters.sectors}
                                onOptionChange={(optionId, checked) => handleFilterOptionChange('sectors', optionId, checked)}
                                onClear={() => clearFilters('sectors')}
                                searchTerm={searchTerms.sectors}
                                onSearchChange={(value) => updateSearchTerm('sectors', value)}
                                isLoading={isLoading.sectors}
                            />

                            <FilterSection
                                title="By Location"
                                isOpen={filterStates.location}
                                onToggle={() => toggleFilter('location')}
                                options={filterData.locations}
                                selectedOptions={selectedFilters.locations}
                                onOptionChange={(optionId, checked) => handleFilterOptionChange('locations', optionId, checked)}
                                onClear={() => clearFilters('locations')}
                                searchTerm={searchTerms.locations}
                                onSearchChange={(value) => updateSearchTerm('locations', value)}
                                isLoading={isLoading.locations}
                            />

                            <FilterSection
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
                    </div>
                </div>
            </div>
        </CustomerLayout>
    );
};

export default Dashboard;