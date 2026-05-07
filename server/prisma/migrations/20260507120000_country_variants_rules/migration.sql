-- Add per-country variants (visa types: validity, stay, entries, fee)
-- and rules (passport, nationality blocklist, apply window, required docs).
ALTER TABLE "Country" ADD COLUMN "variants" JSONB;
ALTER TABLE "Country" ADD COLUMN "rules"    JSONB;
