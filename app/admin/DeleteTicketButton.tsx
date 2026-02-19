"use client";

import { useState } from "react";
import { deleteTicket } from "@/lib/actions";

export default function DeleteTicketButton({ id }: { id: string }) {
  const [confirm, setConfirm] = useState(false);
  const [loading, setLoading] = useState(false);

  if (confirm) {
    return (
      <div className="flex items-center gap-1.5">
        <button
          onClick={async () => {
            setLoading(true);
            await deleteTicket(id);
          }}
          disabled={loading}
          className="text-xs font-semibold text-red-500 hover:text-red-700 disabled:opacity-50 transition-colors"
        >
          {loading ? "…" : "Evet"}
        </button>
        <span className="text-gray-300">|</span>
        <button
          onClick={() => setConfirm(false)}
          className="text-xs font-semibold text-gray-400 hover:text-brand-dark transition-colors"
        >
          İptal
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={() => setConfirm(true)}
      className="text-xs font-semibold text-gray-300 hover:text-red-500 transition-colors"
    >
      Sil
    </button>
  );
}
