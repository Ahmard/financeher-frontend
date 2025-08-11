'use client';

import AuthLayout from "@/components/App/Layouts/AuthLayout";
import {usePageTitle} from "@/lib/helpers/page.helper";
import {useEffect, useState} from "react";
import {useMessage} from "@/lib/hooks/message";
import {apiUrl} from "@/lib/helpers/url";
import {xhrGet} from "@/lib/xhr";
import type {Plan} from "@/lib/models/plan";

export default function AccountSetupFinalisePage() {
  usePageTitle('Account Setup - Finalise');

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
                <button type="button"
                        className="bg-green-700 hover:bg-green-800 text-white font-semibold py-2 px-4 rounded-lg transition-colors">
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

          </div>
        </div>
      </div>
    </AuthLayout>
  );
}