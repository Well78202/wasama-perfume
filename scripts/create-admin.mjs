
import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { hash } from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const email = process.env.ADMIN_EMAIL?.trim().toLowerCase();
  const password = process.env.ADMIN_PASSWORD;

  if (!email || !password || password.length < 16) {
    throw new Error(
      "Set ADMIN_EMAIL and ADMIN_PASSWORD (at least 16 characters)."
    );
  }

  const existing = await prisma.admin.findFirst({
    select: { id: true },
  });

  if (existing) {
    throw new Error("An admin account already exists.");
  }

  const passwordHash = await hash(password, 12);

  await prisma.admin.create({
    data: {
      email,
      passwordHash,
    },
  });

  console.log("Admin account created successfully.");
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
