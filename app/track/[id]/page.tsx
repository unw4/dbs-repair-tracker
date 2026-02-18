import Link from "next/link";
import { getTicketByUuid } from "@/lib/actions";
import { STATUSES, STATUS_LABELS } from "@/lib/constants";
import { notFound } from "next/navigation";
import TrackFooter from "@/app/components/TrackFooter";

const STATUS_STEP: Record<string, number> = {
  Received: 0,
  "In Progress": 1,
  "Waiting for Parts": 2,
  Ready: 3,
  Delivered: 4,
};

export default async function TrackPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const ticket = await getTicketByUuid(id);

  if (!ticket) notFound();

  const currentStep = STATUS_STEP[ticket.status] ?? 0;

  return (
    <div className="min-h-screen bg-white flex flex-col justify-between">
      {/* Üst Bar */}
      <div className="border-b-2 border-brand-dark bg-brand-dark text-white px-6 py-4 flex items-center justify-between">
        <Link href="/track" className="opacity-90 hover:opacity-100 transition-opacity">
          <img src="/logo.png" alt="Denizli Bilgisayar Sistemleri" className="h-10 w-auto" />
        </Link>
        <span className="text-xs text-brand-border uppercase tracking-wider">
          Müşteri Takip Portalı
        </span>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-10">
        {/* Takip No */}
        <div className="border-2 border-brand-dark mb-6 px-4 py-3 bg-brand-subtle flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1">
          <span className="text-xs font-bold uppercase tracking-widest text-brand-muted">
            Takip No
          </span>
          <span className="font-mono text-sm text-brand-dark break-all">
            {ticket.id}
          </span>
        </div>

        {/* Cihaz Bilgileri */}
        <div className="border-2 border-brand-dark mb-6">
          <div className="bg-brand-dark text-white px-4 py-2">
            <span className="text-xs font-bold uppercase tracking-widest">
              Cihaz Bilgileri
            </span>
          </div>
          <div className="divide-y divide-brand-border">
            <div className="flex justify-between px-4 py-3">
              <span className="text-xs font-bold uppercase tracking-wider text-brand-muted">
                Müşteri
              </span>
              <span className="text-sm font-semibold text-brand-dark">{ticket.customerName}</span>
            </div>
            <div className="flex justify-between px-4 py-3">
              <span className="text-xs font-bold uppercase tracking-wider text-brand-muted">
                Cihaz
              </span>
              <span className="text-sm text-brand-hover">{ticket.deviceModel}</span>
            </div>
            <div className="flex justify-between px-4 py-3">
              <span className="text-xs font-bold uppercase tracking-wider text-brand-muted">
                Yapılacak İşlem
              </span>
              <span className="text-sm font-bold text-brand-dark border border-brand px-2 py-0.5 bg-brand-light">
                {ticket.jobType}
              </span>
            </div>
            {ticket.phone && (
              <div className="flex justify-between px-4 py-3">
                <span className="text-xs font-bold uppercase tracking-wider text-brand-muted">
                  Telefon
                </span>
                <span className="text-sm font-mono text-brand-dark">{ticket.phone}</span>
              </div>
            )}
            <div className="flex justify-between px-4 py-3">
              <span className="text-xs font-bold uppercase tracking-wider text-brand-muted">
                Tarih
              </span>
              <span className="text-sm text-brand-muted">
                {new Date(ticket.createdAt).toLocaleDateString("tr-TR", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </span>
            </div>
            {ticket.notes && (
              <div className="flex justify-between px-4 py-3">
                <span className="text-xs font-bold uppercase tracking-wider text-brand-muted">
                  Notlar
                </span>
                <span className="text-sm text-brand-hover text-right max-w-xs">
                  {ticket.notes}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Güncel Durum Etiketi */}
        <div className="border-2 border-brand-dark mb-6 px-4 py-4 flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-widest text-brand-muted">
            Güncel Durum
          </span>
          <span className="text-sm font-bold uppercase tracking-widest border-2 border-brand-dark px-3 py-1 bg-brand text-brand-dark">
            {STATUS_LABELS[ticket.status] ?? ticket.status}
          </span>
        </div>

        {/* İlerleme — solid renk bloklar */}
        <div className="border-2 border-brand-dark mb-2">
          <div className="bg-brand-light border-b-2 border-brand-dark px-4 py-2">
            <span className="text-xs font-bold uppercase tracking-widest text-brand-dark">
              Tamir Durumu
            </span>
          </div>
          <div className="p-4">
            {/* Bloklar */}
            <div className="flex w-full border-2 border-brand-dark overflow-hidden">
              {STATUSES.map((status, i) => {
                const isDone = i < currentStep;
                const isCurrent = i === currentStep;
                return (
                  <div
                    key={status}
                    className={`flex-1 relative border-r border-brand-dark last:border-r-0 ${
                      isDone
                        ? "bg-brand-dark"
                        : isCurrent
                          ? "bg-brand"
                          : "bg-white"
                    }`}
                    style={{ minHeight: "36px" }}
                  />
                );
              })}
            </div>

            {/* Etiketler */}
            <div className="flex w-full mt-3">
              {STATUSES.map((status, i) => {
                const isDone = i < currentStep;
                const isCurrent = i === currentStep;
                return (
                  <div key={status} className="flex-1 px-0.5">
                    <div
                      className={`text-center text-xs font-bold uppercase tracking-wide leading-tight ${
                        isDone
                          ? "text-brand-dark"
                          : isCurrent
                            ? "text-brand"
                            : "text-brand-border"
                      }`}
                    >
                      {isCurrent && (
                        <span className="block text-base leading-none mb-0.5">
                          ▼
                        </span>
                      )}
                      {STATUS_LABELS[status] ?? status}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Adım göstergesi */}
        <div className="text-center text-xs text-brand-muted uppercase tracking-widest mb-8">
          Adım {currentStep + 1} / {STATUSES.length}
        </div>

        {/* Son güncelleme */}
        <div className="border border-brand-border px-4 py-3 text-xs text-brand-muted text-center uppercase tracking-wider">
          Son güncelleme:{" "}
          {new Date(ticket.updatedAt).toLocaleString("tr-TR", {
            month: "short",
            day: "numeric",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
          })}
        </div>
      </div>
      <TrackFooter />
    </div>
  );
}
