-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Ticket" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "customerName" TEXT NOT NULL,
    "deviceModel" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'Received',
    "jobType" TEXT NOT NULL DEFAULT 'Servis',
    "notes" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_Ticket" ("createdAt", "customerName", "deviceModel", "id", "notes", "status", "updatedAt") SELECT "createdAt", "customerName", "deviceModel", "id", "notes", "status", "updatedAt" FROM "Ticket";
DROP TABLE "Ticket";
ALTER TABLE "new_Ticket" RENAME TO "Ticket";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
