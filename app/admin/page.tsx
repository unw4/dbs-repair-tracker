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
} from "@/app/components/Icons";
import NewTicketForm from "./NewTicketForm";
import StatusSelect from "./StatusSelect";
import SearchBar from "./SearchBar";
import EditTicketModal from "./EditTicketModal";
import type { ReactNode } from "react";

const STATUS_COLORS: Record<string, string> = {
  Received: "bg-brand-light border border-brand",
  "In Progress": "bg-yellow-100 border border-yellow-500",
  "Waiting for Parts": "bg-orange-100 border border-orange-500",
  Ready: "bg-green-100 border border-green-600",
  Delivered: "bg-brand-subtle border border-brand-muted",
};

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
  const query = q?.trim().toLowerCase() ?? "";

  const allTickets = await prisma.ticket.findMany({
    orderBy: { createdAt: "desc" },
  });

  const statusFiltered = activeStatus
    ? allTickets.filter((t) => t.status === activeStatus)
    : allTickets;

  const displayed = query
    ? statusFiltered.filter((t) =>
        [
          t.id,
          t.customerName,
          t.deviceModel,
          t.jobType,
          t.phone ?? "",
          t.notes ?? "",
          STATUS_LABELS[t.status] ?? t.status,
        ]
          .join(" ")
          .toLowerCase()
          .includes(query)
      )
    : statusFiltered;

  const counts = STATUSES.reduce(
    (acc, s) => {
      acc[s] = allTickets.filter((t) => t.status === s).length;
      return acc;
    },
    {} as Record<string, number>
  );

  const tableLabel = activeStatus
    ? (STATUS_LABELS[activeStatus] ?? activeStatus)
    : "Tüm Formlar";

  return (
    <div className="min-h-screen bg-white p-6">
      {/* Üst Bar */}
      <div className="border-2 border-brand-dark mb-6 flex items-center justify-between px-4 py-3 bg-brand-dark text-white">
        <h1 className="text-xl font-bold tracking-widest uppercase">
          Tamir Takip
        </h1>
        <div className="flex items-center gap-4">
          <span className="text-xs text-brand-border uppercase tracking-wider">
            Yönetim Paneli
          </span>
          <form action={logoutAction}>
            <button
              type="submit"
              className="text-xs text-brand-border uppercase tracking-wider hover:text-white border border-brand-border hover:border-white px-2 py-1 transition-colors"
            >
              Çıkış
            </button>
          </form>
        </div>
      </div>

      {/* Yeni Form */}
      <NewTicketForm />

      {/* Ana Alan: Tablo + Sağ Sidebar */}
      <div className="flex gap-4 items-start">
        {/* Form Tablosu */}
        <div className="flex-1 border-2 border-brand-dark min-w-0">
          <div className="bg-brand-light border-b-2 border-brand-dark px-4 py-2 flex items-center justify-between gap-4">
            <h2 className="font-bold uppercase tracking-widest text-sm text-brand-dark whitespace-nowrap">
              {tableLabel} ({displayed.length})
            </h2>
            <div className="w-72">
              <SearchBar />
            </div>
          </div>

          {displayed.length === 0 ? (
            <div className="px-4 py-8 text-center text-brand-muted text-sm uppercase tracking-wider">
              Bu kategoride henüz form yok.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-brand-border bg-brand-subtle">
                    <th className="text-left px-4 py-2 font-bold uppercase text-xs tracking-wider text-brand-dark">
                      No
                    </th>
                    <th className="text-left px-4 py-2 font-bold uppercase text-xs tracking-wider text-brand-dark">
                      Müşteri
                    </th>
                    <th className="text-left px-4 py-2 font-bold uppercase text-xs tracking-wider text-brand-dark">
                      Telefon
                    </th>
                    <th className="text-left px-4 py-2 font-bold uppercase text-xs tracking-wider text-brand-dark">
                      Cihaz
                    </th>
                    <th className="text-left px-4 py-2 font-bold uppercase text-xs tracking-wider text-brand-dark">
                      İşlem
                    </th>
                    <th className="text-left px-4 py-2 font-bold uppercase text-xs tracking-wider text-brand-dark">
                      Durum
                    </th>
                    <th className="text-left px-4 py-2 font-bold uppercase text-xs tracking-wider text-brand-dark">
                      Güncellendi
                    </th>
                    <th className="text-left px-4 py-2 font-bold uppercase text-xs tracking-wider text-brand-dark">
                      Takip
                    </th>
                    <th className="text-left px-4 py-2 font-bold uppercase text-xs tracking-wider text-brand-dark">
                      Düzenle
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {displayed.map((ticket, i) => (
                    <tr
                      key={ticket.id}
                      className={`border-b border-brand-border ${i % 2 === 0 ? "bg-white" : "bg-brand-subtle"}`}
                    >
                      <td className="px-4 py-3 font-mono text-xs text-brand-muted">
                        {ticket.id.slice(0, 8)}…
                      </td>
                      <td className="px-4 py-3 font-semibold text-brand-dark">
                        {ticket.customerName}
                      </td>
                      <td className="px-4 py-3 font-mono text-xs text-brand-muted">
                        {ticket.phone ?? "—"}
                      </td>
                      <td className="px-4 py-3 text-brand-hover">
                        {ticket.deviceModel}
                      </td>
                      <td className="px-4 py-3">
                        <span className="inline-block px-2 py-0.5 text-xs font-bold uppercase tracking-wider bg-brand-light border border-brand text-brand-dark">
                          {ticket.jobType}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex flex-col gap-1">
                          <span
                            className={`inline-block px-2 py-0.5 text-xs font-bold uppercase tracking-wider ${STATUS_COLORS[ticket.status] ?? "bg-brand-light border border-brand"}`}
                          >
                            {STATUS_LABELS[ticket.status] ?? ticket.status}
                          </span>
                          <StatusSelect
                            id={ticket.id}
                            current={ticket.status}
                          />
                        </div>
                      </td>
                      <td className="px-4 py-3 text-xs text-brand-muted">
                        {new Date(ticket.updatedAt).toLocaleDateString(
                          "tr-TR",
                          {
                            month: "short",
                            day: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          }
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <a
                          href={`/track/${ticket.id}`}
                          target="_blank"
                          className="text-xs underline hover:no-underline font-mono text-brand-muted hover:text-brand-dark"
                        >
                          /track/{ticket.id.slice(0, 8)}…
                        </a>
                      </td>
                      <td className="px-4 py-3">
                        <EditTicketModal
                          id={ticket.id}
                          customerName={ticket.customerName}
                          deviceModel={ticket.deviceModel}
                          jobType={ticket.jobType}
                          phone={ticket.phone}
                          notes={ticket.notes}
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Sağ Sidebar — Durum Klasörleri */}
        <div className="w-52 flex-shrink-0 border-2 border-brand-dark">
          <div className="bg-brand-dark text-white px-3 py-2 border-b-2 border-brand-dark">
            <span className="text-xs font-bold uppercase tracking-widest">
              Klasörler
            </span>
          </div>

          {/* Tümü */}
          <Link
            href="/admin"
            className={`flex items-center justify-between px-3 py-3 border-b border-brand-border transition-colors ${
              !activeStatus
                ? "bg-brand text-brand-dark"
                : "bg-white text-brand-dark hover:bg-brand-subtle"
            }`}
          >
            <div className="flex items-center gap-2">
              <IconFolder className="w-4 h-4 flex-shrink-0" />
              <span className="text-xs font-bold uppercase tracking-wider">
                Tümü
              </span>
            </div>
            <span className="text-xs font-bold tabular-nums text-brand-hover">
              {allTickets.length}
            </span>
          </Link>

          {/* Her durum için bir klasör */}
          {STATUSES.map((s) => {
            const isActive = activeStatus === s;
            return (
              <Link
                key={s}
                href={`/admin?status=${encodeURIComponent(s)}`}
                className={`flex items-center justify-between px-3 py-3 border-b border-brand-border last:border-b-0 transition-colors ${
                  isActive
                    ? "bg-brand text-brand-dark"
                    : "bg-white text-brand-dark hover:bg-brand-subtle"
                }`}
              >
                <div className="flex items-center gap-2">
                  {FOLDER_ICONS[s]}
                  <span className="text-xs font-bold uppercase tracking-wide leading-tight">
                    {STATUS_LABELS[s]}
                  </span>
                </div>
                <span className="text-xs font-bold tabular-nums flex-shrink-0 text-brand-muted">
                  {counts[s] ?? 0}
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
