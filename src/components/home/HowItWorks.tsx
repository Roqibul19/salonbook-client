import { CalendarCheck, CreditCard, Search, Sparkles } from "lucide-react";
import SectionHeading from "./SectionHeading";

const steps = [
  {
    icon: Search,
    title: "Choose a service",
    text: "Browse haircuts, coloring, facials, makeup, nails and spa treatments.",
  },
  {
    icon: CalendarCheck,
    title: "Request a time",
    text: "Pick a date and a time slot that suits you and send your request.",
  },
  {
    icon: CreditCard,
    title: "Pay securely",
    text: "Once the salon confirms, pay online with Stripe from your dashboard.",
  },
  {
    icon: Sparkles,
    title: "Enjoy your visit",
    text: "Relax and let our experienced stylists take care of the rest.",
  },
];

export default function HowItWorks() {
  return (
    <section className="bg-white py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="How it works"
          title="Book your salon visit in 4 easy steps"
          description="No phone calls, no waiting — manage everything online."
        />
        <ol className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map(({ icon: Icon, title, text }, index) => (
            <li key={title} className="relative rounded-2xl border border-line bg-cream p-6">
              <span className="absolute right-5 top-5 font-heading text-3xl font-semibold text-brand-100">
                0{index + 1}
              </span>
              <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand-600 text-white">
                <Icon className="h-5 w-5" />
              </span>
              <h3 className="mt-5 text-lg font-semibold text-ink">{title}</h3>
              <p className="mt-2 text-sm text-muted">{text}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
