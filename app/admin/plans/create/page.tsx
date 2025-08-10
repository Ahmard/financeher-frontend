'use client';

import AdminLayout, {CurrentPage} from "@/components/App/Layouts/AdminLayout";
import {Button} from "@/components/ui/button";
import {Input} from "@/components/ui/input";
import {Label} from "@/components/ui/label";
import {Controller, useForm, useFieldArray} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {z} from "zod";
import {apiUrl} from "@/lib/helpers/url";
import {xhrPost} from "@/lib/xhr";
import type {Opportunity} from "@/lib/models/opportunity";
import {useState} from "react";
import {useMessage} from "@/lib/hooks/message";
import {redirect} from "next/navigation";
import PageHeader from "@/components/Common/PageHeader";
import PageTopBackLink from "@/components/Common/PageTopBackLink";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue,} from "@/components/ui/select";
import {X, Plus} from "lucide-react";

// Improved Zod schema with separate min/max amount fields
const opportunitySchema = z.object({
  name: z.string().min(1, "Opportunity name is required").min(3, "Opportunity name must be at least 3 characters"),
  price: z.number().min(0, "Price amount must be 0 or greater"),
  billing_cycle: z.string().min(1, "Business type is required"),
  features: z.array(z.object({
    value: z.string().min(1, "Feature cannot be empty")
  })).min(1, "At least one feature is required"),
});

type PlanFormData = z.infer<typeof opportunitySchema>;

export default function OpportunityCreatePage() {
  const {
    register,
    handleSubmit,
    control,
    formState: {errors},
  } = useForm<PlanFormData>({
    resolver: zodResolver(opportunitySchema),
    defaultValues: {
      features: [{ value: "" }] // Start with one empty feature
    }
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "features"
  });

  const {showMessage} = useMessage()
  const [isSubmitting, setIsSubmitting] = useState(false);

  const onSubmit = (data: PlanFormData) => {
    // Transform the features array to just strings before sending
    const transformedData = {
      ...data,
      features: data.features.map(feature => feature.value)
    };

    console.log(transformedData)
    setIsSubmitting(true);

    xhrPost<Opportunity>(apiUrl('admin/plans'), transformedData)
      .then(_resp => {
        showMessage("Plan created successfully");
        setTimeout(() => redirect(`/admin/plans`), 500);
      })
      .finally(() => setIsSubmitting(false));
  };

  const addFeature = () => {
    append({ value: "" });
  };

  const removeFeature = (index: number) => {
    if (fields.length > 1) {
      remove(index);
    }
  };

  return (
    <AdminLayout currentPage={CurrentPage.Plans}>
      <div className="pb-6 px-6 max-w-4xl">
        {/* Header */}
        <PageTopBackLink href="/admin/plans">
          Back to Plans
        </PageTopBackLink>

        <PageHeader name="Create New Plan" className="mb-4"/>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Opportunity Name */}
          <div className="space-y-2">
            <Label htmlFor="plan-name">Name</Label>
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

          {/* Amount Range Row */}
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
                <Plus className="h-4 w-4" />
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
                      <X className="h-4 w-4" />
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
          <div className="flex gap-3 pt-4">
            <Button
              type="submit"
              className="cursor-pointer bg-[#006A4B] hover:bg-teal-700 text-white px-6"
              disabled={isSubmitting}>
              {isSubmitting ? 'Creating...' : 'Create Plan'}
            </Button>
          </div>
        </form>
      </div>
    </AdminLayout>
  )
}