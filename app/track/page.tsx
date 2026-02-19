"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { IconWrench } from "@/app/components/Icons";
import TrackFooter from "@/app/components/TrackFooter";

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
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col">
      {/* Navbar */}
      <header className="bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between shadow-sm">
        <img
          src="/logo.png"
          alt="Denizli Bilgisayar Sistemleri"
          className="h-9 w-auto"
        />
        <a
          href="/admin"
          className="text-xs text-brand-muted hover:text-brand-dark font-medium transition-colors"
        >
          Yönetim Paneli →
        </a>
      </header>

      {/* Main */}
      <main className="flex-1 flex items-center justify-center px-4 py-16">
        <div className="w-full max-w-md">
          {/* İkon + başlık */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-brand-light mb-4">
              <IconWrench className="w-7 h-7 text-brand-dark" />
            </div>
            <h1 className="text-2xl font-bold text-brand-dark">
              Servis Durumu Sorgula
            </h1>
            <p className="text-sm text-brand-muted mt-1.5">
              Cihazınızın servis durumunu öğrenin
            </p>
          </div>

          {/* Kart */}
          <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-6">
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <div>
                <label className="block text-sm font-semibold text-brand-dark mb-1.5">
                  Takip Numarası
                </label>
                <input
                  type="text"
                  value={trackingNo}
                  onChange={(e) => {
                    setTrackingNo(e.target.value);
                    setError(false);
                  }}
                  placeholder="Takip numaranızı yapıştırın"
                  className={`w-full rounded-lg border px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-light transition-all text-brand-dark placeholder:text-gray-400 ${
                    error
                      ? "border-red-300 bg-red-50"
                      : "border-gray-200 focus:border-brand"
                  }`}
                />
                {error && (
                  <p className="text-xs text-red-500 mt-1.5">
                    ⚠ Takip numarası boş olamaz.
                  </p>
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

          <p className="text-center text-xs text-gray-400 mt-4">
            Takip numaranız teknik servis tarafından verilir
          </p>
        </div>
      </main>

      <TrackFooter />
    </div>
  );
}
