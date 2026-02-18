"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "./prisma";

export async function createTicket(
  customerName: string,
  deviceModel: string,
  jobType: string,
  phone?: string,
  notes?: string
) {
  await prisma.ticket.create({
    data: { customerName, deviceModel, jobType, phone, notes },
  });
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
