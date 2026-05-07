-- Per-user draft application stored server-side so customers don't lose work
-- when switching device/browser. One draft per user (unique on userId).
CREATE TABLE "DraftOrder" (
    "id"        TEXT NOT NULL,
    "userId"    TEXT NOT NULL,
    "data"      JSONB NOT NULL,
    "step"      INTEGER NOT NULL DEFAULT 1,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "DraftOrder_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "DraftOrder_userId_key" ON "DraftOrder"("userId");

ALTER TABLE "DraftOrder"
  ADD CONSTRAINT "DraftOrder_userId_fkey"
  FOREIGN KEY ("userId") REFERENCES "User"("id")
  ON DELETE CASCADE ON UPDATE CASCADE;
