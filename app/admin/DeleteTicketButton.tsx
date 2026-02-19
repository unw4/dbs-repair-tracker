"use client";

import { useState } from "react";
import { deleteTicket } from "@/lib/actions";

export default function DeleteTicketButton({ id }: { id: string }) {
  const [confirm, setConfirm] = useState(false);
  const [loading, setLoading] = useState(false);

  if (confirm) {
    return (
      <div className="flex items-center gap-1">
        <button
          onClick={async () => {
            setLoading(true);
            await deleteTicket(id);
          }}
          disabled={loading}
          className="text-xs font-bold uppercase tracking-wider text-red-600 hover:text-red-800 disabled:opacity-50"
        >
          {loading ? "…" : "Evet"}
        </button>
        <span className="text-brand-border">|</span>
        <button
          onClick={() => setConfirm(false)}
          className="text-xs font-bold uppercase tracking-wider text-brand-muted hover:text-brand-dark"
        >
          İptal
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={() => setConfirm(true)}
      className="text-xs font-bold uppercase tracking-wider text-red-400 hover:text-red-600"
    >
      Sil
    </button>
  );
}
