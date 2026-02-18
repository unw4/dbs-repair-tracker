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
    <div className="min-h-screen bg-white flex flex-col justify-between">
      {/* Üst Bar */}
      <div className="border-b-2 border-brand-dark bg-brand-dark text-white px-6 py-4 flex items-center justify-between">
        <img src="/logo.png" alt="Denizli Bilgisayar Sistemleri" className="h-10 w-auto" />
        <a
          href="/admin"
          className="text-xs text-brand-border uppercase tracking-wider hover:text-white transition-colors"
        >
          Yönetim Paneli →
        </a>
      </div>

      {/* Ortalanmış Giriş Kartı */}
      <div className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-sm">
          {/* Kart başlığı */}
          <div className="border-2 border-brand-dark bg-brand-dark text-white px-6 py-5 text-center">
            <div className="flex justify-center mb-2">
              <IconWrench className="w-8 h-8 text-brand" />
            </div>
            <h2 className="text-base font-bold tracking-widest uppercase">
              Form Sorgula
            </h2>
            <p className="text-xs text-brand-border mt-1 tracking-wider">
              Cihazınızın tamir durumunu öğrenin
            </p>
          </div>

          {/* Form */}
          <form
            onSubmit={handleSubmit}
            className="border-2 border-t-0 border-brand-dark bg-white px-6 py-6"
          >
            <label className="block text-xs font-bold uppercase tracking-widest mb-2 text-brand-dark">
              Takip No Girin
            </label>
            <input
              type="text"
              value={trackingNo}
              onChange={(e) => {
                setTrackingNo(e.target.value);
                setError(false);
              }}
              placeholder="xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
              className={`w-full border-2 px-4 py-3 text-sm font-mono focus:outline-none transition-colors text-brand-dark ${
                error
                  ? "border-brand-dark bg-brand-subtle"
                  : "border-brand-border focus:border-brand-dark"
              }`}
            />
            {error && (
              <p className="text-xs font-bold uppercase tracking-wider text-brand-dark mt-2">
                ⚠ Takip numarası boş olamaz.
              </p>
            )}

            <button
              type="submit"
              className="w-full mt-4 bg-brand-dark text-white py-3 text-sm font-bold uppercase tracking-widest hover:bg-brand-hover transition-colors border-2 border-brand-dark"
            >
              Sorgula
            </button>
          </form>

          {/* Alt not */}
          <div className="border-2 border-t-0 border-brand-dark bg-brand-subtle px-6 py-3 text-center">
            <p className="text-xs text-brand-muted uppercase tracking-wider">
              Takip numaranız teknik servis tarafından verilir
            </p>
          </div>
        </div>
      </div>
      <TrackFooter />
    </div>
  );
}
