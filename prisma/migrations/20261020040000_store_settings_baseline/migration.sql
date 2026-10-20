CREATE TABLE "StoreSettings" (
    "id" TEXT NOT NULL DEFAULT 'main',
    "storeNameAr" TEXT NOT NULL DEFAULT 'وسامة برفيوم',
    "storeNameEn" TEXT NOT NULL DEFAULT 'Wasama Perfume',
    "whatsapp" TEXT NOT NULL DEFAULT '',
    "vodafoneCashNumber" TEXT NOT NULL DEFAULT '',
    "instapayAddress" TEXT NOT NULL DEFAULT '',
    "vodafoneCashEnabled" BOOLEAN NOT NULL DEFAULT false,
    "instapayEnabled" BOOLEAN NOT NULL DEFAULT false,
    "paymentInstructions" TEXT NOT NULL DEFAULT '',
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "StoreSettings_pkey" PRIMARY KEY ("id")
);