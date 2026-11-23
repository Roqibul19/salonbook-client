import { Suspense } from "react";
import Banner from "@/components/home/Banner";
import SectionHeading from "@/components/home/SectionHeading";
import FeaturedServices from "@/components/home/FeaturedServices";
import CategorySection from "@/components/home/CategorySection";
import HowItWorks from "@/components/home/HowItWorks";
import ServiceCardSkeleton from "@/components/services/ServiceCardSkeleton";

export const dynamic = "force-dynamic";

function FeaturedSkeleton() {
  return (
    <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: 6 }).map((_, i) => (
        <ServiceCardSkeleton key={i} />
      ))}
    </div>
  );
}

function CategorySkeleton() {
  return (
    <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-7">
      {Array.from({ length: 7 }).map((_, i) => (
        <div key={i} className="h-36 animate-pulse rounded-2xl bg-brand-50" />
      ))}
    </div>
  );
}

export default function Home() {
  return (
    <>
      <Banner />

      <section className="py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeading
            eyebrow="Featured"
            title="Our Popular Salon Services"
            description="Hand-picked treatments our clients love the most."
          />
          <Suspense fallback={<FeaturedSkeleton />}>
            <FeaturedServices />
          </Suspense>
        </div>
      </section>

      <HowItWorks />

      <section className="py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeading
            eyebrow="Categories"
            title="Explore by Category"
            description="Find exactly what you need — tap a category to see its services."
          />
          <Suspense fallback={<CategorySkeleton />}>
            <CategorySection />
          </Suspense>
        </div>
      </section>
    </>
  );
}
