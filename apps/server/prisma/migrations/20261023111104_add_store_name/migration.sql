-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_StoreConfig" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT DEFAULT 1,
    "name" TEXT NOT NULL DEFAULT '[Ao Porto Coffee]',
    "status" TEXT NOT NULL,
    "announcement" TEXT,
    "scheduleText" TEXT,
    "holidayNote" TEXT,
    "acceptOrders" BOOLEAN NOT NULL DEFAULT true,
    "alertWebhookUrl" TEXT,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_StoreConfig" ("acceptOrders", "alertWebhookUrl", "announcement", "holidayNote", "id", "scheduleText", "status", "updatedAt") SELECT "acceptOrders", "alertWebhookUrl", "announcement", "holidayNote", "id", "scheduleText", "status", "updatedAt" FROM "StoreConfig";
DROP TABLE "StoreConfig";
ALTER TABLE "new_StoreConfig" RENAME TO "StoreConfig";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
