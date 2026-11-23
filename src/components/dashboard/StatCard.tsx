import type { LucideIcon } from "lucide-react";

type StatCardProps = {
  label: string;
  value: number | string;
  icon: LucideIcon;
  tone?: "brand" | "amber" | "green" | "red" | "blue";
  loading?: boolean;
};

const TONES = {
  brand: "bg-brand-50 text-brand-600",
  amber: "bg-amber-50 text-amber-600",
  green: "bg-green-50 text-green-600",
  red: "bg-red-50 text-red-600",
  blue: "bg-sky-50 text-sky-600",
};

export default function StatCard({ label, value, icon: Icon, tone = "brand", loading }: StatCardProps) {
  return (
    <div className="flex items-center gap-4 rounded-2xl border border-line bg-white p-5">
      <span className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${TONES[tone]}`}>
        <Icon className="h-5 w-5" />
      </span>
      <div className="min-w-0">
        <p className="truncate text-sm text-muted">{label}</p>
        {loading ? (
          <div className="mt-1 h-7 w-12 animate-pulse rounded bg-brand-50" />
        ) : (
          <p className="text-2xl font-semibold text-ink">{value}</p>
        )}
      </div>
    </div>
  );
}
