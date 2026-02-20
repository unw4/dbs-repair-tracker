import Link from "next/link";
import { getTicketByUuid } from "@/lib/actions";
import { STATUS_LABELS, getApplicableStatuses } from "@/lib/constants";
import { notFound } from "next/navigation";
import TrackFooter from "@/app/components/TrackFooter";
import DarkModeToggle from "@/app/components/DarkModeToggle";

const STATUS_BADGE: Record<string, string> = {
  Received: "bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300",
  "In Progress": "bg-yellow-50 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300",
  "Waiting for Parts": "bg-orange-50 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300",
  Ready: "bg-green-50 text-green-700 dark:bg-green-900/30 dark:text-green-300",
  Delivered: "bg-gray-100 text-gray-500 dark:bg-slate-700 dark:text-slate-400",
};

export default async function TrackPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const ticket = await getTicketByUuid(id);

  if (!ticket) notFound();

  const applicableStatuses = getApplicableStatuses(ticket.jobType);
  const currentStep = applicableStatuses.indexOf(ticket.status);

  const info = [
    { label: "Müşteri", value: ticket.customerName },
    { label: "Cihaz", value: ticket.deviceModel },
    { label: "Yapılacak İşlem", value: ticket.jobType },
    ...(ticket.phone ? [{ label: "Telefon", value: ticket.phone }] : []),
    {
      label: "Kayıt Tarihi",
      value: new Date(ticket.createdAt).toLocaleDateString("tr-TR", {
        year: "numeric",
        month: "long",
        day: "numeric",
        timeZone: "Europe/Istanbul",
      }),
    },
    ...(ticket.notes ? [{ label: "Notlar", value: ticket.notes }] : []),
  ];

  return (
    <div className="min-h-screen bg-[#F8FAFC] dark:bg-slate-900 flex flex-col transition-colors">
      {/* Navbar */}
      <header className="bg-white dark:bg-slate-800 border-b border-gray-100 dark:border-slate-700 px-6 py-4 flex items-center justify-between shadow-sm">
        <Link href="/track" className="opacity-90 hover:opacity-100 transition-opacity">
          <img src="/logo.png" alt="Denizli Bilgisayar Sistemleri" className="h-9 w-auto" />
        </Link>
        <div className="flex items-center gap-2">
          <DarkModeToggle className="text-gray-400 dark:text-slate-400 hover:bg-gray-100 dark:hover:bg-slate-700" />
          <span className="text-xs text-brand-muted dark:text-slate-400 font-medium">
            Müşteri Takip Portalı
          </span>
        </div>
      </header>

      <main className="flex-1 max-w-2xl mx-auto w-full px-4 py-10 flex flex-col gap-4">
        {/* Güncel Durum */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-700 p-5 flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-gray-400 dark:text-slate-500 mb-1">
              Güncel Durum
            </p>
            <span
              className={`inline-block text-sm font-semibold px-3 py-1 rounded-full ${
                STATUS_BADGE[ticket.status] ?? "bg-gray-100 text-gray-500"
              }`}
            >
              {STATUS_LABELS[ticket.status] ?? ticket.status}
            </span>
          </div>
          <p className="text-xs text-gray-400 dark:text-slate-500 text-right">
            Son güncelleme
            <br />
            {new Date(ticket.updatedAt).toLocaleString("tr-TR", {
              month: "short",
              day: "numeric",
              hour: "2-digit",
              minute: "2-digit",
              timeZone: "Europe/Istanbul",
            })}
          </p>
        </div>

        {/* Servis Süreci — Stepper */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-700 p-5">
          <h2 className="text-sm font-semibold text-brand-dark dark:text-slate-100 mb-5">
            Servis Süreci
          </h2>
          <div className="flex items-start">
            {applicableStatuses.map((status, i) => {
              const isDone = i < currentStep;
              const isCurrent = i === currentStep;
              return (
                <div key={status} className="flex items-start flex-1 last:flex-none">
                  <div className="flex flex-col items-center flex-shrink-0">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold border-2 transition-all ${
                        isDone
                          ? "bg-brand-dark border-brand-dark text-white"
                          : isCurrent
                          ? "bg-white dark:bg-slate-800 border-brand-dark text-brand-dark dark:text-brand"
                          : "bg-white dark:bg-slate-800 border-gray-200 dark:border-slate-600 text-gray-300 dark:text-slate-600"
                      }`}
                    >
                      {isDone ? "✓" : i + 1}
                    </div>
                    <span
                      className={`text-center text-xs mt-2 font-medium leading-tight max-w-[64px] ${
                        isDone
                          ? "text-brand-dark dark:text-brand"
                          : isCurrent
                          ? "text-brand-dark dark:text-slate-100 font-semibold"
                          : "text-gray-300 dark:text-slate-600"
                      }`}
                    >
                      {STATUS_LABELS[status]}
                    </span>
                  </div>
                  {i < applicableStatuses.length - 1 && (
                    <div
                      className={`flex-1 h-0.5 mt-4 mx-1 ${
                        i < currentStep ? "bg-brand-dark" : "bg-gray-200 dark:bg-slate-600"
                      }`}
                    />
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Cihaz Bilgileri */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-700 p-5">
          <h2 className="text-sm font-semibold text-brand-dark dark:text-slate-100 mb-3">
            Cihaz Bilgileri
          </h2>
          <div className="flex flex-col divide-y divide-gray-50 dark:divide-slate-700">
            {info.map(({ label, value }) => (
              <div key={label} className="flex justify-between items-start py-2.5 first:pt-0 last:pb-0">
                <span className="text-xs font-semibold text-gray-400 dark:text-slate-500 uppercase tracking-wide flex-shrink-0 mr-4">
                  {label}
                </span>
                <span className="text-sm text-brand-dark dark:text-slate-200 text-right">{value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Takip No */}
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-gray-100 dark:border-slate-700 px-5 py-3">
          <p className="text-xs font-semibold text-gray-400 dark:text-slate-500 uppercase tracking-wide mb-0.5">
            Takip No
          </p>
          <p className="font-mono text-xs text-brand-muted dark:text-slate-400 break-all">{ticket.id}</p>
        </div>
      </main>

      <TrackFooter />
    </div>
  );
}
