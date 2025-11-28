-- CreateTable
CREATE TABLE "Weather" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "city" TEXT NOT NULL,
    "temperature" INTEGER NOT NULL,
    "condition" TEXT NOT NULL,
    "humidity" INTEGER NOT NULL,
    "windSpeed" INTEGER NOT NULL,
    "lastUpdated" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "DailyForecast" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "weatherId" INTEGER NOT NULL,
    "date" DATETIME NOT NULL,
    "minTemp" INTEGER NOT NULL,
    "maxTemp" INTEGER NOT NULL,
    "condition" TEXT NOT NULL,
    "humidity" INTEGER NOT NULL,
    "windSpeed" INTEGER NOT NULL,
    CONSTRAINT "DailyForecast_weatherId_fkey" FOREIGN KEY ("weatherId") REFERENCES "Weather" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "Weather_city_key" ON "Weather"("city");

-- CreateIndex
CREATE INDEX "DailyForecast_weatherId_idx" ON "DailyForecast"("weatherId");
