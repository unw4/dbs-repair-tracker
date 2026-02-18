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

export default function EditTicketModal({
  id,
  customerName,
  deviceModel,
  jobType,
  phone,
  notes,
}: Props) {
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

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="text-xs font-bold uppercase tracking-wider text-brand-hover hover:text-brand-dark underline hover:no-underline"
      >
        Düzenle
      </button>

      {open && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
          onClick={(e) => { if (e.target === e.currentTarget) setOpen(false); }}
        >
          <div className="bg-white border-2 border-brand-dark w-full max-w-lg mx-4">
            <div className="bg-brand-dark text-white px-4 py-3 flex items-center justify-between">
              <span className="font-bold uppercase tracking-widest text-sm">
                Formu Düzenle
              </span>
              <button
                onClick={() => setOpen(false)}
                className="text-brand-border hover:text-white transition-colors text-lg leading-none"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-4">
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div>
                  <label className="block text-xs font-bold uppercase mb-1 tracking-wider text-brand-dark">
                    Müşteri Adı
                  </label>
                  <input
                    name="customerName"
                    required
                    defaultValue={customerName}
                    className="w-full border border-brand-border px-3 py-2 text-sm focus:outline-none focus:border-brand-dark text-brand-dark"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase mb-1 tracking-wider text-brand-dark">
                    Cihaz Modeli
                  </label>
                  <input
                    name="deviceModel"
                    required
                    defaultValue={deviceModel}
                    className="w-full border border-brand-border px-3 py-2 text-sm focus:outline-none focus:border-brand-dark text-brand-dark"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase mb-1 tracking-wider text-brand-dark">
                    Yapılacak İşlem
                  </label>
                  <select
                    name="jobType"
                    required
                    defaultValue={jobType}
                    className="w-full border border-brand-border px-3 py-2 text-sm focus:outline-none focus:border-brand-dark text-brand-dark bg-white cursor-pointer"
                  >
                    {JOB_TYPES.map((j) => (
                      <option key={j} value={j}>
                        {j}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase mb-1 tracking-wider text-brand-dark">
                    Telefon
                  </label>
                  <input
                    name="phone"
                    type="tel"
                    defaultValue={phone ?? ""}
                    className="w-full border border-brand-border px-3 py-2 text-sm focus:outline-none focus:border-brand-dark text-brand-dark"
                    placeholder="05XX XXX XX XX"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold uppercase mb-1 tracking-wider text-brand-dark">
                    Notlar
                  </label>
                  <textarea
                    name="notes"
                    defaultValue={notes ?? ""}
                    rows={3}
                    className="w-full border border-brand-border px-3 py-2 text-sm focus:outline-none focus:border-brand-dark text-brand-dark resize-none"
                    placeholder="İsteğe bağlı notlar"
                  />
                </div>
              </div>

              <div className="mt-4 flex gap-2 justify-end">
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="px-4 py-2 text-sm font-bold uppercase tracking-wider border-2 border-brand-border text-brand-muted hover:border-brand-dark hover:text-brand-dark transition-colors"
                >
                  İptal
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-6 py-2 text-sm font-bold uppercase tracking-widest bg-brand-dark text-white hover:bg-brand-hover disabled:opacity-50 transition-colors"
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
