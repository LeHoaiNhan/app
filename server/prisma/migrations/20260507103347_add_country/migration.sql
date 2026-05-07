-- CreateTable
CREATE TABLE "Country" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "flag" TEXT NOT NULL,
    "iso" TEXT NOT NULL,
    "region" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "tag" TEXT NOT NULL,
    "govFee" INTEGER,
    "processingTime" TEXT NOT NULL,
    "maxStay" TEXT NOT NULL,
    "entries" TEXT NOT NULL,
    "validity" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "popular" BOOLEAN NOT NULL DEFAULT false,
    "trending" BOOLEAN NOT NULL DEFAULT false,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Country_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Country_name_key" ON "Country"("name");

-- CreateIndex
CREATE INDEX "Country_region_idx" ON "Country"("region");

-- CreateIndex
CREATE INDEX "Country_active_idx" ON "Country"("active");
