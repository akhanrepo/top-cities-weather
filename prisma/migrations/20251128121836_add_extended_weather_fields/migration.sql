/*
  Warnings:

  - Added the required column `precipitationProbability` to the `DailyForecast` table without a default value. This is not possible if the table is not empty.
  - Added the required column `uvIndex` to the `DailyForecast` table without a default value. This is not possible if the table is not empty.
  - Added the required column `airQualityAqi` to the `Weather` table without a default value. This is not possible if the table is not empty.
  - Added the required column `airQualityCategory` to the `Weather` table without a default value. This is not possible if the table is not empty.
  - Added the required column `airQualityCo` to the `Weather` table without a default value. This is not possible if the table is not empty.
  - Added the required column `airQualityColor` to the `Weather` table without a default value. This is not possible if the table is not empty.
  - Added the required column `airQualityNo2` to the `Weather` table without a default value. This is not possible if the table is not empty.
  - Added the required column `airQualityO3` to the `Weather` table without a default value. This is not possible if the table is not empty.
  - Added the required column `airQualityPm10` to the `Weather` table without a default value. This is not possible if the table is not empty.
  - Added the required column `airQualityPm25` to the `Weather` table without a default value. This is not possible if the table is not empty.
  - Added the required column `airQualitySo2` to the `Weather` table without a default value. This is not possible if the table is not empty.
  - Added the required column `feelsLike` to the `Weather` table without a default value. This is not possible if the table is not empty.
  - Added the required column `precipitationProbability` to the `Weather` table without a default value. This is not possible if the table is not empty.
  - Added the required column `timezone` to the `Weather` table without a default value. This is not possible if the table is not empty.
  - Added the required column `uvIndex` to the `Weather` table without a default value. This is not possible if the table is not empty.
  - Added the required column `windDirection` to the `Weather` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_DailyForecast" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "weatherId" INTEGER NOT NULL,
    "date" DATETIME NOT NULL,
    "minTemp" INTEGER NOT NULL,
    "maxTemp" INTEGER NOT NULL,
    "condition" TEXT NOT NULL,
    "humidity" INTEGER NOT NULL,
    "windSpeed" INTEGER NOT NULL,
    "uvIndex" REAL NOT NULL,
    "precipitationProbability" INTEGER NOT NULL,
    CONSTRAINT "DailyForecast_weatherId_fkey" FOREIGN KEY ("weatherId") REFERENCES "Weather" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_DailyForecast" ("condition", "date", "humidity", "id", "maxTemp", "minTemp", "weatherId", "windSpeed") SELECT "condition", "date", "humidity", "id", "maxTemp", "minTemp", "weatherId", "windSpeed" FROM "DailyForecast";
DROP TABLE "DailyForecast";
ALTER TABLE "new_DailyForecast" RENAME TO "DailyForecast";
CREATE INDEX "DailyForecast_weatherId_idx" ON "DailyForecast"("weatherId");
CREATE TABLE "new_Weather" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "city" TEXT NOT NULL,
    "temperature" INTEGER NOT NULL,
    "feelsLike" INTEGER NOT NULL,
    "condition" TEXT NOT NULL,
    "humidity" INTEGER NOT NULL,
    "windSpeed" INTEGER NOT NULL,
    "windDirection" TEXT NOT NULL,
    "uvIndex" REAL NOT NULL,
    "precipitationProbability" INTEGER NOT NULL,
    "airQualityAqi" INTEGER NOT NULL,
    "airQualityCategory" TEXT NOT NULL,
    "airQualityColor" TEXT NOT NULL,
    "airQualityPm25" REAL NOT NULL,
    "airQualityPm10" REAL NOT NULL,
    "airQualityCo" REAL NOT NULL,
    "airQualityNo2" REAL NOT NULL,
    "airQualityO3" REAL NOT NULL,
    "airQualitySo2" REAL NOT NULL,
    "timezone" TEXT NOT NULL,
    "alerts" TEXT,
    "lastUpdated" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
INSERT INTO "new_Weather" ("city", "condition", "humidity", "id", "lastUpdated", "temperature", "windSpeed") SELECT "city", "condition", "humidity", "id", "lastUpdated", "temperature", "windSpeed" FROM "Weather";
DROP TABLE "Weather";
ALTER TABLE "new_Weather" RENAME TO "Weather";
CREATE UNIQUE INDEX "Weather_city_key" ON "Weather"("city");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
