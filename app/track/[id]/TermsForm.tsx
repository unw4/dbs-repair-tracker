"use client";

import { useState } from "react";
import { acceptTerms } from "@/lib/actions";

const TERMS = [
  "Sistemleriniz üzerinde bulunan LİSANSSIZ işletim sistemleri, yazılım ve programlardan servisimiz sorumlu değildir.",
  "Kullanıcı hataları, virüsler ve doğal etkenlerden kaynaklanan problemler garanti kapsamı dışındadır.",
  "Servis formundaki tüm şartlar kabul edilmiş olup daha sonra çıkabilecek olan arızalardan servisimiz sorumlu değildir.",
  "Teslim tarihinden itibaren 60 gün içinde alınmayan cihazınızdan servisimiz sorumlu değildir.",
];

export default function TermsForm({ ticketId }: { ticketId: string }) {
  const [checked, setChecked] = useState<boolean[]>(TERMS.map(() => false));
  const [loading, setLoading] = useState(false);

  const allChecked = checked.every(Boolean);

  const toggle = (i: number) => {
    setChecked((prev) => prev.map((v, idx) => (idx === i ? !v : v)));
  };

  const handleSubmit = async () => {
    if (!allChecked) return;
    setLoading(true);
    await acceptTerms(ticketId);
    window.location.reload();
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] dark:bg-slate-900 flex items-center justify-center px-4 py-10">
      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-700 p-6 max-w-lg w-full flex flex-col gap-5">
        <div>
          <h1 className="text-base font-bold text-brand-dark dark:text-slate-100 mb-1">
            Servis Şartları
          </h1>
          <p className="text-xs text-gray-400 dark:text-slate-500">
            Takip sayfasına erişmeden önce aşağıdaki maddeleri tek tek onaylayın.
          </p>
        </div>

        <div className="flex flex-col gap-3">
          {TERMS.map((term, i) => (
            <label
              key={i}
              className="flex items-start gap-3 cursor-pointer group"
            >
              <div className="relative flex-shrink-0 mt-0.5">
                <input
                  type="checkbox"
                  checked={checked[i]}
                  onChange={() => toggle(i)}
                  className="sr-only"
                />
                <div
                  className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${
                    checked[i]
                      ? "bg-brand-dark border-brand-dark"
                      : "border-gray-300 dark:border-slate-600 group-hover:border-brand-dark"
                  }`}
                >
                  {checked[i] && (
                    <svg className="w-3 h-3 text-white" viewBox="0 0 12 12" fill="none">
                      <path d="M2 6l3 3 5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  )}
                </div>
              </div>
              <span className="text-sm text-brand-dark dark:text-slate-200 leading-snug">
                <span className="font-semibold text-gray-400 dark:text-slate-500 mr-1">{i + 1}.</span>
                {term}
              </span>
            </label>
          ))}
        </div>

        <button
          onClick={handleSubmit}
          disabled={!allChecked || loading}
          className="w-full py-2.5 rounded-xl text-sm font-semibold transition-colors disabled:opacity-40 disabled:cursor-not-allowed bg-brand-dark text-white hover:opacity-90"
        >
          {loading ? "Kaydediliyor…" : "Okudum, Onaylıyorum"}
        </button>
      </div>
    </div>
  );
}
