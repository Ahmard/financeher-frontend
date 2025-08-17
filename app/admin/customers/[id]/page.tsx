'use client';

import AdminLayout, {CurrentPage} from "@/components/App/Layouts/AdminLayout";
import {useParams} from "next/navigation";

export default function OpportunityInfoPage() {
  const params = useParams<{ id: string }>();
  const userId = parseInt(params.id);

  return (
    <AdminLayout currentPage={CurrentPage.Opportunities}>
      Opportunity {userId}
    </AdminLayout>
  )
}