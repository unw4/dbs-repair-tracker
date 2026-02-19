import Link from "next/link";
import { getTicketByUuid } from "@/lib/actions";
import { STATUS_LABELS, getApplicableStatuses } from "@/lib/constants";
import { notFound } from "next/navigation";
import TrackFooter from "@/app/components/TrackFooter";


const STATUS_BADGE: Record<string, string> = {
  Received: "bg-blue-50 text-blue-700",
  "In Progress": "bg-yellow-50 text-yellow-700",
  "Waiting for Parts": "bg-orange-50 text-orange-700",
  Ready: "bg-green-50 text-green-700",
  Delivered: "bg-gray-100 text-gray-500",
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
      }),
    },
    ...(ticket.notes ? [{ label: "Notlar", value: ticket.notes }] : []),
  ];

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col">
      {/* Navbar */}
      <header className="bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between shadow-sm">
        <Link href="/track" className="opacity-90 hover:opacity-100 transition-opacity">
          <img
            src="/logo.png"
            alt="Denizli Bilgisayar Sistemleri"
            className="h-9 w-auto"
          />
        </Link>
        <span className="text-xs text-brand-muted font-medium">
          Müşteri Takip Portalı
        </span>
      </header>

      <main className="flex-1 max-w-2xl mx-auto w-full px-4 py-10 flex flex-col gap-4">
        {/* Güncel Durum */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-1">
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
          <p className="text-xs text-gray-400 text-right">
            Son güncelleme
            <br />
            {new Date(ticket.updatedAt).toLocaleString("tr-TR", {
              month: "short",
              day: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            })}
          </p>
        </div>

        {/* Tamir Süreci — Stepper */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
          <h2 className="text-sm font-semibold text-brand-dark mb-5">
            Servis Süreci
          </h2>
          <div className="flex items-start">
            {applicableStatuses.map((status, i) => {
              const isDone = i < currentStep;
              const isCurrent = i === currentStep;
              return (
                <div key={status} className="flex items-start flex-1 last:flex-none">
                  {/* Adım */}
                  <div className="flex flex-col items-center flex-shrink-0">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold border-2 transition-all ${
                        isDone
                          ? "bg-brand-dark border-brand-dark text-white"
                          : isCurrent
                          ? "bg-white border-brand-dark text-brand-dark"
                          : "bg-white border-gray-200 text-gray-300"
                      }`}
                    >
                      {isDone ? "✓" : i + 1}
                    </div>
                    <span
                      className={`text-center text-xs mt-2 font-medium leading-tight max-w-[64px] ${
                        isDone
                          ? "text-brand-dark"
                          : isCurrent
                          ? "text-brand-dark font-semibold"
                          : "text-gray-300"
                      }`}
                    >
                      {STATUS_LABELS[status]}
                    </span>
                  </div>
                  {/* Bağlantı çizgisi */}
                  {i < applicableStatuses.length - 1 && (
                    <div
                      className={`flex-1 h-0.5 mt-4 mx-1 ${
                        i < currentStep ? "bg-brand-dark" : "bg-gray-200"
                      }`}
                    />
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Cihaz Bilgileri */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
          <h2 className="text-sm font-semibold text-brand-dark mb-3">
            Cihaz Bilgileri
          </h2>
          <div className="flex flex-col divide-y divide-gray-50">
            {info.map(({ label, value }) => (
              <div
                key={label}
                className="flex justify-between items-start py-2.5 first:pt-0 last:pb-0"
              >
                <span className="text-xs font-semibold text-gray-400 uppercase tracking-wide flex-shrink-0 mr-4">
                  {label}
                </span>
                <span className="text-sm text-brand-dark text-right">
                  {value}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Takip No */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 px-5 py-3">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-0.5">
            Takip No
          </p>
          <p className="font-mono text-xs text-brand-muted break-all">
            {ticket.id}
          </p>
        </div>
      </main>

      <TrackFooter />
    </div>
  );
}
