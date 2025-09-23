-- AlterTable
ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "email" TEXT;
ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "name" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX IF NOT EXISTS "users_email_key" ON "users"("email");
