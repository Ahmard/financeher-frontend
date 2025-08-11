'use client';

import AuthLayout from "@/components/App/Layouts/AuthLayout";
import {usePageTitle} from "@/lib/helpers/page.helper";
import { Check } from "lucide-react";
import {useState, useEffect} from "react";
import {useMessage} from "@/lib/hooks/message";
import {apiUrl} from "@/lib/helpers/url";
import {xhrGet} from "@/lib/xhr";
import {formatMoney} from "@/lib/helpers/monetery";
import {cmk, ucFirst} from "@/lib/helpers/str";
import Link from "next/link";

interface Plan {
  id: string;
  name: string;
  price: number;
  billing_cycle: string;
  features: string[];
  created_at?: string;
  updated_at?: string;
  is_active?: boolean;
}

export default function AccountSetupPage() {
  usePageTitle('Account Setup');

  const [plan, setPlan] = useState<Plan | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const {showMessage} = useMessage();

  // biome-ignore lint/correctness/useExhaustiveDependencies: true
  useEffect(() => {
    fetchPlanDetails();
  }, []);

  const fetchPlanDetails = async () => {
    try {
      setIsLoading(true);
      const response = await xhrGet<Plan>(apiUrl('misc/active-plan'));
      const plan = response.data;
      plan.features = JSON.parse(plan.features as any as string);
      setPlan(response.data);
    } catch (error) {
      showMessage("Failed to load plan details", "error");
      console.error('Error fetching plan:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <AuthLayout>
        <div className="flex-1 bg-white flex items-center justify-center p-8">
          <div className="w-full max-w-md">
            <div className="text-right mb-8">
              <button type="button" className="text-sm text-gray-500 hover:text-gray-700">
                Log in
              </button>
            </div>
            <div className="flex items-center justify-center h-64">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-700 mx-auto mb-4"></div>
                <p className="text-gray-600">Loading plan details...</p>
              </div>
            </div>
          </div>
        </div>
      </AuthLayout>
    );
  }

  if (!plan) {
    return (
      <AuthLayout>
        <div className="flex-1 bg-white flex items-center justify-center p-8">
          <div className="w-full max-w-md">
            <div className="text-right mb-8">
            </div>
            <div className="flex items-center justify-center h-64">
              <div className="text-center">
                <p className="text-gray-600 mb-4">Plan not found</p>
                <button type="button" className="bg-green-700 hover:bg-green-800 text-white font-semibold py-2 px-4 rounded-lg transition-colors">
                  Try Again
                </button>
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
          </div>

          {/* Plan Selection */}
          <div className="space-y-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">Choose a Plan</h1>
              <p className="text-gray-600">Choose a plan to get started</p>
            </div>

            {/* Plan Card */}
            <div className="border border-gray-200 rounded-lg p-6 bg-white">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900">{plan.name}</h2>
                <div className="text-right">
                  <span className="text-3xl font-bold text-gray-900">{formatMoney(plan.price)}</span>
                  <span className="text-gray-600 ml-1">{ucFirst(plan.billing_cycle)}</span>
                </div>
              </div>

              {/* Features */}
              <div className="space-y-4 mb-8">
                <h3 className="font-semibold text-gray-900 text-sm uppercase tracking-wide">FEATURES</h3>

                <div className="space-y-3">
                  {plan.features.map((feature) => (
                    <div key={cmk('feature')} className="flex items-start gap-3">
                      <Check className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-700">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Pay Now Button */}
              <Link href="/account-setup/plan-payment">
                <button type="button" className="cursor-pointer w-full bg-green-700 hover:bg-green-800 text-white font-semibold py-3 px-6 rounded-lg transition-colors">
                  Pay Now
                </button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </AuthLayout>
  );
}