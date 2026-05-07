-- CreateEnum
CREATE TYPE "LoginEvent" AS ENUM ('login_success', 'login_failure', 'logout');

-- CreateEnum
CREATE TYPE "LoginProvider" AS ENUM ('google', 'admin');

-- CreateTable
CREATE TABLE "LoginLog" (
    "id" TEXT NOT NULL,
    "userId" TEXT,
    "email" TEXT,
    "event" "LoginEvent" NOT NULL,
    "provider" "LoginProvider" NOT NULL,
    "ip" TEXT,
    "userAgent" TEXT,
    "reason" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "LoginLog_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "LoginLog_userId_idx" ON "LoginLog"("userId");

-- CreateIndex
CREATE INDEX "LoginLog_createdAt_idx" ON "LoginLog"("createdAt");

-- CreateIndex
CREATE INDEX "LoginLog_event_idx" ON "LoginLog"("event");

-- AddForeignKey
ALTER TABLE "LoginLog" ADD CONSTRAINT "LoginLog_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
