import Link from "next/link";

export default function Home() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-24 text-center sm:px-6 lg:px-8">
      <h1 className="text-4xl font-semibold text-ink sm:text-5xl">
        Look good, feel <span className="text-brand-600">beautiful</span>
      </h1>
      <p className="mx-auto mt-4 max-w-xl text-muted">
        Explore our salon services and request your appointment online.
      </p>
      <Link href="/services" className="btn-primary mt-8">
        Explore Salon Services
      </Link>
    </section>
  );
}
