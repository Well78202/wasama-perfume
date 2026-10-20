-- AlterTable
ALTER TABLE "Order" ADD COLUMN     "checkoutPayloadHash" TEXT;

-- CreateTable
CREATE TABLE "CheckoutRateLimit" (
    "key" TEXT NOT NULL,
    "count" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CheckoutRateLimit_pkey" PRIMARY KEY ("key")
);
