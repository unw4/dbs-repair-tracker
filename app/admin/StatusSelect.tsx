"use client";

import { updateTicketStatus } from "@/lib/actions";
import { STATUSES, STATUS_LABELS } from "@/lib/constants";

export default function StatusSelect({
  id,
  current,
}: {
  id: string;
  current: string;
}) {
  async function handleChange(e: React.ChangeEvent<HTMLSelectElement>) {
    await updateTicketStatus(id, e.target.value);
  }

  return (
    <select
      defaultValue={current}
      onChange={handleChange}
      className="border border-brand-border px-2 py-1 text-xs bg-white focus:outline-none focus:border-brand-dark cursor-pointer text-brand-dark"
    >
      {STATUSES.map((s) => (
        <option key={s} value={s}>
          {STATUS_LABELS[s] ?? s}
        </option>
      ))}
    </select>
  );
}
