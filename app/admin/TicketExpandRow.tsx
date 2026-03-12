"use client";

import { useState } from "react";
import StatusSelect from "./StatusSelect";
import EditTicketModal from "./EditTicketModal";
import DeleteTicketButton from "./DeleteTicketButton";
import { IconAlert } from "@/app/components/Icons";
import { STATUS_LABELS } from "@/lib/constants";

const STATUS_BADGE: Record<string, string> = {
  Received: "bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300",
  "In Progress": "bg-yellow-50 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300",
  "Waiting for Parts": "bg-orange-50 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300",
  Ready: "bg-green-50 text-green-700 dark:bg-green-900/30 dark:text-green-300",
  Delivered: "bg-gray-100 text-gray-500 dark:bg-slate-700 dark:text-slate-400",
};

type Props = {
  ticket: {
    id: string;
    customerName: string;
    deviceModel: string;
    status: string;
    jobType: string;
    phone: string | null;
    notes: string | null;
    termsAccepted: boolean;
    termsAcceptedAt: Date | null;
    createdAt: Date;
    updatedAt: Date;
  };
  isOverdue: boolean;
};

function daysSince(date: Date): number {
  return Math.floor((Date.now() - new Date(date).getTime()) / (1000 * 60 * 60 * 24));
}

function formatDate(date: Date) {
  return new Date(date).toLocaleDateString("tr-TR", {
    day: "numeric", month: "long", year: "numeric",
    hour: "2-digit", minute: "2-digit",
    timeZone: "Europe/Istanbul",
  });
}

function ChevronIcon({ open }: { open: boolean }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      width="12"
      height="12"
      className={`transition-transform duration-200 flex-shrink-0 ${open ? "rotate-90" : ""}`}
      aria-hidden="true"
    >
      <polyline points="9 18 15 12 9 6" />
    </svg>
  );
}

export default function TicketExpandRow({ ticket, isOverdue }: Props) {
  const [open, setOpen] = useState(false);

  const daysOpen = daysSince(ticket.createdAt);
  const daysUpdated = daysSince(ticket.updatedAt);

  return (
    <>
      {/* Ana satır */}
      <tr
        className={`border-b border-gray-50 dark:border-slate-700/50 transition-colors cursor-pointer select-none ${
          open
            ? "bg-brand-subtle dark:bg-slate-700/50"
            : "hover:bg-gray-50 dark:hover:bg-slate-700/30"
        }`}
        onClick={() => setOpen((v) => !v)}
      >
        <td className="px-4 py-3 font-mono text-xs text-gray-400 dark:text-slate-500">
          <div className="flex items-center gap-2">
            <span className={`transition-colors ${open ? "text-brand-dark dark:text-brand" : "text-gray-300 dark:text-slate-600"}`}>
              <ChevronIcon open={open} />
            </span>
            {ticket.id.slice(0, 8)}…
          </div>
        </td>
        <td className="px-4 py-3 text-sm">
          <div className="flex items-center gap-1.5">
            {isOverdue && (
              <IconAlert className="w-3.5 h-3.5 text-orange-500 flex-shrink-0" />
            )}
            <span className="font-semibold text-brand-dark dark:text-slate-100">
              {ticket.customerName}
            </span>
          </div>
        </td>
        <td className="px-4 py-3 font-mono text-xs text-gray-400 dark:text-slate-500">
          {ticket.phone ?? "—"}
        </td>
        <td className="px-4 py-3 text-sm text-brand-muted dark:text-slate-300">
          {ticket.deviceModel}
        </td>
        <td className="px-4 py-3">
          <span className="inline-block px-2 py-0.5 text-xs font-semibold rounded-full bg-brand-subtle dark:bg-slate-700 text-brand-dark dark:text-slate-200">
            {ticket.jobType}
          </span>
        </td>
        <td className="px-4 py-3" onClick={(e) => e.stopPropagation()}>
          <div className="flex flex-col gap-1.5">
            <span className={`inline-block px-2.5 py-0.5 text-xs font-semibold rounded-full ${STATUS_BADGE[ticket.status] ?? "bg-gray-100 text-gray-500"}`}>
              {STATUS_LABELS[ticket.status] ?? ticket.status}
            </span>
            <StatusSelect id={ticket.id} current={ticket.status} jobType={ticket.jobType} />
          </div>
        </td>
        <td className="px-4 py-3 text-xs text-gray-400 dark:text-slate-500">
          {new Date(ticket.updatedAt).toLocaleDateString("tr-TR", {
            month: "short", day: "numeric", hour: "2-digit", minute: "2-digit",
            timeZone: "Europe/Istanbul",
          })}
        </td>
        <td className="px-4 py-3">
          <div className="flex flex-col gap-1">
            <a
              href={`/track/${ticket.id}`}
              target="_blank"
              onClick={(e) => e.stopPropagation()}
              className="text-xs text-gray-400 dark:text-slate-500 hover:text-brand-dark dark:hover:text-slate-200 underline underline-offset-2 hover:no-underline font-mono transition-colors"
            >
              /track/{ticket.id.slice(0, 6)}…
            </a>
            {ticket.termsAccepted ? (
              <span className="text-xs text-green-600 dark:text-green-400 font-medium">✓ Onaylandı</span>
            ) : (
              <span className="text-xs text-gray-300 dark:text-slate-600">Onay bekleniyor</span>
            )}
          </div>
        </td>
        <td className="px-4 py-3" onClick={(e) => e.stopPropagation()}>
          <EditTicketModal
            id={ticket.id}
            customerName={ticket.customerName}
            deviceModel={ticket.deviceModel}
            jobType={ticket.jobType}
            phone={ticket.phone}
            notes={ticket.notes}
          />
        </td>
        <td className="px-4 py-3" onClick={(e) => e.stopPropagation()}>
          <DeleteTicketButton id={ticket.id} />
        </td>
      </tr>

      {/* Detay paneli */}
      {open && (
        <tr className="border-b border-brand-light dark:border-slate-700">
          <td colSpan={10} className="bg-brand-subtle dark:bg-slate-800/80 px-6 py-4">
            <div className="flex gap-6 min-w-0">

              {/* Açılalı */}
              <div className="flex flex-col gap-0.5 flex-shrink-0 w-28 border-r border-brand-light dark:border-slate-600 pr-6">
                <span className="text-[10px] font-bold uppercase tracking-widest text-brand-muted dark:text-slate-500">
                  Açılalı
                </span>
                <span className={`text-2xl font-bold tabular-nums leading-none mt-0.5 ${
                  daysOpen >= 3 ? "text-orange-500" : "text-brand-dark dark:text-slate-100"
                }`}>
                  {daysOpen === 0 ? "0" : daysOpen}
                  <span className="text-sm font-semibold ml-0.5">gün</span>
                </span>
                <span className="text-[10px] text-brand-muted dark:text-slate-500 mt-1 leading-tight">
                  {formatDate(ticket.createdAt)}
                </span>
              </div>

              {/* Güncellendi */}
              <div className="flex flex-col gap-0.5 flex-shrink-0 w-28 border-r border-brand-light dark:border-slate-600 pr-6">
                <span className="text-[10px] font-bold uppercase tracking-widest text-brand-muted dark:text-slate-500">
                  Güncellendi
                </span>
                <span className="text-2xl font-bold tabular-nums leading-none mt-0.5 text-brand-dark dark:text-slate-100">
                  {daysUpdated === 0 ? "0" : daysUpdated}
                  <span className="text-sm font-semibold ml-0.5">gün</span>
                </span>
                <span className="text-[10px] text-brand-muted dark:text-slate-500 mt-1 leading-tight">
                  {formatDate(ticket.updatedAt)}
                </span>
              </div>

              {/* Sözleşme */}
              <div className="flex flex-col gap-0.5 flex-shrink-0 w-36 border-r border-brand-light dark:border-slate-600 pr-6">
                <span className="text-[10px] font-bold uppercase tracking-widest text-brand-muted dark:text-slate-500">
                  Sözleşme
                </span>
                {ticket.termsAccepted ? (
                  <>
                    <span className="text-sm font-bold text-green-600 dark:text-green-400 mt-0.5">✓ Onaylandı</span>
                    {ticket.termsAcceptedAt && (
                      <span className="text-[10px] text-brand-muted dark:text-slate-500 mt-1 leading-tight">
                        {formatDate(ticket.termsAcceptedAt)}
                      </span>
                    )}
                  </>
                ) : (
                  <span className="text-sm font-bold text-gray-400 dark:text-slate-500 mt-0.5">Bekleniyor</span>
                )}
              </div>

              {/* Notlar */}
              <div className="flex flex-col gap-0.5 flex-1 min-w-0">
                <span className="text-[10px] font-bold uppercase tracking-widest text-brand-muted dark:text-slate-500">
                  Notlar
                </span>
                {ticket.notes ? (
                  <p className="text-sm text-brand-dark dark:text-slate-200 leading-relaxed whitespace-pre-wrap mt-0.5">
                    {ticket.notes}
                  </p>
                ) : (
                  <span className="text-sm text-gray-400 dark:text-slate-500 italic mt-0.5">Not eklenmemiş</span>
                )}
              </div>

            </div>
          </td>
        </tr>
      )}
    </>
  );
}
