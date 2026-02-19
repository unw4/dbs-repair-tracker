"use client";

import { updateTicketStatus } from "@/lib/actions";
import { STATUS_LABELS, getApplicableStatuses } from "@/lib/constants";

export default function StatusSelect({
  id,
  current,
  jobType,
}: {
  id: string;
  current: string;
  jobType: string;
}) {
  const statuses = getApplicableStatuses(jobType);

  async function handleChange(e: React.ChangeEvent<HTMLSelectElement>) {
    await updateTicketStatus(id, e.target.value);
  }

  return (
    <select
      defaultValue={current}
      onChange={handleChange}
      className="rounded-lg border border-gray-200 dark:border-slate-600 px-2 py-1 text-xs bg-white dark:bg-slate-700 text-brand-dark dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-brand-light cursor-pointer transition-all"
    >
      {statuses.map((s) => (
        <option key={s} value={s}>{STATUS_LABELS[s] ?? s}</option>
      ))}
    </select>
  );
}
