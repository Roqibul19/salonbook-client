import Image from "next/image";
import Link from "next/link";
import { Clock } from "lucide-react";
import type { Service } from "@/types";

export default function ServiceCard({ service }: { service: Service }) {
  return (
    <article className="group flex flex-col overflow-hidden rounded-2xl border border-line bg-white transition hover:-translate-y-0.5 hover:shadow-lg">
      <div className="relative aspect-[4/3] overflow-hidden bg-brand-50">
        <Image
          src={service.image}
          alt={service.serviceName}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="object-cover transition duration-500 group-hover:scale-105"
        />
        <span className="absolute left-3 top-3 rounded-full bg-white/90 px-3 py-1 text-xs font-medium text-brand-700 backdrop-blur">
          {service.category}
        </span>
      </div>

      <div className="flex flex-1 flex-col p-5">
        <h3 className="text-lg font-semibold text-ink">{service.serviceName}</h3>
        <p className="mt-2 line-clamp-2 text-sm text-muted">{service.description}</p>

        <div className="mt-4 flex items-center justify-between text-sm">
          <span className="text-xl font-semibold text-brand-600">${service.price}</span>
          <span className="flex items-center gap-1 text-muted">
            <Clock className="h-4 w-4" /> {service.duration} min
          </span>
        </div>

        <Link
          href={`/services/${service._id}`}
          className="mt-5 rounded-xl border border-brand-200 px-4 py-2.5 text-center text-sm font-semibold text-brand-700 transition hover:bg-brand-600 hover:text-white"
        >
          View Details
        </Link>
      </div>
    </article>
  );
}
