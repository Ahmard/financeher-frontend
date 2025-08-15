'use client';

import React, {useEffect, useState} from 'react';
import {xhrGet, xhrPost} from "@/lib/xhr";
import {apiUrl} from "@/lib/helpers/url";
import {useMessage} from "@/lib/hooks/message";
import {useSession} from "next-auth/react";

interface Plan {
    id: string;
    name: string;
    price: number;
    billing_cycle: string;
    features: string[];
}

interface ICheckoutSession {
    checkout_url: string;
    session_id: string;
}

export default function PaymentPage() {
    const {data: session} = useSession();
    const [plan, setPlan] = useState<Plan | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [countdown, setCountdown] = useState(5);
    const {showMessage} = useMessage();

    useEffect(() => {
        fetchPlanDetailsAndRedirect();
    }, []);

    useEffect(() => {
        if (plan && countdown > 0) {
            const timer = setTimeout(() => {
                setCountdown(countdown - 1);
            }, 1000);
            return () => clearTimeout(timer);
        } else if (plan && countdown === 0) {
            redirectToStripe();
        }
    }, [plan, countdown]);

    const fetchPlanDetailsAndRedirect = async () => {
        try {
            const response = await xhrGet<Plan>(apiUrl('misc/active-plan'));
            const planData = response.data;

            // Parse features if they come as string
            if (typeof planData.features === 'string') {
                planData.features = JSON.parse(planData.features);
            }

            setPlan(planData);
            setIsLoading(false);
        } catch (error) {
            console.error('Error fetching plan:', error);
            showMessage("Failed to load plan details", 'error');
            setIsLoading(false);
        }
    };

    const redirectToStripe = async () => {
        if (!plan) return;

        try {
            const {data: checkoutData} = await xhrPost<ICheckoutSession>(apiUrl('payments/create-checkout-session'), {
                plan_id: plan.id,
                customer_email: session?.user.email || '',
                success_url: `${window.location.origin}/account-setup/plan-payment/callback?success=true`,
                cancel_url: `${window.location.origin}/account-setup/plan-payment/callback?canceled=true`,
            });

            window.location.href = checkoutData.checkout_url;
        } catch (error: any) {
            console.error('Checkout error:', error);
            showMessage(error.message || 'Failed to create checkout session', 'error');
        }
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading plan details...</p>
                </div>
            </div>
        );
    }

    if (!plan) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <p className="text-gray-600 mb-4">Plan not found</p>
                    <button
                        onClick={fetchPlanDetailsAndRedirect}
                        className="bg-emerald-600 hover:bg-emerald-700 text-white font-medium py-2 px-4 rounded-lg"
                    >
                        Retry
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
            <div className="text-center">
                <div className="mb-8">
                    <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-emerald-600 mx-auto mb-6"></div>
                    <h2 className="text-2xl font-semibold text-gray-900 mb-2">Redirecting to Payment</h2>
                    <p className="text-gray-600 mb-4">You will be redirected to Stripe Checkout in {countdown} seconds</p>
                    <div className="text-sm text-gray-500">
                        <p>Plan: {plan.name}</p>
                        <p>Billing: {plan.billing_cycle}</p>
                    </div>
                </div>
                <button
                    onClick={redirectToStripe}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white font-medium py-2 px-6 rounded-lg transition-colors"
                >
                    Continue Now
                </button>
            </div>
        </div>
    );
}