export const JOB_TYPES = ["Parça Değişimi", "Servis", "Parça Değişimi + Servis"] as const;
export type JobType = (typeof JOB_TYPES)[number];

export const STATUSES = [
  "Received",
  "In Progress",
  "Waiting for Parts",
  "Ready",
  "Delivered",
] as const;

export type Status = (typeof STATUSES)[number];

export const STATUS_LABELS: Record<string, string> = {
  Received: "Teslim Alındı",
  "In Progress": "İşlemde",
  "Waiting for Parts": "Parça Bekleniyor",
  Ready: "Hazır",
  Delivered: "Teslim Edildi",
};

export function getApplicableStatuses(jobType: string): string[] {
  if (jobType === "Servis") {
    return STATUSES.filter((s) => s !== "Waiting for Parts");
  }
  return [...STATUSES];
}
