-- CreateEnum
CREATE TYPE "Role" AS ENUM ('customer', 'admin');

-- CreateEnum
CREATE TYPE "OrderStatus" AS ENUM ('submitted', 'review', 'sent', 'approved', 'delivered', 'rejected');

-- CreateEnum
CREATE TYPE "DocumentKind" AS ENUM ('applicant_photo', 'passport_scan', 'supporting', 'visa_result');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "avatar" TEXT,
    "role" "Role" NOT NULL DEFAULT 'customer',
    "googleId" TEXT,
    "password" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Order" (
    "id" TEXT NOT NULL,
    "customerId" TEXT NOT NULL,
    "status" "OrderStatus" NOT NULL DEFAULT 'submitted',
    "destination" TEXT NOT NULL,
    "flag" TEXT,
    "visaType" TEXT NOT NULL,
    "processing" TEXT NOT NULL,
    "fee" JSONB NOT NULL,
    "payment" JSONB NOT NULL,
    "applicant" JSONB NOT NULL,
    "passport" JSONB NOT NULL,
    "trip" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Order_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Document" (
    "id" TEXT NOT NULL,
    "uploaderId" TEXT NOT NULL,
    "orderId" TEXT,
    "kind" "DocumentKind" NOT NULL DEFAULT 'applicant_photo',
    "filename" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "mimeType" TEXT NOT NULL,
    "size" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Document_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TimelineEntry" (
    "id" TEXT NOT NULL,
    "orderId" TEXT NOT NULL,
    "stage" TEXT NOT NULL,
    "at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "note" TEXT,

    CONSTRAINT "TimelineEntry_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "User_googleId_key" ON "User"("googleId");

-- CreateIndex
CREATE INDEX "Order_customerId_idx" ON "Order"("customerId");

-- CreateIndex
CREATE INDEX "Order_status_idx" ON "Order"("status");

-- CreateIndex
CREATE INDEX "Document_uploaderId_idx" ON "Document"("uploaderId");

-- CreateIndex
CREATE INDEX "Document_orderId_idx" ON "Document"("orderId");

-- CreateIndex
CREATE INDEX "TimelineEntry_orderId_idx" ON "TimelineEntry"("orderId");

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Document" ADD CONSTRAINT "Document_uploaderId_fkey" FOREIGN KEY ("uploaderId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Document" ADD CONSTRAINT "Document_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "Order"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TimelineEntry" ADD CONSTRAINT "TimelineEntry_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "Order"("id") ON DELETE CASCADE ON UPDATE CASCADE;
