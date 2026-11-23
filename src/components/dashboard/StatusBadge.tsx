const STYLES: Record<string, string> = {
  pending: "bg-amber-50 text-amber-700 ring-amber-200",
  confirmed: "bg-sky-50 text-sky-700 ring-sky-200",
  cancelled: "bg-red-50 text-red-700 ring-red-200",
  unpaid: "bg-gray-50 text-gray-600 ring-gray-200",
  paid: "bg-green-50 text-green-700 ring-green-200",
  failed: "bg-red-50 text-red-700 ring-red-200",
  active: "bg-green-50 text-green-700 ring-green-200",
  inactive: "bg-gray-50 text-gray-600 ring-gray-200",
  blocked: "bg-red-50 text-red-700 ring-red-200",
};

export default function StatusBadge({ status }: { status: string }) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold capitalize ring-1 ring-inset ${
        STYLES[status] || STYLES.unpaid
      }`}
    >
      {status}
    </span>
  );
}
