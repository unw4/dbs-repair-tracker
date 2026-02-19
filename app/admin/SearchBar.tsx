"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";

export default function SearchBar() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [value, setValue] = useState(searchParams.get("q") ?? "");
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => {
      const params = new URLSearchParams(searchParams.toString());
      if (value.trim()) {
        params.set("q", value.trim());
      } else {
        params.delete("q");
      }
      router.push(`/admin?${params.toString()}`);
    }, 300);
    return () => {
      if (timer.current) clearTimeout(timer.current);
    };
  }, [value]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="relative">
      <svg
        className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
        xmlns="http://www.w3.org/2000/svg"
        width="14"
        height="14"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <circle cx="11" cy="11" r="8" />
        <path d="m21 21-4.35-4.35" />
      </svg>
      <input
        type="text"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="Müşteri, cihaz, telefon…"
        className="w-full rounded-lg border border-gray-200 pl-9 pr-8 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-light focus:border-brand text-brand-dark placeholder:text-gray-400 bg-white transition-all"
      />
      {value && (
        <button
          onClick={() => setValue("")}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-brand-dark text-lg leading-none transition-colors"
          aria-label="Temizle"
        >
          ×
        </button>
      )}
    </div>
  );
}
