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
            ? "bg-brand-subtle/60 dark:bg-slate-700/40"
            : "hover:bg-gray-50 dark:hover:bg-slate-700/30"
        }`}
        onClick={() => setOpen((v) => !v)}
      >
        <td className="px-4 py-3 font-mono text-xs text-gray-400 dark:text-slate-500">
          <div className="flex items-center gap-1.5">
            <span
              className={`transition-transform duration-200 text-gray-300 dark:text-slate-600 ${open ? "rotate-90" : ""}`}
            >
              ▶
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

      {/* Detay satırı */}
      {open && (
        <tr className="border-b border-gray-100 dark:border-slate-700 bg-gray-50/80 dark:bg-slate-800/60">
          <td colSpan={10} className="px-6 py-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs">

              {/* Kaç gündür açık */}
              <div className="flex flex-col gap-1">
                <span className="text-gray-400 dark:text-slate-500 uppercase tracking-wider font-semibold text-[10px]">
                  Açılalı
                </span>
                <span className={`font-bold text-sm ${daysOpen >= 3 ? "text-orange-500" : "text-brand-dark dark:text-slate-100"}`}>
                  {daysOpen === 0 ? "Bugün" : `${daysOpen} gün`}
                </span>
                <span className="text-gray-400 dark:text-slate-500 text-[10px]">
                  {formatDate(ticket.createdAt)}
                </span>
              </div>

              {/* Son güncelleme */}
              <div className="flex flex-col gap-1">
                <span className="text-gray-400 dark:text-slate-500 uppercase tracking-wider font-semibold text-[10px]">
                  Son Güncelleme
                </span>
                <span className="font-bold text-sm text-brand-dark dark:text-slate-100">
                  {daysUpdated === 0 ? "Bugün" : `${daysUpdated} gün önce`}
                </span>
                <span className="text-gray-400 dark:text-slate-500 text-[10px]">
                  {formatDate(ticket.updatedAt)}
                </span>
              </div>

              {/* Sözleşme */}
              <div className="flex flex-col gap-1">
                <span className="text-gray-400 dark:text-slate-500 uppercase tracking-wider font-semibold text-[10px]">
                  Sözleşme
                </span>
                {ticket.termsAccepted ? (
                  <>
                    <span className="font-bold text-sm text-green-600 dark:text-green-400">✓ Onaylandı</span>
                    {ticket.termsAcceptedAt && (
                      <span className="text-gray-400 dark:text-slate-500 text-[10px]">
                        {formatDate(ticket.termsAcceptedAt)}
                      </span>
                    )}
                  </>
                ) : (
                  <span className="font-bold text-sm text-gray-400 dark:text-slate-500">Bekleniyor</span>
                )}
              </div>

              {/* Notlar */}
              <div className="flex flex-col gap-1 md:col-span-1">
                <span className="text-gray-400 dark:text-slate-500 uppercase tracking-wider font-semibold text-[10px]">
                  Notlar
                </span>
                {ticket.notes ? (
                  <p className="text-brand-dark dark:text-slate-200 leading-relaxed whitespace-pre-wrap">
                    {ticket.notes}
                  </p>
                ) : (
                  <span className="text-gray-300 dark:text-slate-600 italic">Not eklenmemiş</span>
                )}
              </div>

            </div>
          </td>
        </tr>
      )}
    </>
  );
}
