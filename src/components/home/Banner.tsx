import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

const BANNER_IMAGE = "https://i.ibb.co/qLry80Pr/salonbook-banner.jpg";

export default function Banner() {
  return (
    <section className="relative isolate overflow-hidden">
      <Image
        src={BANNER_IMAGE}
        alt="Modern salon interior"
        fill
        priority
        sizes="100vw"
        className="-z-10 object-cover"
      />
      <div className="absolute inset-0 -z-10 bg-gradient-to-r from-ink/90 via-ink/70 to-ink/30" />

      <div className="mx-auto max-w-7xl px-4 py-28 sm:px-6 md:py-36 lg:px-8">
        <div className="max-w-2xl text-white">
          <p className="text-sm font-medium uppercase tracking-[0.25em] text-brand-200">
            Welcome to SalonBook
          </p>
          <h1 className="mt-4 text-4xl font-semibold leading-tight sm:text-5xl lg:text-6xl">
            Look good, feel <span className="text-brand-300">beautiful</span> — book in minutes
          </h1>
          <p className="mt-5 max-w-xl text-base text-white/80 sm:text-lg">
            From fresh haircuts and color to facials, makeup and relaxing spa treatments —
            explore our salon services and request your appointment online.
          </p>
          <Link href="/services" className="btn-primary mt-8 px-6 py-3.5 text-base">
            Explore Salon Services <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
