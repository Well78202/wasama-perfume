
import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { hash } from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const newPassword = process.env.NEW_ADMIN_PASSWORD;

  if (!newPassword || newPassword.length < 16) {
    throw new Error(
      "NEW_ADMIN_PASSWORD must be at least 16 characters."
    );
  }

  const admins = await prisma.admin.findMany({
    select: { id: true },
    take: 2,
  });

  if (admins.length !== 1) {
    throw new Error(
      "Expected exactly one admin account."
    );
  }

  const passwordHash = await hash(newPassword, 12);

  await prisma.admin.update({
    where: { id: admins[0].id },
    data: { passwordHash },
  });

  console.log("Admin password updated successfully.");
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
