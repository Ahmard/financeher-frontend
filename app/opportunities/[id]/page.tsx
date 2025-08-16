'use client';

import {useParams} from "next/navigation";
import {ArrowLeft, Bookmark, Info} from "lucide-react";
import {Button} from "@/components/ui/button";
import {Card, CardContent} from "@/components/ui/card";
import {useEffect, useState} from "react";
import {Skeleton} from "antd";
import {xhrGet} from "@/lib/xhr";
import {apiUrl, backendUrl} from "@/lib/helpers/url";
import {Opportunity} from "@/lib/models/opportunity";
import {formatMoney} from "@/lib/helpers/monetery";
import CustomerLayout, {CustomerCurrentPage} from "@/components/App/Layouts/CustomerLayout";

export default function OpportunityInfoPage() {
    const params = useParams<{ id: string }>();
    const id = params.id;
    const [opportunity, setOpportunity] = useState<Opportunity | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchData = async () => {
        try {
            setLoading(true);
            setError(null);
            const {data: opportunity} = await xhrGet<Opportunity>(apiUrl(`opportunities/${id}`));
            setOpportunity(opportunity);
        } catch (err) {
            setError('Failed to load opportunity details');
            console.error('Error fetching opportunity:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (id) {
            fetchData();
        }
    }, [id]);

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-GB', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        });
    };

    if (error) {
        return (
            <CustomerLayout currentPage={CustomerCurrentPage.Opportunities}>
                <div className="p-6 max-w-7xl mx-auto">
                    <div className="text-center py-12">
                        <p className="text-red-600 mb-4">{error}</p>
                        <Button onClick={fetchData}>Try Again</Button>
                    </div>
                </div>
            </CustomerLayout>
        );
    }

    return (
        <CustomerLayout currentPage={CustomerCurrentPage.Opportunities}>
            <div className="p-6 max-w-7xl mx-auto">
                {/* Header */}
                <div className="flex items-center gap-2 mb-6">
                    <Button variant="ghost" size="sm" className="p-1 hover:bg-gray-100">
                        <ArrowLeft className="h-4 w-4"/>
                    </Button>
                    <span className="text-sm text-gray-600">Back to Opportunities</span>
                </div>

                {/* Main Content */}
                <div className="">
                    <div className="flex items-start gap-4 mb-6">
                        {loading ? (
                            <>
                                <Skeleton.Avatar size={58}/>
                                <div className="flex-1">
                                    <Skeleton active paragraph={{rows: 2, width: ['60%', '40%']}}
                                              title={{width: '80%'}}/>
                                </div>
                                <div className="flex gap-2">
                                    <Skeleton.Button active size="default"/>
                                    <Skeleton.Button active size="default" shape="square"/>
                                </div>
                            </>
                        ) : (
                            <>
                                <div
                                    className="w-20 h-20 bg-white border border-gray-200 rounded-4xl flex items-center justify-center flex-shrink-0">
                                    {opportunity?.logo
                                        ? (<img src={backendUrl(opportunity.logo)} alt="Logo"
                                                className="w-16 h-16 rounded"/>)
                                        : (<span className="text-red-600 font-bold text-sm">Financeher</span>)
                                    }
                                </div>
                                <div className="flex-1">
                                    <h1 className="text-4xl font-bold text-[#333333] mb-1">{opportunity?.name}</h1>
                                    <p className="text-[#333333] text-md underline cursor-pointer">{opportunity?.organisation}</p>
                                </div>
                                <div className="flex gap-2">
                                    <Button
                                        className="bg-[#006A4B] hover:bg-green-700 text-white py-5 px-8 rounded-3xl cursor-pointer"
                                        onClick={() => opportunity?.application_url && window.open(opportunity.application_url, '_blank')}
                                    >
                                        Apply
                                    </Button>
                                    <Button variant="outline"
                                            className="py-5 px-5 rounded-3xl border border-[#006A4B] cursor-pointer hover:shadow-2xl"
                                            size="icon">
                                        <Bookmark className="h-4 w-4 text-[#006A4B]"/>
                                    </Button>
                                </div>
                            </>
                        )}
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Left Column - Main Content */}
                    <div className="lg:col-span-2">
                        <Card className="border border-gray-200 shadow-sm">
                            <CardContent className="p-6">
                                {/* Header Section */}


                                {/* Overview Section */}
                                <div className="space-y-4">
                                    <h2 className="text-lg font-semibold text-gray-900">Overview</h2>
                                    {loading ? (
                                        <Skeleton active paragraph={{rows: 6}} title={false}/>
                                    ) : (
                                        <div className="text-sm text-gray-700 leading-relaxed">
                                            <p className="mb-4">
                                                Rosa Rise Fund is a venture capital firm and community that invests in
                                                mission-driven innovators building African solutions to global problems,
                                                provides early-stage funding, strategic support, and access to a
                                                powerful network of operators, investors, and experts. The firm focuses
                                                on transformative sectors such as health, fintech, education, and
                                                agriculture, aiming to unlock the potential of the continent's brightest
                                                entrepreneurs. Through its unique fellowship model and syndicate
                                                investment approach, Future Africa empowers both founders and investors
                                                to collaboratively drive scalable impact across Africa.The Africa Deep
                                                Tech Challenge is a competition to create breakthrough tech solutions
                                                using resource-constrained computing principles (limited power, low
                                                compute, offline functionality). It is aimed at emerging innovators in
                                                Africa to solve real-world challenges through innovative prototypes and
                                                documentation.
                                            </p>
                                        </div>
                                    )}
                                </div>

                                {/* Eligibility Criteria Section */}
                                <div className="space-y-4 mt-8">
                                    <h2 className="text-lg font-semibold text-gray-900">Eligibility Criteria</h2>
                                    {loading ? (
                                        <Skeleton active paragraph={{rows: 4}} title={false}/>
                                    ) : (
                                        <div className="text-sm text-gray-700 leading-relaxed">
                                            <p>
                                                Open to individuals or teams up to 4 members, aged 18 or older, residing
                                                in any of the listed African countries (Algeria, Angola, Benin,
                                                Botswana, Burkina Faso, Burundi, Cameroon, Cape Verde, Central African
                                                Republic, Chad, Comoros, Congo, DRC, Cote d'Ivoire, Djibouti, Egypt,
                                                Equatorial Guinea, Eritrea, Ethiopia, Gabon, Gambia, Ghana, Guinea,
                                                Guinea-Bissau, Kenya, Lesotho, Liberia, Libya, Madagascar, Malawi, Mali,
                                                Mauritania, Mauritius, Morocco, Mozambique, Namibia, Niger, Nigeria,
                                                Rwanda, Sao Tome and Principe, Senegal, Seychelles, Sierra Leone,
                                                Somalia, South Africa, Eswatini, Tanzania, Togo, Tunisia, Uganda,
                                                Zambia, Zimbabwe). No prior startup or funding required. Original work
                                                required.
                                            </p>
                                        </div>
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Right Column - Details */}
                    <div>
                        <Card className="border border-gray-200 shadow-sm">
                            <CardContent className="p-4">
                                {loading ? (
                                    <div className="space-y-4">
                                        <div>
                                            <Skeleton active paragraph={{rows: 1, width: '60%'}}
                                                      title={{width: '40%'}}/>
                                        </div>
                                        <div>
                                            <Skeleton active paragraph={{rows: 1, width: '50%'}}
                                                      title={{width: '35%'}}/>
                                        </div>
                                        <div>
                                            <Skeleton active paragraph={{rows: 1, width: '50%'}}
                                                      title={{width: '40%'}}/>
                                        </div>
                                        <div>
                                            <Skeleton active paragraph={{rows: 1, width: '60%'}}
                                                      title={{width: '30%'}}/>
                                        </div>
                                        <div>
                                            <div className="flex items-start gap-2 mb-2">
                                                <Skeleton.Button active size="small" shape="round"/>
                                                <Skeleton.Avatar size={16} shape="square"/>
                                            </div>
                                            <Skeleton active paragraph={{rows: 4}} title={false}/>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="space-y-6">
                                        <div className="flex justify-between">
                                            <div>
                                                <p className="text-xs text-gray-500 mb-1">Funding Amount</p>
                                                <p className="text-sm">
                                                    {opportunity?.lower_amount ?
                                                        `${formatMoney(opportunity.lower_amount)} - ${formatMoney(opportunity.upper_amount)}` :
                                                        '$10,000 - $30,000'
                                                    }
                                                </p>
                                            </div>
                                            <div>
                                                <p className="text-xs text-gray-500 mb-1">Funding Type</p>
                                                <p className="text-sm">{opportunity?.opportunity_type_name || 'Grant'}</p>
                                            </div>
                                        </div>
                                        <div className="flex justify-between">
                                            <div>
                                                <p className="text-xs text-gray-500 mb-1">Closing date</p>
                                                <p className="text-sm">
                                                    {opportunity?.closing_at ? formatDate(opportunity.closing_at) : '18/11/2025'}
                                                </p>
                                            </div>
                                            <div>
                                                <p className="text-xs text-gray-500 mb-1">Sector</p>
                                                <p className="text-sm">{opportunity?.industry_name || 'Healthcare'}</p>
                                            </div>
                                        </div>
                                        <div>
                                            <div className="flex items-start gap-2 mb-2">
                                                <p className="text-xs text-gray-500">Region</p>
                                                <Info className="h-3 w-3 text-gray-400"/>
                                            </div>
                                            <div className="text-xs text-gray-700 leading-relaxed">
                                                {opportunity?.regions?.length ?
                                                    opportunity.regions.join(', ') :
                                                    'Algeria, Angola, Benin, Botswana, Burkina Faso, Burundi, Cameroon, Cape Verde, Central African Republic, Chad, Comoros, Congo, DRC, Cote d\'Ivoire, Djibouti, Egypt, Equatorial Guinea, Eritrea, Ethiopia, Gabon, Gambia, Ghana, Guinea, Guinea-Bissau, Kenya, Lesotho, Liberia, Libya, Madagascar, Malawi, Mali, Mauritania, Mauritius, Morocco, Mozambique, Namibia, Niger, Nigeria, Rwanda, Sao Tome and Principe, Senegal, Seychelles, Sierra Leone, Somalia, South Africa, Eswatini, Tanzania, Togo, Tunisia, Uganda, Zambia, Zimbabwe'
                                                }
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </CustomerLayout>
    );
}