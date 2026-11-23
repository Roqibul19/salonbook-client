export default function ServiceCardSkeleton() {
  return (
    <div className="overflow-hidden rounded-2xl border border-line bg-white">
      <div className="aspect-[4/3] animate-pulse bg-brand-50" />
      <div className="space-y-3 p-5">
        <div className="h-5 w-2/3 animate-pulse rounded bg-brand-50" />
        <div className="h-4 w-full animate-pulse rounded bg-brand-50" />
        <div className="h-4 w-4/5 animate-pulse rounded bg-brand-50" />
        <div className="h-10 w-full animate-pulse rounded-xl bg-brand-50" />
      </div>
    </div>
  );
}
