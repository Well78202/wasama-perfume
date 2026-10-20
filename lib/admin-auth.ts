import "server-only";

import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

async function getAuthenticatedAdmin() {
  const session = await auth();

  const adminId = session?.user?.id;

  if (!adminId) {
    return null;
  }

  const admin = await prisma.admin.findUnique({
    where: { id: adminId },
    select: {
      id: true,
      email: true,
    },
  });

  return admin;
}

// لحماية صفحات لوحة الأدمن
export async function requireAdmin() {
  const admin = await getAuthenticatedAdmin();

  if (!admin) {
    redirect("/admin/login");
  }

  return admin;
}

// لحماية Server Actions وعمليات API
export async function assertAdmin() {
  const admin = await getAuthenticatedAdmin();

  if (!admin) {
    throw new Error("UNAUTHORIZED");
  }

  return admin;
}