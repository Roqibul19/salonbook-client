"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Info, Search, SearchX, SlidersHorizontal, X } from "lucide-react";
import { api } from "@/lib/api";
import { SERVICE_CATEGORIES } from "@/lib/categories";
import type { Service } from "@/types";
import ServiceCard from "./ServiceCard";
import ServiceCardSkeleton from "./ServiceCardSkeleton";

type SortOption = "" | "price_asc" | "price_desc";

export default function BrowseServices() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // filters live in the URL so they survive a page reload
  const category = searchParams.get("category") || "";
  const sort = (searchParams.get("sort") || "") as SortOption;
  const search = searchParams.get("search") || "";

  const [searchInput, setSearchInput] = useState(search);
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [reloadKey, setReloadKey] = useState(0);

  const updateParams = (changes: Record<string, string>) => {
    const params = new URLSearchParams(searchParams.toString());
    Object.entries(changes).forEach(([key, value]) => {
      if (value) params.set(key, value);
      else params.delete(key);
    });
    const query = params.toString();
    router.replace(query ? `${pathname}?${query}` : pathname, { scroll: false });
  };

  // wait until the user stops typing before searching
  useEffect(() => {
    if (searchInput.trim() === search) return;
    const timer = setTimeout(() => updateParams({ search: searchInput.trim() }), 400);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchInput, search]);

  // fetch services whenever the filters change
  useEffect(() => {
    let ignore = false;
    const params = new URLSearchParams();
    if (search) params.set("search", search);
    if (category) params.set("category", category);
    if (sort) params.set("sort", sort);

    api<Service[]>(`/services?${params.toString()}`)
      .then((data) => {
        if (!ignore) {
          setServices(data);
          setError("");
        }
      })
      .catch((err: Error) => {
        if (!ignore) setError(err.message);
      })
      .finally(() => {
        if (!ignore) setLoading(false);
      });

    return () => {
      ignore = true;
    };
  }, [search, category, sort, reloadKey]);

  // show the loader again when filters change
  const [lastQuery, setLastQuery] = useState(searchParams.toString());
  if (searchParams.toString() !== lastQuery) {
    setLastQuery(searchParams.toString());
    setLoading(true);
  }

  const hasFilters = Boolean(search || category || sort);

  const clearFilters = () => {
    setSearchInput("");
    router.replace(pathname, { scroll: false });
  };

  return (
    <div>
      {/* filter bar */}
      <div className="grid gap-3 rounded-2xl border border-line bg-white p-4 md:grid-cols-[1fr_220px_200px]">
        <label className="relative">
          <span className="sr-only">Search services</span>
          <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
          <input
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="Search services by name..."
            className="input pl-11"
          />
        </label>

        <label>
          <span className="sr-only">Filter by category</span>
          <select
            value={category}
            onChange={(e) => updateParams({ category: e.target.value })}
            className="input cursor-pointer"
          >
            <option value="">All Categories</option>
            {SERVICE_CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </label>

        <label>
          <span className="sr-only">Sort by price</span>
          <select
            value={sort}
            onChange={(e) => updateParams({ sort: e.target.value })}
            className="input cursor-pointer"
          >
            <option value="">Sort: Newest</option>
            <option value="price_asc">Price: Low to High</option>
            <option value="price_desc">Price: High to Low</option>
          </select>
        </label>
      </div>

      {/* result summary */}
      <div className="mt-5 flex flex-wrap items-center justify-between gap-3 text-sm text-muted">
        <p className="flex items-center gap-2">
          <SlidersHorizontal className="h-4 w-4" />
          {loading ? "Loading services..." : `${services.length} service${services.length === 1 ? "" : "s"} found`}
        </p>
        {hasFilters && (
          <button
            onClick={clearFilters}
            className="flex items-center gap-1 font-medium text-brand-600 hover:underline"
          >
            <X className="h-4 w-4" /> Clear filters
          </button>
        )}
      </div>

      {/* results */}
      {loading ? (
        <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <ServiceCardSkeleton key={i} />
          ))}
        </div>
      ) : error ? (
        <div className="mt-10 flex flex-col items-center rounded-2xl border border-red-100 bg-red-50 p-10 text-center">
          <Info className="h-8 w-8 text-red-500" />
          <p className="mt-3 font-medium text-red-700">{error}</p>
          <button
            onClick={() => {
              setLoading(true);
              setReloadKey((k) => k + 1);
            }}
            className="btn-primary mt-5"
          >
            Try again
          </button>
        </div>
      ) : services.length === 0 ? (
        <div className="mt-10 flex flex-col items-center rounded-2xl border border-line bg-white p-12 text-center">
          <SearchX className="h-10 w-10 text-brand-300" />
          <h3 className="mt-4 text-xl font-semibold text-ink">No services found</h3>
          <p className="mt-1 text-sm text-muted">Try a different name or category.</p>
        </div>
      ) : (
        <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((service) => (
            <ServiceCard key={service._id} service={service} />
          ))}
        </div>
      )}
    </div>
  );
}
