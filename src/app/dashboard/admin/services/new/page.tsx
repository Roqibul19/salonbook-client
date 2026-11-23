import type { Metadata } from "next";
import PageHeader from "@/components/dashboard/PageHeader";
import ServiceForm from "@/components/dashboard/ServiceForm";

export const metadata: Metadata = {
  title: "Add Service | SalonBook",
};

export default function AddServicePage() {
  return (
    <div>
      <PageHeader title="Add New Service" description="Create a new salon service for customers to book." />
      <ServiceForm />
    </div>
  );
}
