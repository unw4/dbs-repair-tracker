"use server";

import bcrypt from "bcryptjs";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/session";

export async function loginAction(formData: FormData) {
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
