'use client';

import React, {useEffect, useState} from 'react';
import {useRouter, useSearchParams} from 'next/navigation';
import {AlertCircle, ArrowRight, CheckCircle, CreditCard, Home, XCircle} from 'lucide-react';
import {xhrPost} from "@/lib/xhr";
import {apiUrl} from "@/lib/helpers/url";
import {useMessage} from "@/lib/hooks/message";
import {formatMoney} from "@/lib/helpers/monetery";

interface PaymentVerificationResult {
    payment_status: string;
    customer_email: string;
    amount_total: number;
}

export default function PaymentCallbackPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const {showMessage} = useMessage();

    const [isLoading, setIsLoading] = useState(true);
    const [verificationResult, setVerificationResult] = useState<PaymentVerificationResult | null>(null);
    const [error, setError] = useState<string | null>(null);

    // Get URL parameters
    const success = searchParams.get('success');
    const canceled = searchParams.get('canceled');
    const sessionId = searchParams.get('session_id');

    const isSuccess = success === 'true';
    const isCanceled = canceled === 'true';

    useEffect(() => {
        if (isSuccess && sessionId) {
            verifyPayment();
        } else if (isCanceled) {
            setIsLoading(false);
        } else {
            // Invalid callback parameters
            setError('Invalid payment callback parameters');
            setIsLoading(false);
        }
    }, [isSuccess, isCanceled, sessionId]);

    const verifyPayment = async () => {
        try {
            setIsLoading(true);
            setError(null);

            const response = await xhrPost<PaymentVerificationResult>(
                apiUrl('payments/verify-checkout-session'),
                {session_id: sessionId}
            );

            if (response.success) {
                setVerificationResult(response.data);
                showMessage('Payment verified successfully!', 'success');
            } else {
                setError(response.message || 'Payment verification failed');
                showMessage(response.message || 'Payment verification failed', 'error');
            }
        } catch (error: any) {
            console.error('Payment verification error:', error);
            const errorMessage = error.message || 'Failed to verify payment';
            setError(errorMessage);
            showMessage(errorMessage, 'error');
        } finally {
            setIsLoading(false);
        }
    };

    const handleContinue = () => {
        if (isSuccess && verificationResult) {
            router.push('/account-setup/finalise');
        } else {
            router.push('/account-setup/plan-payment');
        }
    };

    const handleGoHome = () => {
        router.push('/dashboard');
    };

    // Loading state
    if (isLoading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div
                        className="animate-spin rounded-full h-16 w-16 border-b-2 border-emerald-600 mx-auto mb-6"></div>
                    <h2 className="text-2xl font-semibold text-gray-900 mb-2">Verifying Payment</h2>
                    <p className="text-gray-600">Please wait while we confirm your payment...</p>
                </div>
            </div>
        );
    }

    // Success state
    if (isSuccess && verificationResult && !error) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
                <div className="max-w-md w-full">
                    <div className="bg-white rounded-lg shadow-lg p-8 text-center">
                        {/* Success Icon */}
                        <div
                            className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 mb-6">
                            <CheckCircle className="h-8 w-8 text-green-600"/>
                        </div>

                        {/* Success Message */}
                        <h1 className="text-2xl font-bold text-gray-900 mb-2">Payment Successful!</h1>
                        <p className="text-gray-600 mb-6">
                            Thank you for subscribing to FinanceHer. Your payment has been processed successfully.
                        </p>

                        {/* Payment Details */}
                        <div className="bg-gray-50 rounded-lg p-4 mb-6">
                            <div className="space-y-2 text-sm">
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Amount Paid:</span>
                                    <span className="font-medium">{formatMoney(verificationResult.amount_total)}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Email:</span>
                                    <span className="font-medium">{verificationResult.customer_email}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Status:</span>
                                    <span className="font-medium text-green-600 capitalize">
                    {verificationResult.payment_status}
                  </span>
                                </div>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="space-y-3">
                            <button
                                onClick={handleContinue}
                                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-medium py-3 px-4 rounded-lg transition-colors flex items-center justify-center group"
                            >
                                Continue Setup
                                <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform"/>
                            </button>

                            <button
                                onClick={handleGoHome}
                                className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-3 px-4 rounded-lg transition-colors flex items-center justify-center"
                            >
                                <Home className="w-4 h-4 mr-2"/>
                                Go to Dashboard
                            </button>
                        </div>

                        {/* Session ID for debugging */}
                        {sessionId && (
                            <p className="text-xs text-gray-400 mt-4">
                                Session ID: {sessionId}
                            </p>
                        )}
                    </div>
                </div>
            </div>
        );
    }

    // Canceled state
    if (isCanceled) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
                <div className="max-w-md w-full">
                    <div className="bg-white rounded-lg shadow-lg p-8 text-center">
                        {/* Canceled Icon */}
                        <div
                            className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-yellow-100 mb-6">
                            <AlertCircle className="h-8 w-8 text-yellow-600"/>
                        </div>

                        {/* Canceled Message */}
                        <h1 className="text-2xl font-bold text-gray-900 mb-2">Payment Canceled</h1>
                        <p className="text-gray-600 mb-6">
                            You canceled the payment process. Don't worry, no charges were made to your account.
                        </p>

                        {/* Info Box */}
                        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
                            <p className="text-sm text-yellow-800">
                                You can try again anytime. Your subscription will remain inactive until payment is
                                completed.
                            </p>
                        </div>

                        {/* Action Buttons */}
                        <div className="space-y-3">
                            <button
                                onClick={() => router.push('/account-setup/plan-payment')}
                                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-medium py-3 px-4 rounded-lg transition-colors flex items-center justify-center"
                            >
                                <CreditCard className="w-4 h-4 mr-2"/>
                                Try Payment Again
                            </button>

                            <button
                                onClick={handleGoHome}
                                className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-3 px-4 rounded-lg transition-colors flex items-center justify-center"
                            >
                                <Home className="w-4 h-4 mr-2"/>
                                Go to Dashboard
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // Error state
    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
            <div className="max-w-md w-full">
                <div className="bg-white rounded-lg shadow-lg p-8 text-center">
                    {/* Error Icon */}
                    <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-red-100 mb-6">
                        <XCircle className="h-8 w-8 text-red-600"/>
                    </div>

                    {/* Error Message */}
                    <h1 className="text-2xl font-bold text-gray-900 mb-2">Payment Error</h1>
                    <p className="text-gray-600 mb-4">
                        There was an issue processing your payment callback.
                    </p>

                    {error && (
                        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                            <p className="text-sm text-red-800">{error}</p>
                        </div>
                    )}

                    {/* Action Buttons */}
                    <div className="space-y-3">
                        <button
                            onClick={() => router.push('/account-setup/plan-payment')}
                            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-medium py-3 px-4 rounded-lg transition-colors"
                        >
                            Back to Payment
                        </button>

                        <button
                            onClick={handleGoHome}
                            className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-3 px-4 rounded-lg transition-colors flex items-center justify-center"
                        >
                            <Home className="w-4 h-4 mr-2"/>
                            Go to Dashboard
                        </button>
                    </div>

                    {/* Debug info */}
                    {sessionId && (
                        <p className="text-xs text-gray-400 mt-4">
                            Session ID: {sessionId}
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
}
