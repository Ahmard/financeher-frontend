'use client';

import AdminLayout, {CurrentPage} from "@/components/App/Layouts/AdminLayout";
import {ArrowLeft, Calendar} from "lucide-react";
import {Button} from "@/components/ui/button";
import {Input} from "@/components/ui/input";
import {Label} from "@/components/ui/label";
import {Textarea} from "@/components/ui/textarea";
import {type FieldError, useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {z} from "zod";
import Selectable from "@/components/Common/Selectable";
import {apiUrl} from "@/lib/helpers/url";
import {xhrPost} from "@/lib/xhr";
import type {Opportunity} from "@/lib/models/opportunity";
import {useState} from "react";
import {useMessage} from "@/lib/hooks/message";
import {redirect} from "next/navigation";
import type {SelectableItem} from "@/lib/types/selectable";
import PageHeader from "@/components/Common/PageHeader";

// Improved Zod schema with separate min/max amount fields
const opportunitySchema = z.object({
  name: z.string().min(1, "Opportunity name is required").min(3, "Opportunity name must be at least 3 characters"),
  min_amount: z.number().min(0, "Minimum amount must be 0 or greater"),
  max_amount: z.number().min(0, "Maximum amount must be 0 or greater"),
  business_type_id: z.string().min(1, "Business type is required"),
  opportunity_type_id: z.string().min(1, "Sector is required"),
  closing_at: z.string().min(1, "Closing date is required"),
  country_id: z.string().min(1, "Location is required"),
  application_url: z.url("Invalid URL format").min(1, "Application link is required"),
  logoImage: z.any().optional(),
  overview: z.string().min(1, "Overview is required").min(10, "Overview must be at least 10 characters"),
}).refine((data) => data.max_amount >= data.min_amount, {
  message: "Maximum amount must be greater than or equal to minimum amount",
  path: ["maxAmount"],
});

type OpportunityFormData = z.infer<typeof opportunitySchema>;

export default function OpportunityCreatePage() {
  const {
    register,
    handleSubmit,
    setValue,
    formState: {errors},
  } = useForm<OpportunityFormData>({
    resolver: zodResolver(opportunitySchema),
  });

  const {showMessage} = useMessage()
  const [isSubmitting, setIsSubmitting] = useState(false);

  const onSubmit = (data: OpportunityFormData) => {
    console.log(data)
    setIsSubmitting(true);

    const formData = new FormData();

    // Append fields with snake_case keys
    formData.append("name", data.name);
    formData.append("min_amount", String(data.min_amount));
    formData.append("max_amount", String(data.max_amount));
    formData.append("country_id", data.country_id);
    formData.append("business_type_id", data.business_type_id);
    formData.append("opportunity_type_id", data.opportunity_type_id);
    formData.append("closing_at", data.closing_at);
    formData.append("application_url", data.application_url);
    formData.append("overview", data.overview);

    // Append file if present
    const logoFile = (data.logoImage as FileList)?.[0];
    if (logoFile) {
      formData.append("logo", logoFile); // snake_case for file too
    }

    xhrPost<Opportunity>(apiUrl('admin/opportunities'), formData, {
      headers: {
        'Content-Type': undefined, // Let browser set multipart/form-data
      },
    })
      .then(resp => {
        showMessage("Opportunity created successfully");
        setTimeout(() => redirect(`/admin/opportunities/${resp.data.id}`), 500);
      })
      .finally(() => setIsSubmitting(false));
  };


  const onCreateAndAddNew = (data: OpportunityFormData) => {
    console.log("Create and add new:", data);
    // Handle create and add new functionality
  };


  const onLocationSelected = (selected: SelectableItem<Opportunity>) => {
    setValue('country_id', selected.value as string)
  };

  const onBusinessTypeSelected = (selected: SelectableItem<Opportunity>) => {
    setValue('business_type_id', selected.value as string)
  };

  const onOpportunityTypeSelected = (selected: SelectableItem<Opportunity>) => {
    setValue('opportunity_type_id', selected.value as string)
  };

  const endpointCountries = apiUrl('misc/geo/countries')
  const endpointBusinessTypes = apiUrl('misc/business-types')
  const endpointOpportunityTypes = apiUrl('misc/opportunity-types')

  return (
    <AdminLayout currentPage={CurrentPage.Opportunities}>
      <div className="pb-6 px-6 max-w-4xl">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <Button variant="ghost" size="sm" className="p-2">
            <ArrowLeft className="h-4 w-4"/>
          </Button>
          <span className="text-sm text-muted-foreground">Back to Opportunities</span>
        </div>

        <PageHeader name="Create New Opportunity" />

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Opportunity Name */}
          <div className="space-y-2">
            <Label htmlFor="opportunity-name">Opportunity Name</Label>
            <Input
              id="opportunity-name"
              placeholder="Enter Opportunity Name"
              className="w-full"
              {...register("name")}
            />
            {errors.name && (
              <p className="text-sm text-red-500">{errors.name.message}</p>
            )}
          </div>

          {/* Amount Range Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="min-amount">Minimum Amount</Label>
              <Input
                id="min-amount"
                type="number"
                placeholder="10000"
                className="w-full"
                {...register("min_amount", {valueAsNumber: true})}
              />
              {errors.min_amount && (
                <p className="text-sm text-red-500">{errors.min_amount.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="max-amount">Maximum Amount</Label>
              <Input
                id="max-amount"
                type="number"
                placeholder="50000"
                className="w-full"
                {...register("max_amount", {valueAsNumber: true})}
              />
              {errors.max_amount && (
                <p className="text-sm text-red-500">{errors.max_amount.message}</p>
              )}
            </div>
          </div>

          {/* Sector */}
          <div className="space-y-2">
            <Label htmlFor="sector">Sector</Label>
            <Selectable
              valueField="id"
              labelField="name"
              placeholder="Choose Business Secgor"
              endpoint={endpointBusinessTypes}
              onChange={onBusinessTypeSelected}
            />
            {errors.business_type_id && (
              <p className="text-sm text-red-500">{errors.business_type_id.message}</p>
            )}
          </div>

          {/* Closing Date and Funding Type Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="closing-date">Closing Date</Label>
              <div className="relative">
                <Input
                  id="closing-date"
                  type="date"
                  className="w-full pr-10"
                  {...register("closing_at")}
                />
                <Calendar
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none"/>
              </div>
              {errors.closing_at && (
                <p className="text-sm text-red-500">{errors.closing_at.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="funding-type">Funding Type</Label>
              <Selectable
                valueField="id"
                labelField="name"
                placeholder="Choose Opportunity Type"
                endpoint={endpointOpportunityTypes}
                onChange={onOpportunityTypeSelected}
              />
              {errors.opportunity_type_id && (
                <p className="text-sm text-red-500">{errors.opportunity_type_id.message}</p>
              )}
            </div>
          </div>

          {/* Location */}
          <div className="space-y-2">
            <Label>Location</Label>
            <Selectable
              valueField="id"
              labelField="name"
              placeholder="Choose Location"
              endpoint={endpointCountries}
              onChange={onLocationSelected}
            />
            {errors.country_id && (
              <p className="text-sm text-red-500">{errors.country_id.message}</p>
            )}
          </div>

          {/* Application Link */}
          <div className="space-y-2">
            <Label htmlFor="application-link">Application Link (URL)</Label>
            <Input
              id="application-link"
              placeholder="https://example.com/posts/opp-august-001"
              type="url"
              className="w-full"
              {...register("application_url")}
            />
            {errors.application_url && (
              <p className="text-sm text-red-500">{errors.application_url.message}</p>
            )}
          </div>

          {/* Logo Image */}
          <div className="space-y-2">
            <Label htmlFor="logo-image">Logo Image</Label>
            <Input
              id="logo-image"
              type="file"
              accept="image/*"
              {...register("logoImage")}
            />
            {errors.logoImage && (
              <p className="text-sm text-red-500">{(errors.logoImage as FieldError).message}</p>
            )}
          </div>

          {/* Overview & Eligibility Criteria */}
          <div className="space-y-2">
            <Label htmlFor="overview">Overview & Eligibility Criteria</Label>
            <Textarea
              id="overview"
              placeholder="Enter Overview & Eligibility Criteria"
              className="min-h-32 resize-none"
              {...register("overview")}
            />
            {errors.overview && (
              <p className="text-sm text-red-500">{errors.overview.message}</p>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            <Button
              type="submit"
              className="cursor-pointer bg-teal-600 hover:bg-teal-700 text-white px-6"
              disabled={isSubmitting}>
              {isSubmitting ? 'Creating...' : 'Create Opportunity'}
            </Button>
            <Button
              type="button"
              variant="outline"
              className="cursor-pointer px-6"
              onClick={handleSubmit(onCreateAndAddNew)}
            >
              {isSubmitting ? 'Creating...' : 'Create & Add New'}
            </Button>
          </div>
        </form>
      </div>
    </AdminLayout>
  )
}