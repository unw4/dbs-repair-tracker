"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { IconWrench } from "@/app/components/Icons";
import TrackFooter from "@/app/components/TrackFooter";
import DarkModeToggle from "@/app/components/DarkModeToggle";

export default function TrackLandingPage() {
  const [trackingNo, setTrackingNo] = useState("");
  const [error, setError] = useState(false);
  const router = useRouter();

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = trackingNo.trim();
    if (!trimmed) {
      setError(true);
      return;
    }
    setError(false);
    router.push(`/track/${trimmed}`);
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] dark:bg-slate-900 flex flex-col transition-colors">
      {/* Navbar */}
      <header className="bg-white dark:bg-slate-800 border-b border-gray-100 dark:border-slate-700 px-6 py-4 flex items-center justify-between shadow-sm">
        <img src="/logo.png" alt="Denizli Bilgisayar Sistemleri" className="h-9 w-auto" />
        <div className="flex items-center gap-2">
          <DarkModeToggle className="text-gray-400 dark:text-slate-400 hover:bg-gray-100 dark:hover:bg-slate-700" />
          <a
            href="/admin"
            className="text-xs text-brand-muted hover:text-brand-dark dark:text-slate-400 dark:hover:text-slate-100 font-medium transition-colors"
          >
            Yönetim Paneli →
          </a>
        </div>
      </header>

      {/* Main */}
      <main className="flex-1 flex items-center justify-center px-4 py-16">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-brand-light dark:bg-slate-700 mb-4">
              <IconWrench className="w-7 h-7 text-brand-dark dark:text-brand" />
            </div>
            <h1 className="text-2xl font-bold text-brand-dark dark:text-slate-100">
              Servis Durumu Sorgula
            </h1>
            <p className="text-sm text-brand-muted dark:text-slate-400 mt-1.5">
              Cihazınızın servis durumunu öğrenin
            </p>
          </div>

          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-md border border-gray-100 dark:border-slate-700 p-6">
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <div>
                <label className="block text-sm font-semibold text-brand-dark dark:text-slate-200 mb-1.5">
                  Takip Numarası
                </label>
                <input
                  type="text"
                  value={trackingNo}
                  onChange={(e) => { setTrackingNo(e.target.value); setError(false); }}
                  placeholder="Takip numaranızı yapıştırın"
                  className={`w-full rounded-lg border px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-light transition-all text-brand-dark dark:text-slate-100 placeholder:text-gray-400 dark:placeholder:text-slate-500 bg-white dark:bg-slate-700 ${
                    error
                      ? "border-red-300 bg-red-50 dark:border-red-500 dark:bg-red-900/20"
                      : "border-gray-200 dark:border-slate-600 focus:border-brand"
                  }`}
                />
                {error && (
                  <p className="text-xs text-red-500 mt-1.5">⚠ Takip numarası boş olamaz.</p>
                )}
              </div>
              <button
                type="submit"
                className="w-full bg-brand-dark hover:bg-brand-hover text-white py-3 rounded-lg text-sm font-semibold transition-colors"
              >
                Sorgula →
              </button>
            </form>
          </div>

          <p className="text-center text-xs text-gray-400 dark:text-slate-500 mt-4">
            Takip numaranız teknik servis tarafından verilir
          </p>
        </div>
      </main>

      <TrackFooter />
    </div>
  );
}
