import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { STATUSES, STATUS_LABELS } from "@/lib/constants";
import { logoutAction } from "./login/actions";
import {
  IconFolder,
  IconInbox,
  IconWrench,
  IconHourglass,
  IconCheck,
  IconPackage,
  IconAlert,
} from "@/app/components/Icons";
import NewTicketForm from "./NewTicketForm";
import SearchBar from "./SearchBar";
import DarkModeToggle from "@/app/components/DarkModeToggle";
import TicketExpandRow from "./TicketExpandRow";
import type { ReactNode } from "react";


const FOLDER_ICONS: Record<string, ReactNode> = {
  Received: <IconInbox className="w-4 h-4 flex-shrink-0" />,
  "In Progress": <IconWrench className="w-4 h-4 flex-shrink-0" />,
  "Waiting for Parts": <IconHourglass className="w-4 h-4 flex-shrink-0" />,
  Ready: <IconCheck className="w-4 h-4 flex-shrink-0" />,
  Delivered: <IconPackage className="w-4 h-4 flex-shrink-0" />,
};

export const dynamic = "force-dynamic";

export default async function AdminPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string; q?: string }>;
}) {
  const { status, q } = await searchParams;
  const activeStatus = status && status !== "all" ? status : null;
  const showOverdue = status === "overdue";
  const query = q?.trim().toLowerCase().slice(0, 100) ?? "";

  const allTickets = await prisma.ticket.findMany({ orderBy: { createdAt: "desc" } });

  const THREE_DAYS_MS = 3 * 24 * 60 * 60 * 1000;
  const now = Date.now();

  const isOverdue = (t: (typeof allTickets)[number]) =>
    (t.status === "Received" || t.status === "In Progress") &&
    now - new Date(t.updatedAt).getTime() > THREE_DAYS_MS;

  const overdueTickets = allTickets.filter(isOverdue);

  const statusFiltered = showOverdue
    ? overdueTickets
    : activeStatus
    ? allTickets.filter((t) => t.status === activeStatus)
    : allTickets;

  const displayed = query
    ? statusFiltered.filter((t) =>
        [t.id, t.customerName, t.deviceModel, t.jobType, t.phone ?? "", t.notes ?? "", STATUS_LABELS[t.status] ?? t.status]
          .join(" ").toLowerCase().includes(query)
      )
    : statusFiltered;

  const counts = STATUSES.reduce(
    (acc, s) => { acc[s] = allTickets.filter((t) => t.status === s).length; return acc; },
    {} as Record<string, number>
  );

  const tableLabel = showOverdue
    ? "3 Gün+ Bekleyen"
    : activeStatus
    ? (STATUS_LABELS[activeStatus] ?? activeStatus)
    : "Tüm Formlar";

  return (
    <div className="min-h-screen bg-[#F8FAFC] dark:bg-slate-900 flex flex-col transition-colors">
      {/* Üst Bar */}
      <header className="bg-brand-dark text-white px-6 py-4 flex items-center justify-between shadow-md">
        <h1 className="text-base font-bold tracking-wide">Servis Takip</h1>
        <div className="flex items-center gap-3">
          <DarkModeToggle className="text-brand-border hover:text-white hover:bg-white/10" />
          <span className="text-xs text-brand-border font-medium">Yönetim Paneli</span>
          <form action={logoutAction}>
            <button
              type="submit"
              className="text-xs text-brand-border hover:text-white border border-brand-border hover:border-white px-3 py-1 rounded-lg transition-colors"
            >
              Çıkış
            </button>
          </form>
        </div>
      </header>

      <div className="flex-1 p-5 flex flex-col gap-5">
        <NewTicketForm />

        <div className="flex gap-4 items-start">
          {/* Form Tablosu */}
          <div className="flex-1 bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-gray-100 dark:border-slate-700 min-w-0 overflow-hidden">
            <div className="px-4 py-3 flex items-center justify-between gap-4 border-b border-gray-100 dark:border-slate-700">
              <h2 className="font-semibold text-sm text-brand-dark dark:text-slate-100 whitespace-nowrap">
                {tableLabel}{" "}
                <span className="text-gray-400 dark:text-slate-500 font-normal">({displayed.length})</span>
              </h2>
              <div className="w-72">
                <SearchBar />
              </div>
            </div>

            {displayed.length === 0 ? (
              <div className="px-4 py-12 text-center text-gray-400 dark:text-slate-500 text-sm">
                Bu kategoride henüz form yok.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-100 dark:border-slate-700 bg-gray-50 dark:bg-slate-700/50">
                      {["No", "Müşteri", "Telefon", "Cihaz", "İşlem", "Durum", "Güncellendi", "Takip"].map((h, i) => (
                        <th key={i} className="text-left px-4 py-2.5 text-xs font-semibold text-gray-400 dark:text-slate-500 uppercase tracking-wider">
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {displayed.map((ticket) => (
                      <TicketExpandRow
                        key={ticket.id}
                        ticket={ticket}
                        isOverdue={isOverdue(ticket)}
                      />
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Sağ Sidebar */}
          <div className="w-56 flex-shrink-0 bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-gray-100 dark:border-slate-700 overflow-hidden">
            <div className="px-3 py-2.5 border-b border-gray-100 dark:border-slate-700">
              <span className="text-xs font-semibold text-gray-400 dark:text-slate-500 uppercase tracking-wider">
                Klasörler
              </span>
            </div>

            {/* 3 Gün+ klasörü */}
            <Link
              href="/admin?status=overdue"
              className={`flex items-center justify-between px-3 py-2.5 border-b border-gray-50 dark:border-slate-700/50 transition-colors ${
                showOverdue
                  ? "bg-orange-50 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400"
                  : "text-gray-500 dark:text-slate-400 hover:bg-gray-50 dark:hover:bg-slate-700/50"
              }`}
            >
              <div className="flex items-center gap-2">
                <IconAlert className="w-4 h-4 flex-shrink-0 text-orange-500" />
                <span className="text-xs font-semibold">3 Gün+</span>
              </div>
              <span className="text-xs font-bold tabular-nums text-orange-500">
                {overdueTickets.length}
              </span>
            </Link>

            {/* Tümü */}
            <Link
              href="/admin"
              className={`flex items-center justify-between px-3 py-2.5 border-b border-gray-50 dark:border-slate-700/50 transition-colors ${
                !activeStatus && !showOverdue
                  ? "bg-brand-subtle dark:bg-slate-700 text-brand-dark dark:text-slate-100"
                  : "text-gray-500 dark:text-slate-400 hover:bg-gray-50 dark:hover:bg-slate-700/50"
              }`}
            >
              <div className="flex items-center gap-2">
                <IconFolder className="w-4 h-4 flex-shrink-0" />
                <span className="text-xs font-semibold">Tümü</span>
              </div>
              <span className="text-xs font-bold text-gray-400 dark:text-slate-500 tabular-nums">
                {allTickets.length}
              </span>
            </Link>

            {STATUSES.map((s) => {
              const isActive = !showOverdue && activeStatus === s;
              return (
                <Link
                  key={s}
                  href={`/admin?status=${encodeURIComponent(s)}`}
                  className={`flex items-center justify-between px-3 py-2.5 border-b border-gray-50 dark:border-slate-700/50 last:border-b-0 transition-colors ${
                    isActive
                      ? "bg-brand-subtle dark:bg-slate-700 text-brand-dark dark:text-slate-100"
                      : "text-gray-500 dark:text-slate-400 hover:bg-gray-50 dark:hover:bg-slate-700/50"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    {FOLDER_ICONS[s]}
                    <span className="text-xs font-semibold leading-tight">{STATUS_LABELS[s]}</span>
                  </div>
                  <span className="text-xs font-bold text-gray-400 dark:text-slate-500 tabular-nums flex-shrink-0">
                    {counts[s] ?? 0}
                  </span>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
