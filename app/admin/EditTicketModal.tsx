"use client";

import { useState } from "react";
import { updateTicket } from "@/lib/actions";
import { JOB_TYPES } from "@/lib/constants";

interface Props {
  id: string;
  customerName: string;
  deviceModel: string;
  jobType: string;
  phone?: string | null;
  notes?: string | null;
}

export default function EditTicketModal({ id, customerName, deviceModel, jobType, phone, notes }: Props) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    const fd = new FormData(e.currentTarget);
    await updateTicket(
      id,
      fd.get("customerName") as string,
      fd.get("deviceModel") as string,
      fd.get("jobType") as string,
      (fd.get("phone") as string) || undefined,
      (fd.get("notes") as string) || undefined
    );
    setLoading(false);
    setOpen(false);
  }

  const inputCls = "w-full rounded-lg border border-gray-200 dark:border-slate-600 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-light text-brand-dark dark:text-slate-100 bg-white dark:bg-slate-700 transition-all";
  const labelCls = "block text-xs font-semibold text-gray-500 dark:text-slate-400 uppercase tracking-wider mb-1.5";

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg border border-gray-200 dark:border-slate-600 text-gray-400 dark:text-slate-500 hover:text-brand-dark dark:hover:text-slate-200 hover:border-gray-300 dark:hover:border-slate-500 hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors"
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="13" height="13" aria-hidden="true">
          <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
          <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
        </svg>
        Düzenle
      </button>

      {open && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm"
          onClick={(e) => { if (e.target === e.currentTarget) setOpen(false); }}
        >
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-gray-100 dark:border-slate-700 w-full max-w-lg mx-4 overflow-hidden">
            <div className="bg-brand-dark text-white px-5 py-4 flex items-center justify-between">
              <span className="font-semibold text-sm">Formu Düzenle</span>
              <button onClick={() => setOpen(false)} className="text-brand-border hover:text-white transition-colors text-xl leading-none">×</button>
            </div>

            <form onSubmit={handleSubmit} className="p-5">
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div>
                  <label className={labelCls}>Müşteri Adı</label>
                  <input name="customerName" required defaultValue={customerName} className={inputCls} />
                </div>
                <div>
                  <label className={labelCls}>Cihaz Modeli</label>
                  <input name="deviceModel" required defaultValue={deviceModel} className={inputCls} />
                </div>
                <div>
                  <label className={labelCls}>Yapılacak İşlem</label>
                  <select name="jobType" required defaultValue={jobType} className={inputCls + " cursor-pointer"}>
                    {JOB_TYPES.map((j) => <option key={j} value={j}>{j}</option>)}
                  </select>
                </div>
                <div>
                  <label className={labelCls}>Telefon</label>
                  <input name="phone" type="tel" defaultValue={phone ?? ""} placeholder="05XX XXX XX XX" className={inputCls} />
                </div>
                <div className="sm:col-span-2">
                  <label className={labelCls}>Notlar</label>
                  <textarea name="notes" defaultValue={notes ?? ""} rows={3} placeholder="İsteğe bağlı notlar" className={inputCls + " resize-none"} />
                </div>
              </div>

              <div className="mt-4 flex gap-2 justify-end">
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="px-4 py-2 text-sm font-semibold rounded-lg border border-gray-200 dark:border-slate-600 text-gray-500 dark:text-slate-400 hover:border-gray-300 dark:hover:border-slate-500 hover:text-brand-dark dark:hover:text-slate-200 transition-colors"
                >
                  İptal
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-5 py-2 text-sm font-semibold rounded-lg bg-brand-dark hover:bg-brand-hover text-white disabled:opacity-50 transition-colors"
                >
                  {loading ? "Kaydediliyor…" : "Kaydet"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
