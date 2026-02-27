"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "./prisma";
import { sendTrackingMessage, sendReadyMessage, sendDeliveredMessage } from "./whatsapp";
import { getSession } from "./session";
import { STATUSES, JOB_TYPES } from "./constants";

async function requireAdmin() {
  const session = await getSession();
  if (!session.isLoggedIn) throw new Error("Unauthorized");
}

function sanitize(value: string | undefined, maxLength: number, required = false): string | undefined {
  if (required && (!value || !value.trim())) throw new Error("Required field missing");
  if (value === undefined || value === null) return undefined;
  const trimmed = value.trim().slice(0, maxLength);
  return trimmed || undefined;
}

export async function createTicket(
  customerName: string,
  deviceModel: string,
  jobType: string,
  phone?: string,
  notes?: string
) {
  await requireAdmin();

  const name = sanitize(customerName, 100, true)!;
  const device = sanitize(deviceModel, 100, true)!;
  const cleanNotes = sanitize(notes, 1000);
  const cleanPhone = sanitize(phone, 20);

  if (!(JOB_TYPES as readonly string[]).includes(jobType)) throw new Error("Invalid job type");

  try {
    const ticket = await prisma.ticket.create({
      data: { customerName: name, deviceModel: device, jobType, phone: cleanPhone ?? null, notes: cleanNotes ?? null },
    });
    if (cleanPhone) {
      await sendTrackingMessage(cleanPhone, ticket.id);
    }
    revalidatePath("/admin");
  } catch (e) {
    console.error("[createTicket]", e instanceof Error ? e.message : "Unknown error");
    throw new Error("Failed to create ticket");
  }
}

export async function updateTicketStatus(id: string, status: string) {
  await requireAdmin();

  if (!(STATUSES as readonly string[]).includes(status)) throw new Error("Invalid status");

  try {
    const ticket = await prisma.ticket.update({
      where: { id },
      data: { status },
    });
    if (status === "Ready" && ticket.phone) {
      await sendReadyMessage(ticket.phone, ticket.id);
    }
    if (status === "Delivered" && ticket.phone) {
      await sendDeliveredMessage(ticket.phone);
    }
    revalidatePath("/admin");
  } catch (e) {
    console.error("[updateTicketStatus]", e instanceof Error ? e.message : "Unknown error");
    throw new Error("Failed to update status");
  }
}

export async function updateTicket(
  id: string,
  customerName: string,
  deviceModel: string,
  jobType: string,
  phone?: string,
  notes?: string
) {
  await requireAdmin();

  const name = sanitize(customerName, 100, true)!;
  const device = sanitize(deviceModel, 100, true)!;
  const cleanNotes = sanitize(notes, 1000);
  const cleanPhone = sanitize(phone, 20);

  if (!(JOB_TYPES as readonly string[]).includes(jobType)) throw new Error("Invalid job type");

  try {
    await prisma.ticket.update({
      where: { id },
      data: { customerName: name, deviceModel: device, jobType, phone: cleanPhone ?? null, notes: cleanNotes ?? null },
    });
    revalidatePath("/admin");
  } catch (e) {
    console.error("[updateTicket]", e instanceof Error ? e.message : "Unknown error");
    throw new Error("Failed to update ticket");
  }
}

export async function deleteTicket(id: string) {
  await requireAdmin();

  try {
    await prisma.ticket.delete({ where: { id } });
    revalidatePath("/admin");
  } catch (e) {
    console.error("[deleteTicket]", e instanceof Error ? e.message : "Unknown error");
    throw new Error("Failed to delete ticket");
  }
}

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export async function getTicketByUuid(id: string) {
  if (!id || typeof id !== "string" || !UUID_REGEX.test(id)) return null;
  try {
    return await prisma.ticket.findUnique({ where: { id } });
  } catch {
    return null;
  }
}

export async function acceptTerms(id: string) {
  if (!id || typeof id !== "string" || !UUID_REGEX.test(id)) return;
  try {
    await prisma.ticket.update({
      where: { id },
      data: { termsAccepted: true, termsAcceptedAt: new Date() },
    });
  } catch {
    // Silently fail — not security-critical
  }
}
