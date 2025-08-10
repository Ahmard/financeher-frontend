/** biome-ignore-all lint/a11y/noLabelWithoutControl: true */
/** biome-ignore-all lint/correctness/useExhaustiveDependencies: true */
'use client';

import AdminLayout, {CurrentPage} from "@/components/App/Layouts/AdminLayout";
import {Button} from "@/components/ui/button";
import {Badge} from "@/components/ui/badge";
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card";
import {useState, useEffect} from "react";
import {useMessage} from "@/lib/hooks/message";
import {redirect, useParams, useRouter} from "next/navigation";
import PageHeader from "@/components/Common/PageHeader";
import PageTopBackLink from "@/components/Common/PageTopBackLink";
import {apiUrl} from "@/lib/helpers/url";
import {xhrGet} from "@/lib/xhr";
import {Edit, Trash2, Check, DollarSign, Calendar, List} from "lucide-react";
import {cmk} from "@/lib/helpers/str";
import Link from "next/link";
import {formatMoney} from "@/lib/helpers/monetery";
import ConfirmWithReason from "@/components/Common/ConfirmWithReason";
import {HttpMethod} from "@/lib/enums/http";

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

export default function PlanInfoPage() {
  const params = useParams<{ id: string }>();
  const planId = params.id;

  const [plan, setPlan] = useState<Plan | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const {showMessage} = useMessage();
  const router = useRouter();

  useEffect(() => {
    fetchPlanDetails();
  }, [planId]);

  const fetchPlanDetails = async () => {
    try {
      setIsLoading(true);
      const response = await xhrGet<Plan>(apiUrl(`admin/plans/${planId}`));
      setPlan(response.data);
    } catch (error) {
      showMessage("Failed to load plan details", "error");
      console.error('Error fetching plan:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = () => {
    setConfirmModal({
      cmk: cmk(),
      state: true,
      title: 'Delete Plan',
      okText: 'Delete',
      label: 'Deletion Reason',
      statement: `This action cannot be undone. This will permanently delete the plan "${plan?.name}" and all associated data.`,
      placeholder: 'Why are you deleting this plan?',
      successMessage: 'Plan deleted successfully',
      endpoint: apiUrl(`admin/plans/${planId}`)
    });
  };

  const [confirmModal, setConfirmModal] = useState({
    state: false,
    cmk: '',
    title: '',
    label: '',
    okText: '',
    placeholder: '',
    statement: '',
    successMessage: '',
    endpoint: '',
  });

  const formatBillingCycle = (cycle: string) => {
    return cycle.charAt(0).toUpperCase() + cycle.slice(1);
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  if (isLoading) {
    return (
      <AdminLayout currentPage={CurrentPage.Opportunities}>
        <div className="pb-6 px-6 max-w-4xl">
          <PageTopBackLink href="/admin/plans">
            Back to Plans
          </PageTopBackLink>
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#006A4B] mx-auto mb-4"></div>
              <p className="text-gray-600">Loading plan details...</p>
            </div>
          </div>
        </div>
      </AdminLayout>
    );
  }

  if (!plan) {
    return (
      <AdminLayout currentPage={CurrentPage.Opportunities}>
        <div className="pb-6 px-6 max-w-4xl">
          <PageTopBackLink href="/admin/plans">
            Back to Plans
          </PageTopBackLink>
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <p className="text-gray-600 mb-4">Plan not found</p>
              <Button onClick={() => router.push('/admin/plans')}>
                Back to Plans
              </Button>
            </div>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout currentPage={CurrentPage.Plans}>
      <div className="pb-6 px-6 max-w-4xl">
        {/* Header */}
        <PageTopBackLink href="/admin/plans">
          Back to Plans
        </PageTopBackLink>

        <div className="flex items-center justify-between mb-6">
          <div>
            <PageHeader name={plan.name} className="mb-2"/>
            <p className="text-gray-600">Plan Details</p>
          </div>
          <div className="flex gap-3">
            <Link href={`/admin/plans/${planId}/edit`}>
              <Button
                variant="outline"
                className="cursor-pointer flex items-center gap-2 text-black"
              >
                <Edit className="h-4 w-4" />
                Edit Plan
              </Button>
            </Link>

            <Button
              variant="outline"
              className="flex items-center gap-2 text-red-600 hover:text-red-700 hover:bg-red-50"
              onClick={handleDelete}
            >
              <Trash2 className="h-4 w-4" />
              Delete Plan
            </Button>
          </div>
        </div>

        {/* Plan Details Cards */}
        <div className="grid gap-6">
          {/* Basic Information Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="h-5 w-5 text-[#006A4B]" />
                Basic Information
              </CardTitle>
              <CardDescription>
                Core plan details and pricing information
              </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-500">Plan Name</label>
                  <p className="text-lg font-semibold">{plan.name}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Price</label>
                  <p className="text-lg font-semibold text-[#006A4B]">
                    {formatMoney(plan.price)}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-500">Billing Cycle</label>
                  <div className="flex items-center gap-2 mt-1">
                    <Calendar className="h-4 w-4 text-gray-400" />
                    <Badge variant="secondary">
                      {formatBillingCycle(plan.billing_cycle)}
                    </Badge>
                  </div>
                </div>
                {plan.is_active !== undefined && (
                  <div>
                    <label className="text-sm font-medium text-gray-500">Status</label>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant={plan.is_active ? "default" : "secondary"}>
                        {plan.is_active ? "Active" : "Inactive"}
                      </Badge>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Features Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <List className="h-5 w-5 text-[#006A4B]" />
                Features ({plan.features.length})
              </CardTitle>
              <CardDescription>
                All features included in this plan
              </CardDescription>
            </CardHeader>
            <CardContent>
              {plan.features.length > 0 ? (
                <div className="grid gap-3">
                  {plan.features.map((feature) => (
                    <div key={cmk()} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                      <Check className="h-4 w-4 text-[#006A4B] flex-shrink-0" />
                      <span className="text-gray-700">{feature}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 italic">No features defined for this plan.</p>
              )}
            </CardContent>
          </Card>

          {/* Metadata Card */}
          {(plan.created_at || plan.updated_at) && (
            <Card>
              <CardHeader>
                <CardTitle>Metadata</CardTitle>
                <CardDescription>
                  Plan creation and modification details
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {plan.created_at && (
                    <div>
                      <label className="text-sm font-medium text-gray-500">Created At</label>
                      <p className="text-gray-700">{formatDate(plan.created_at)}</p>
                    </div>
                  )}
                  {plan.updated_at && (
                    <div>
                      <label className="text-sm font-medium text-gray-500">Last Updated</label>
                      <p className="text-gray-700">{formatDate(plan.updated_at)}</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Quick Actions */}
        <div className="mt-8 p-4 bg-gray-50 rounded-lg">
          <h3 className="font-medium mb-3">Quick Actions</h3>
          <div className="flex flex-wrap gap-3">
            <Link href={`/admin/plans/${planId}/edit`}>
              <Button
                size="sm"
                variant="outline"
                className="cursor-pointer flex items-center gap-2 text-black"
              >
                <Edit className="h-4 w-4" />
                Edit This Plan
              </Button>
            </Link>
            <Button
              onClick={() => router.push('/admin/plans/create')}
              variant="outline"
              size="sm"
              className="flex items-center gap-2"
            >
              <DollarSign className="h-4 w-4" />
              Create Similar Plan
            </Button>
            <Button
              onClick={() => router.push('/admin/plans')}
              variant="outline"
              size="sm"
            >
              View All Plans
            </Button>
          </div>
        </div>
      </div>

      <ConfirmWithReason
        key={confirmModal.cmk}
        visible={confirmModal.state}
        title={confirmModal.title}
        label={confirmModal.label}
        okText={confirmModal.okText}
        placeholder={confirmModal.placeholder}
        statement={confirmModal.statement}
        successMessage={confirmModal.successMessage}
        endpoint={confirmModal.endpoint}
        httpMethod={HttpMethod.Delete}
        onSuccess={() => redirect('/admin/plans')}
        onCancel={() => {
          setConfirmModal({
            ...confirmModal,
            state: false,
          });
        }}
      />
    </AdminLayout>
  );
}