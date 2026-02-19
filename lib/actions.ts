"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "./prisma";
import { sendTrackingMessage } from "./whatsapp";

export async function createTicket(
  customerName: string,
  deviceModel: string,
  jobType: string,
  phone?: string,
  notes?: string
) {
  const ticket = await prisma.ticket.create({
    data: { customerName, deviceModel, jobType, phone, notes },
  });
  if (phone) {
    await sendTrackingMessage(phone, ticket.id);
  }
  revalidatePath("/admin");
}

export async function updateTicketStatus(id: string, status: string) {
  await prisma.ticket.update({
    where: { id },
    data: { status },
  });
  revalidatePath("/admin");
}

export async function updateTicket(
  id: string,
  customerName: string,
  deviceModel: string,
  jobType: string,
  phone?: string,
  notes?: string
) {
  await prisma.ticket.update({
    where: { id },
    data: { customerName, deviceModel, jobType, phone: phone || null, notes: notes || null },
  });
  revalidatePath("/admin");
}

export async function getTicketByUuid(id: string) {
  return prisma.ticket.findUnique({ where: { id } });
}
