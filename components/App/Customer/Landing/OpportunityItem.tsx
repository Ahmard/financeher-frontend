import {Opportunity} from "@/lib/models/opportunity";
import Image from "next/image";
import {backendUrl} from "@/lib/helpers/url";
import {Info, Sparkles} from "lucide-react";
import React from "react";
import {formatMoney} from "@/lib/helpers/monetery";
import Link from "next/link";

interface IProps {
    opp: Opportunity;
    isSaved?: boolean;
}

export default function OpportunityItem({opp, isSaved}: IProps) {
    const href = isSaved
        ? `/opportunities/${opp['opportunity_id']}?kind=saved`
        : `/opportunities/${opp.id}`;

    return (
        <Link href={href} className="cursor-pointer">
            <div className="bg-white rounded-lg border border-gray-200 p-6 my-2 hover:shadow hover:bg-green-50">
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-4">
                        <div
                            className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                            <div className="font-bold text-sm text-gray-700">
                                <Image src={backendUrl(opp.logo)} alt="Logo" width={100}
                                       height={100}/>
                            </div>
                        </div>
                        <div>
                            <h3 className="text-lg font-semibold text-gray-900">
                                {opp.name}
                            </h3>
                            <div className="text-[#333333]">{opp.overview}</div>
                        </div>
                    </div>
                    <div className="flex items-center space-x-2">
                        <div
                            className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                            {opp.status}
                        </div>
                        {opp.is_ai_recommended && (
                            <div
                                className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1">
                                <Sparkles className="w-3 h-3"/>
                                AI Recommended
                            </div>
                        )}
                    </div>
                </div>

                {/* Description */}
                <p className="text-gray-600 mb-6 leading-relaxed">
                    {opp.description}
                </p>

                {/* Details Grid */}
                <div className="grid grid-cols-5 gap-6 text-sm">
                    <div>
                        <p className="text-gray-500 font-medium mb-1">Amount</p>
                        <p className="text-gray-900">{formatMoney(opp.lower_amount, 0)} - {formatMoney(opp.upper_amount, 0)}</p>
                    </div>
                    <div>
                        <p className="text-gray-500 font-medium mb-1">Closing date</p>
                        <p className="text-gray-900">{opp.closing_at}</p>
                    </div>
                    <div>
                        <p className="text-gray-500 font-medium mb-1">Funding Type</p>
                        <p className="text-gray-900">{opp.opportunity_type_name}</p>
                    </div>
                    <div>
                        <p className="text-gray-500 font-medium mb-1">Sector</p>
                        <p className="text-gray-900">{opp.industry_name}</p>
                    </div>
                    <div>
                        <p className="text-gray-500 font-medium mb-1 flex items-center gap-1">
                            Location
                            <Info className="w-3 h-3 text-gray-400"/>
                        </p>
                        <p className="text-gray-900">{opp.location ?? 'Nigeria'}</p>
                    </div>
                </div>
            </div>
        </Link>
    )
}