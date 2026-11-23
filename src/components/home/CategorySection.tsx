import Link from "next/link";
import { API_URL } from "@/lib/api";
import { CATEGORY_ICONS, SERVICE_CATEGORIES } from "@/lib/categories";
import type { CategoryCount } from "@/types";

async function getCategories(): Promise<CategoryCount[]> {
  try {
    const res = await fetch(`${API_URL}/services/categories`, { cache: "no-store" });
    if (!res.ok) throw new Error();
    return res.json();
  } catch {
    // still show the categories if the count request fails
    return SERVICE_CATEGORIES.map((name) => ({ name, count: 0 }));
  }
}

export default async function CategorySection() {
  const categories = await getCategories();

  return (
    <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-7">
      {categories.map((category) => {
        const Icon = CATEGORY_ICONS[category.name];
        return (
          <Link
            key={category.name}
            href={`/services?category=${encodeURIComponent(category.name)}`}
            className="group flex flex-col items-center rounded-2xl border border-line bg-white p-5 text-center transition hover:-translate-y-0.5 hover:border-brand-200 hover:shadow-md"
          >
            <span className="flex h-14 w-14 items-center justify-center rounded-full bg-brand-50 text-brand-600 transition group-hover:bg-brand-600 group-hover:text-white">
              {Icon && <Icon className="h-6 w-6" />}
            </span>
            <span className="mt-3 text-sm font-semibold text-ink">{category.name}</span>
            <span className="mt-1 text-xs text-muted">
              {category.count} {category.count === 1 ? "service" : "services"}
            </span>
          </Link>
        );
      })}
    </div>
  );
}
