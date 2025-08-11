/** biome-ignore-all lint/a11y/noLabelWithoutControl: true */
/** biome-ignore-all lint/a11y/useKeyWithClickEvents: true */
/** biome-ignore-all lint/a11y/noStaticElementInteractions: true */
'use client';

import React, {useEffect, useState} from 'react';
import {CreditCard, Info} from 'lucide-react';
import {xhrGet, xhrPost} from "@/lib/xhr";
import {apiUrl} from "@/lib/helpers/url";
import {cmk, ucFirst} from "@/lib/helpers/str";
import {formatMoney} from "@/lib/helpers/monetery";
import {useMessage} from "@/lib/hooks/message";
import {useRouter} from "next/navigation";
import {loadStripe} from '@stripe/stripe-js';
import {CardElement, Elements, useElements, useStripe} from '@stripe/react-stripe-js';
import {useSession} from "next-auth/react";
import type {StripeCardElementOptions} from "@stripe/stripe-js/dist/stripe-js/elements/card";

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || 'pk_test_dummy');

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

interface ICreatedIntent {
  client_secret: string;
  payment_intent_id: string;
}

// Stripe Card Element options
const cardElementOptions: StripeCardElementOptions = {
  style: {
    base: {
      fontSize: '16px',
      color: '#424770',
      '::placeholder': {
        color: '#aab7c4',
      },
    },
    invalid: {
      color: '#9e2146',
    },
  },
  hidePostalCode: true,
};

function PaymentForm({plan}: { plan: Plan }) {
  const {data: session} = useSession();

  const [selectedPayment, setSelectedPayment] = useState('card');
  const [saveInfo, setSaveInfo] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [email, setEmail] = useState(session?.user.email);
  const [cardholderName, setCardholderName] = useState(session?.user.full_name);

  const [billingAddress, setBillingAddress] = useState({
    line1: '',
    line2: '',
    city: '',
    postal_code: '',
    country: 'NG'
  });

  const stripe = useStripe();
  const elements = useElements();
  const {showMessage} = useMessage();
  const router = useRouter();

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!stripe || !elements) {
      showMessage('Stripe not loaded', 'error');
      return;
    }

    setIsProcessing(true);

    try {
      // Get payment method types for Stripe
      const paymentMethodMap: Record<string, string[]> = {
        'card': ['card'],
        'revolut': ['revolut_pay'],
        'klarna': ['klarna']
      };

      // 1. Create payment intent
      const {data: intentData} = await xhrPost<ICreatedIntent>(apiUrl('payments/create-intent'), {
        plan_id: plan.id,
        payment_methods: paymentMethodMap[selectedPayment] || ['card']
      });

      // 2. Confirm payment based on selected method
      let result: any;

      if (selectedPayment === 'card') {
        const cardElement = elements.getElement(CardElement);
        if (!cardElement) {
          throw new Error('Card element not found');
        }

        console.log({
          payment_method: {
            card: cardElement,
            billing_details: {
              name: cardholderName,
              email: email,
              address: {
                line1: billingAddress.line1,
                line2: billingAddress.line2,
                city: billingAddress.city,
                postal_code: billingAddress.postal_code,
                country: billingAddress.country,
              }
            }
          }
        })

        result = await stripe.confirmCardPayment(intentData.client_secret, {
          payment_method: {
            card: cardElement,
            billing_details: {
              name: cardholderName,
              email: email,
              address: {
                line1: billingAddress.line1,
                line2: billingAddress.line2,
                city: billingAddress.city,
                postal_code: billingAddress.postal_code,
                country: billingAddress.country,
              }
            }
          }
        });
      } else if (selectedPayment === 'klarna') {
        result = await stripe.confirmKlarnaPayment(intentData.client_secret, {
          payment_method: {
            billing_details: {
              email: email,
              address: {
                line1: billingAddress.line1,
                line2: billingAddress.line2,
                city: billingAddress.city,
                postal_code: billingAddress.postal_code,
                country: billingAddress.country,
              }
            }
          },
          return_url: `${window.location.origin}/payment/success`
        });
      } else if (selectedPayment === 'revolut') {
        // @ts-ignore
        result = await stripe.confirmRevolutPayPayment(intentData.client_secret, {
          return_url: `${window.location.origin}/payment/success`
        });
      }

      // Handle the result
      if (result?.error) {
        console.log(result)
        showMessage(result.error.message, 'error');
      } else if (result?.paymentIntent?.status === 'succeeded') {
        showMessage('Payment successful!', 'success');
        router.push('/account-setup/finalise');
      } else if (result?.paymentIntent?.status === 'requires_action') {
        // Handle 3D Secure or other actions
        showMessage('Additional authentication required', 'info');
      } else {
        // Handle redirects for non-card payments
        if (selectedPayment === 'klarna' || selectedPayment === 'revolut') {
          // These will redirect automatically
          return;
        }
      }

    } catch (error: any) {
      console.log(error)
      console.error('Payment error:', error);
      showMessage(error.message || 'Payment failed', 'error');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Left Panel - Order Summary */}
      <div className="w-1/2 bg-emerald-600 text-white p-8">
        <div className="max-w-md mx-auto">
          {/* Header */}
          <div className="flex items-center mb-8">
            <div className="w-8 h-8 bg-white bg-opacity-20 rounded flex items-center justify-center mr-3">
              <div className="w-4 h-4 bg-white rounded-sm"></div>
            </div>
          </div>

          {/* Amount */}
          <div className="mb-8">
            <p className="text-sm opacity-90 mb-2">Pay FinanceHer</p>
            <h1 className="text-4xl font-light">{formatMoney(plan.price)}</h1>
          </div>

          {/* Order Item */}
          <div className="rounded-lg p-4 mb-6">
            <div className="flex items-start justify-between mb-2">
              <div className="flex items-start">
                <div className="w-10 h-8 rounded mr-3 flex items-center justify-center text-xs font-medium">
                  {plan.name}
                </div>
                <div className="flex-1">
                  <h3 className="font-medium text-sm mb-1">
                    FinanceHer {plan.name} ({ucFirst(plan.billing_cycle)})
                  </h3>
                  <div className="text-xs opacity-80 leading-relaxed">
                    {plan.features.map((feature) => (
                      <div key={cmk()} className="mb-1">• {feature}</div>
                    ))}
                  </div>
                </div>
              </div>
              <span className="text-sm font-medium">{formatMoney(plan.price)}</span>
            </div>
          </div>

          {/* Summary */}
          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span>{formatMoney(plan.price)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="flex items-center">
                Tax
                <Info className="w-3 h-3 ml-1 opacity-60"/>
              </span>
              <span>£0.00</span>
            </div>
            <hr className="border-white border-opacity-20"/>
            <div className="flex justify-between font-medium">
              <span>Total due</span>
              <span>{formatMoney(plan.price)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Right Panel - Payment Form */}
      <div className="w-1/2 p-8">
        <div className="max-w-md mx-auto">
          <form onSubmit={handleSubmit}>
            {/* Contact Information */}
            <div className="mb-8">
              <h2 className="text-lg font-medium mb-4">Contact information</h2>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                />
              </div>
            </div>

            {/* Payment Method */}
            <div className="mb-8">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-medium">Payment method</h2>
                <div className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                  Powered by stripe
                </div>
              </div>

              {/* Card Payment Option */}
              <div className={`mb-4 border rounded-lg p-4 cursor-pointer ${
                selectedPayment === 'card' ? 'border-emerald-500 bg-emerald-50' : 'border-gray-200'
              }`} onClick={() => setSelectedPayment('card')}>
                <label className="flex items-center cursor-pointer">
                  <input
                    type="radio"
                    name="payment"
                    value="card"
                    checked={selectedPayment === 'card'}
                    onChange={(e) => setSelectedPayment(e.target.value)}
                    className="sr-only"
                  />
                  <div className="w-4 h-4 border-2 border-gray-300 rounded-full mr-3 flex items-center justify-center">
                    {selectedPayment === 'card' && (
                      <div className="w-2 h-2 bg-emerald-600 rounded-full"></div>
                    )}
                  </div>
                  <CreditCard className="w-4 h-4 mr-2 text-gray-600"/>
                  <span className="text-sm font-medium">Card</span>
                </label>

                {/* Card Form */}
                {selectedPayment === 'card' && (
                  <div className="mt-4 space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Card information
                      </label>
                      <div
                        className="border border-gray-300 rounded-md p-3 focus-within:ring-2 focus-within:ring-emerald-500 focus-within:border-emerald-500">
                        <CardElement options={cardElementOptions}/>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Cardholder name
                      </label>
                      <input
                        type="text"
                        value={cardholderName}
                        onChange={(e) => setCardholderName(e.target.value)}
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Billing address
                      </label>
                      <div className="space-y-3">
                        <select
                          value={billingAddress.country}
                          onChange={(e) => setBillingAddress({...billingAddress, country: e.target.value})}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                        >
                          <option value="GB">United Kingdom</option>
                          <option value="US">United States</option>
                          <option value="CA">Canada</option>
                        </select>
                        <div className="flex space-x-3">
                          <input
                            type="text"
                            placeholder="Address"
                            value={billingAddress.line1}
                            onChange={(e) => setBillingAddress({...billingAddress, line1: e.target.value})}
                            required
                            className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                          />
                          <button
                            type="button"
                            onClick={() => setBillingAddress({...billingAddress, line1: ''})}
                            className="px-3 py-2 text-sm text-gray-500 border border-gray-300 rounded-md hover:bg-gray-50"
                          >
                            Clear
                          </button>
                        </div>
                        <input
                          type="text"
                          placeholder="Address line 2"
                          value={billingAddress.line2}
                          onChange={(e) => setBillingAddress({...billingAddress, line2: e.target.value})}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                        />
                        <div className="flex space-x-3">
                          <input
                            type="text"
                            placeholder="City"
                            value={billingAddress.city}
                            onChange={(e) => setBillingAddress({...billingAddress, city: e.target.value})}
                            required
                            className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                          />
                          <input
                            type="text"
                            placeholder="Postal code"
                            value={billingAddress.postal_code}
                            onChange={(e) => setBillingAddress({...billingAddress, postal_code: e.target.value})}
                            required
                            className="w-32 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Revolut Pay Option */}
              <div className={`mb-4 border rounded-lg p-4 cursor-pointer ${
                selectedPayment === 'revolut' ? 'border-emerald-500 bg-emerald-50' : 'border-gray-200'
              }`} onClick={() => setSelectedPayment('revolut')}>
                <label className="flex items-center cursor-pointer">
                  <input
                    type="radio"
                    name="payment"
                    value="revolut"
                    checked={selectedPayment === 'revolut'}
                    onChange={(e) => setSelectedPayment(e.target.value)}
                    className="sr-only"
                  />
                  <div className="w-4 h-4 border-2 border-gray-300 rounded-full mr-3 flex items-center justify-center">
                    {selectedPayment === 'revolut' && (
                      <div className="w-2 h-2 bg-emerald-600 rounded-full"></div>
                    )}
                  </div>
                  <div className="w-4 h-4 bg-black rounded mr-2 flex items-center justify-center">
                    <div className="text-white text-xs font-bold">R</div>
                  </div>
                  <span className="text-sm font-medium">Revolut Pay</span>
                </label>
              </div>

              {/* Klarna Option */}
              <div className={`mb-6 border rounded-lg p-4 cursor-pointer ${
                selectedPayment === 'klarna' ? 'border-emerald-500 bg-emerald-50' : 'border-gray-200'
              }`} onClick={() => setSelectedPayment('klarna')}>
                <label className="flex items-center cursor-pointer">
                  <input
                    type="radio"
                    name="payment"
                    value="klarna"
                    checked={selectedPayment === 'klarna'}
                    onChange={(e) => setSelectedPayment(e.target.value)}
                    className="sr-only"
                  />
                  <div className="w-4 h-4 border-2 border-gray-300 rounded-full mr-3 flex items-center justify-center">
                    {selectedPayment === 'klarna' && (
                      <div className="w-2 h-2 bg-emerald-600 rounded-full"></div>
                    )}
                  </div>
                  <div className="w-4 h-4 bg-pink-500 rounded mr-2 flex items-center justify-center">
                    <span className="text-white text-xs font-bold">K</span>
                  </div>
                  <span className="text-sm font-medium">Klarna</span>
                </label>
              </div>

              {/* Save Information Checkbox */}
              <div className="bg-gray-50 p-4 rounded-lg mb-6">
                <label className="flex items-start cursor-pointer">
                  <input
                    type="checkbox"
                    checked={saveInfo}
                    onChange={(e) => setSaveInfo(e.target.checked)}
                    className="mt-0.5 mr-3"
                  />
                  <div className="text-sm">
                    <div className="font-medium mb-1">Save my information for faster checkout</div>
                    <div className="text-gray-600">
                      Pay faster on FinanceHer and everywhere Link is accepted.
                    </div>
                  </div>
                </label>
              </div>

              {/* Pay Button */}
              <button
                type="submit"
                disabled={!stripe || isProcessing}
                className="w-full bg-emerald-500 hover:bg-emerald-600 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-medium py-3 px-4 rounded-lg transition-colors duration-200"
              >
                {isProcessing ? 'Processing...' : `Pay ${formatMoney(plan.price)}`}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default function PaymentPage() {
  const [plan, setPlan] = useState<Plan | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const {showMessage} = useMessage();

  // biome-ignore lint/correctness/useExhaustiveDependencies: true
  useEffect(() => {
    fetchPlanDetails();
  }, []);

  const fetchPlanDetails = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await xhrGet<Plan>(apiUrl('misc/active-plan'));
      const planData = response.data;

      // Parse features if they come as string
      if (typeof planData.features === 'string') {
        planData.features = JSON.parse(planData.features);
      }

      setPlan(planData);
    } catch (error) {
      const errorMessage = "Failed to load plan details";
      setError(errorMessage);
      showMessage(errorMessage, 'error');
      console.error('Error fetching plan:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex">
        {/* Left Panel - Loading */}
        <div className="w-1/2 bg-emerald-600 text-white p-8">
          <div className="max-w-md mx-auto">
            <div className="flex items-center mb-8">
              <div className="w-8 h-8 bg-white bg-opacity-20 rounded flex items-center justify-center mr-3">
                <div className="w-4 h-4 bg-white rounded-sm"></div>
              </div>
            </div>
            <div className="flex items-center justify-center h-64">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
                <p className="text-white opacity-90">Loading plan details...</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Panel - Loading */}
        <div className="w-1/2 p-8">
          <div className="max-w-md mx-auto">
            <div className="flex items-center justify-center h-64">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto mb-4"></div>
                <p className="text-gray-600">Loading payment form...</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !plan) {
    return (
      <div className="min-h-screen bg-gray-50 flex">
        {/* Left Panel - Error */}
        <div className="w-1/2 bg-emerald-600 text-white p-8">
          <div className="max-w-md mx-auto">
            <div className="flex items-center mb-8">
              <div className="w-8 h-8 bg-white bg-opacity-20 rounded flex items-center justify-center mr-3">
                <div className="w-4 h-4 bg-white rounded-sm"></div>
              </div>
            </div>
            <div className="flex items-center justify-center h-64">
              <div className="text-center">
                <p className="text-white opacity-90 mb-4">{error || "Plan not found"}</p>
                <button
                  type="button"
                  onClick={fetchPlanDetails}
                  className="bg-white bg-opacity-20 hover:bg-opacity-30 text-white font-medium py-2 px-4 rounded-lg transition-colors"
                >
                  Try Again
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Right Panel - Error */}
        <div className="w-1/2 p-8">
          <div className="max-w-md mx-auto">
            <div className="flex items-center justify-center h-64">
              <div className="text-center">
                <p className="text-gray-600 mb-4">Unable to load payment form</p>
                <button
                  type="button"
                  onClick={fetchPlanDetails}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
                >
                  Retry
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <Elements stripe={stripePromise}>
      <PaymentForm plan={plan}/>
    </Elements>
  );
}