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
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 mb-5 overflow-hidden">
      <button
        onClick={() => setOpen((v) => !v)}
        className="w-full bg-brand-dark hover:bg-brand-hover text-white px-5 py-3 text-left text-sm font-semibold transition-colors flex items-center gap-2"
      >
        <span className="text-lg leading-none">{open ? "−" : "+"}</span>
        {open ? "İptal" : "Yeni Form Oluştur"}
      </button>

      {open && (
        <form ref={formRef} onSubmit={handleSubmit} className="p-5">
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-5">
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
                Müşteri Adı
              </label>
              <input
                name="customerName"
                required
                className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-light focus:border-brand text-brand-dark transition-all"
                placeholder="Ahmet Yılmaz"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
                Cihaz Modeli
              </label>
              <input
                name="deviceModel"
                required
                className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-light focus:border-brand text-brand-dark transition-all"
                placeholder="MacBook Pro 2021"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
                Yapılacak İşlem
              </label>
              <select
                name="jobType"
                required
                defaultValue="Servis"
                className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-light focus:border-brand text-brand-dark bg-white cursor-pointer transition-all"
              >
                {JOB_TYPES.map((j) => (
                  <option key={j} value={j}>
                    {j}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
                Telefon
              </label>
              <input
                name="phone"
                type="tel"
                className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-light focus:border-brand text-brand-dark transition-all"
                placeholder="05XX XXX XX XX"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
                Notlar
              </label>
              <input
                name="notes"
                className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-light focus:border-brand text-brand-dark transition-all"
                placeholder="İsteğe bağlı"
              />
            </div>
          </div>
          <div className="mt-4">
            <button
              type="submit"
              disabled={loading}
              className="bg-brand-dark hover:bg-brand-hover text-white px-6 py-2.5 rounded-lg text-sm font-semibold disabled:opacity-50 transition-colors"
            >
              {loading ? "Oluşturuluyor…" : "Form Oluştur"}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
