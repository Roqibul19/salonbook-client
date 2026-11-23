import Link from "next/link";
import { Scissors } from "lucide-react";

export default function Logo({ light = false }: { light?: boolean }) {
  return (
    <Link href="/" className="flex items-center gap-2">
      <span className="flex h-9 w-9 items-center justify-center rounded-full bg-brand-600 text-white">
        <Scissors className="h-4 w-4" />
      </span>
      <span
        className={`font-heading text-xl font-semibold tracking-tight ${
          light ? "text-white" : "text-ink"
        }`}
      >
        Salon<span className="text-brand-500">Book</span>
      </span>
    </Link>
  );
}
