/** biome-ignore-all lint/correctness/useExhaustiveDependencies: true */
'use client';

import AdminLayout, {CurrentPage} from "@/components/App/Layouts/AdminLayout";
import {Button} from "@/components/ui/button";
import {Input} from "@/components/ui/input";
import {Label} from "@/components/ui/label";
import {Controller, useFieldArray, useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {z} from "zod";
import {apiUrl} from "@/lib/helpers/url";
import {xhrGet, xhrPut} from "@/lib/xhr";
import type {Opportunity} from "@/lib/models/opportunity";
import {useEffect, useState} from "react";
import {useMessage} from "@/lib/hooks/message";
import {useParams, useRouter} from "next/navigation";
import PageHeader from "@/components/Common/PageHeader";
import PageTopBackLink from "@/components/Common/PageTopBackLink";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue,} from "@/components/ui/select";
import {ArrowLeft, Plus, Save, X} from "lucide-react";

interface Plan {
  id: string;
  name: string;
  price: number;
  billing_cycle: string;
  features: string[];
}

const opportunitySchema = z.object({
  name: z.string().min(1, "Plan name is required").min(3, "Plan name must be at least 3 characters"),
  price: z.number().min(0, "Price amount must be 0 or greater"),
  billing_cycle: z.string().min(1, "Billing cycle is required"),
  features: z.array(z.object({
    value: z.string().min(1, "Feature cannot be empty")
  })).min(1, "At least one feature is required"),
});

type PlanFormData = z.infer<typeof opportunitySchema>;

export default function PlanEditPage() {
  const params = useParams<{ id: string }>();
  const planId = params.id;

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: {errors, isDirty},
  } = useForm<PlanFormData>({
    resolver: zodResolver(opportunitySchema),
    defaultValues: {
      features: [{value: ""}]
    }
  });

  const {fields, append, remove} = useFieldArray({
    control,
    name: "features"
  });

  const {showMessage} = useMessage();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [originalPlan, setOriginalPlan] = useState<Plan | null>(null);

  useEffect(() => {
    fetchPlanData();
  }, [planId]);

  const fetchPlanData = async () => {
    try {
      setIsLoading(true);
      const response = await xhrGet<Plan>(apiUrl(`admin/plans/${planId}`));
      const plan = response.data;

      setOriginalPlan(plan);

      // Transform the plan data to match form structure
      const formData = {
        name: plan.name,
        price: plan.price,
        billing_cycle: plan.billing_cycle,
        features: plan.features.length > 0
          ? plan.features.map(feature => ({value: feature}))
          : [{value: ""}]
      };

      reset(formData);
    } catch (error) {
      showMessage("Failed to load plan data", "error");
      console.error('Error fetching plan:', error);
      // Redirect back if plan not found
      setTimeout(() => router.push('/admin/plans'), 1000);
    } finally {
      setIsLoading(false);
    }
  };

  const onSubmit = (data: PlanFormData) => {
    // Transform the features array to just strings before sending
    const transformedData = {
      ...data,
      features: data.features.map(feature => feature.value)
    };

    console.log('Updating plan:', transformedData);
    setIsSubmitting(true);

    xhrPut<Opportunity>(apiUrl(`admin/plans/${planId}`), transformedData)
      .then(_resp => {
        showMessage("Plan updated successfully");
        setTimeout(() => router.push(`/admin/plans/${planId}`), 500);
      })
      .catch((error) => {
        showMessage("Failed to update plan", "error");
        console.error('Error updating plan:', error);
      })
      .finally(() => setIsSubmitting(false));
  };

  const addFeature = () => {
    append({value: ""});
  };

  const removeFeature = (index: number) => {
    if (fields.length > 1) {
      remove(index);
    }
  };

  const handleCancel = () => {
    if (isDirty) {
      const confirmLeave = window.confirm(
        "You have unsaved changes. Are you sure you want to leave without saving?"
      );
      if (!confirmLeave) return;
    }
    router.push(`/admin/plans/${planId}`);
  };

  const resetForm = () => {
    if (originalPlan) {
      const formData = {
        name: originalPlan.name,
        price: originalPlan.price,
        billing_cycle: originalPlan.billing_cycle,
        features: originalPlan.features.length > 0
          ? originalPlan.features.map(feature => ({value: feature}))
          : [{value: ""}]
      };
      reset(formData);
      showMessage("Form reset to original values");
    }
  };

  if (isLoading) {
    return (
      <AdminLayout currentPage={CurrentPage.Plans}>
        <div className="pb-6 px-6 max-w-4xl">
          <PageTopBackLink href="/admin/plans">
            Back to Plans
          </PageTopBackLink>
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#006A4B] mx-auto mb-4"></div>
              <p className="text-gray-600">Loading plan data...</p>
            </div>
          </div>
        </div>
      </AdminLayout>
    );
  }

  if (!originalPlan) {
    return (
      <AdminLayout currentPage={CurrentPage.Plans}>
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
    <AdminLayout currentPage={CurrentPage.Opportunities}>
      <div className="pb-6 px-6 max-w-4xl">
        {/* Header */}
        <PageTopBackLink href={`/admin/plans/${planId}`}>
          <ArrowLeft className="h-4 w-4 mr-1"/>
          Back to Plan Details
        </PageTopBackLink>

        <div className="flex items-center justify-between mb-6">
          <div>
            <PageHeader name={`Edit Plan: ${originalPlan.name}`} className="mb-2"/>
            <p className="text-gray-600">Update plan information and features</p>
          </div>
          {isDirty && (
            <div className="flex items-center gap-2 text-sm text-orange-600 bg-orange-50 px-3 py-2 rounded-lg">
              <div className="h-2 w-2 bg-orange-500 rounded-full"></div>
              Unsaved changes
            </div>
          )}
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Plan Name */}
          <div className="space-y-2">
            <Label htmlFor="plan-name">Plan Name</Label>
            <Input
              id="plan-name"
              placeholder="Mars Plan"
              className="w-full"
              {...register("name")}
            />
            {errors.name && (
              <p className="text-sm text-red-500">{errors.name.message}</p>
            )}
          </div>

          {/* Price */}
          <div className="space-y-2">
            <Label htmlFor="price">Price</Label>
            <Input
              id="price"
              type="number"
              placeholder="68"
              className="w-full"
              {...register("price", {valueAsNumber: true})}
            />
            {errors.price && (
              <p className="text-sm text-red-500">{errors.price.message}</p>
            )}
          </div>

          {/* Billing Cycle */}
          <div className="space-y-2">
            <Label htmlFor="billing_cycle">Billing Cycle</Label>
            <Controller
              name="billing_cycle"
              control={control}
              render={({field}) => (
                <Select onValueChange={field.onChange} value={field.value}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select Billing Cycle"/>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="monthly">Monthly</SelectItem>
                    <SelectItem value="quarterly">Quarterly</SelectItem>
                    <SelectItem value="yearly">Yearly</SelectItem>
                  </SelectContent>
                </Select>
              )}
            />
            {errors.billing_cycle && (
              <p className="text-sm text-red-500">{errors.billing_cycle.message}</p>
            )}
          </div>

          {/* Dynamic Features Section */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label>Features</Label>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={addFeature}
                className="flex items-center gap-1"
              >
                <Plus className="h-4 w-4"/>
                Add Feature
              </Button>
            </div>

            <div className="space-y-3">
              {fields.map((field, index) => (
                <div key={field.id} className="flex items-center gap-2">
                  <Input
                    placeholder={`Feature ${index + 1}`}
                    className="flex-1"
                    {...register(`features.${index}.value`)}
                  />
                  {fields.length > 1 && (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => removeFeature(index)}
                      className="flex items-center gap-1 text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      <X className="h-4 w-4"/>
                    </Button>
                  )}
                </div>
              ))}
            </div>

            {errors.features && (
              <p className="text-sm text-red-500">
                {errors.features.message ||
                  (Array.isArray(errors.features) &&
                    errors.features.some(error => error?.value) &&
                    "All features must be filled out")}
              </p>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-6 border-t">
            <Button
              type="submit"
              className="cursor-pointer bg-[#006A4B] hover:bg-teal-700 text-white px-6 flex items-center gap-2"
              disabled={isSubmitting || !isDirty}>
              <Save className="h-4 w-4"/>
              {isSubmitting ? 'Updating...' : 'Update Plan'}
            </Button>

            <Button
              type="button"
              variant="outline"
              onClick={handleCancel}
              disabled={isSubmitting}
              className="px-6"
            >
              Cancel
            </Button>

            {isDirty && (
              <Button
                type="button"
                variant="outline"
                onClick={resetForm}
                disabled={isSubmitting}
                className="px-6 text-gray-600"
              >
                Reset
              </Button>
            )}
          </div>
        </form>

        {/* Save Reminder */}
        {isDirty && (
          <div className="mt-6 p-4 bg-orange-50 border border-orange-200 rounded-lg">
            <div className="flex items-start gap-3">
              <div className="h-5 w-5 text-orange-500 mt-0.5">⚠️</div>
              <div>
                <p className="font-medium text-orange-800">You have unsaved changes</p>
                <p className="text-sm text-orange-700 mt-1">
                  Don't forget to save your changes before leaving this page.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}