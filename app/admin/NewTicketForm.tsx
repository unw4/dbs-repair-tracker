"use client";

import { useState, useRef } from "react";
import { createTicket } from "@/lib/actions";
import { JOB_TYPES } from "@/lib/constants";

export default function NewTicketForm() {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    const fd = new FormData(e.currentTarget);
    const customerName = fd.get("customerName") as string;
    const deviceModel = fd.get("deviceModel") as string;
    const jobType = fd.get("jobType") as string;
    const phone = (fd.get("phone") as string) || undefined;
    const notes = (fd.get("notes") as string) || undefined;
    await createTicket(customerName, deviceModel, jobType, phone, notes);
    formRef.current?.reset();
    setLoading(false);
    setOpen(false);
  }

  return (
    <div className="border-2 border-brand-dark mb-6">
      <button
        onClick={() => setOpen((v) => !v)}
        className="w-full bg-brand-dark text-white px-4 py-2 text-left font-bold tracking-widest uppercase hover:bg-brand-hover transition-colors"
      >
        {open ? "▲ İptal" : "+ Yeni Form"}
      </button>

      {open && (
        <form ref={formRef} onSubmit={handleSubmit} className="p-4 bg-white">
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-5">
            <div>
              <label className="block text-xs font-bold uppercase mb-1 tracking-wider text-brand-dark">
                Müşteri Adı
              </label>
              <input
                name="customerName"
                required
                className="w-full border border-brand-border px-3 py-2 text-sm focus:outline-none focus:border-brand-dark text-brand-dark"
                placeholder="Ahmet Yılmaz"
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase mb-1 tracking-wider text-brand-dark">
                Cihaz Modeli
              </label>
              <input
                name="deviceModel"
                required
                className="w-full border border-brand-border px-3 py-2 text-sm focus:outline-none focus:border-brand-dark text-brand-dark"
                placeholder="MacBook Pro 2021"
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase mb-1 tracking-wider text-brand-dark">
                Yapılacak İşlem
              </label>
              <select
                name="jobType"
                required
                defaultValue="Servis"
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
                className="w-full border border-brand-border px-3 py-2 text-sm focus:outline-none focus:border-brand-dark text-brand-dark"
                placeholder="05XX XXX XX XX"
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase mb-1 tracking-wider text-brand-dark">
                Notlar
              </label>
              <input
                name="notes"
                className="w-full border border-brand-border px-3 py-2 text-sm focus:outline-none focus:border-brand-dark text-brand-dark"
                placeholder="İsteğe bağlı notlar"
              />
            </div>
          </div>
          <div className="mt-3">
            <button
              type="submit"
              disabled={loading}
              className="bg-brand-dark text-white px-6 py-2 text-sm font-bold uppercase tracking-widest hover:bg-brand-hover disabled:opacity-50 transition-colors"
            >
              {loading ? "Oluşturuluyor…" : "Form Oluştur"}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
