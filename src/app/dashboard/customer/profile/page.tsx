import type { Metadata } from "next";
import ProfileForm from "@/components/dashboard/ProfileForm";

export const metadata: Metadata = {
  title: "My Profile | SalonBook",
};

export default function CustomerProfilePage() {
  return <ProfileForm />;
}
