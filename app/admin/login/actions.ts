"use server";

import bcrypt from "bcryptjs";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/session";
import { headers } from "next/headers";

// In-memory rate limiter: max 5 attempts per IP per 15 minutes.
// Note: resets on server restart — acceptable for single-instance deployments.
const loginAttempts = new Map<string, { count: number; resetAt: number }>();

function isRateLimited(ip: string): boolean {
  const now = Date.now();

  // Purge expired entries to prevent unbounded memory growth
  for (const [key, val] of loginAttempts) {
    if (now > val.resetAt) loginAttempts.delete(key);
  }

  const record = loginAttempts.get(ip);

  if (!record || now > record.resetAt) {
    loginAttempts.set(ip, { count: 1, resetAt: now + 15 * 60 * 1000 });
    return false;
  }

  if (record.count >= 5) return true;

  record.count++;
  return false;
}

export async function loginAction(formData: FormData) {
  const headersList = await headers();
  const ip =
    headersList.get("x-forwarded-for")?.split(",")[0].trim() ??
    headersList.get("x-real-ip") ??
    "unknown";

  if (isRateLimited(ip)) {
    redirect("/admin/login?error=ratelimit");
  }

  const username = formData.get("username") as string;
  const password = formData.get("password") as string;

  const validUsername = process.env.ADMIN_USERNAME;
  const passwordHash = process.env.ADMIN_PASSWORD_HASH
    ? Buffer.from(process.env.ADMIN_PASSWORD_HASH, "base64").toString("utf8")
    : undefined;

  if (
    !validUsername ||
    !passwordHash ||
    username !== validUsername ||
    !(await bcrypt.compare(password, passwordHash))
  ) {
    redirect("/admin/login?error=1");
  }

  const session = await getSession();
  session.isLoggedIn = true;
  await session.save();
  redirect("/admin");
}

export async function logoutAction() {
  const session = await getSession();
  session.destroy();
  redirect("/admin/login");
}
