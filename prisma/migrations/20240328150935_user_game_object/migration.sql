/*
  Warnings:

  - You are about to drop the column `clerkId` on the `User` table. All the data in the column will be lost.
  - You are about to drop the `Game` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `GameObject` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `UserGame` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[externalId]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `updatedAt` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "GameObject" DROP CONSTRAINT "GameObject_gameId_fkey";

-- DropForeignKey
ALTER TABLE "UserGame" DROP CONSTRAINT "UserGame_gameId_fkey";

-- DropForeignKey
ALTER TABLE "UserGame" DROP CONSTRAINT "UserGame_userId_fkey";

-- DropIndex
DROP INDEX "User_clerkId_key";

-- AlterTable
ALTER TABLE "User" DROP COLUMN "clerkId",
ADD COLUMN     "about" TEXT,
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "externalId" TEXT,
ADD COLUMN     "gamesDrawn" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "gamesLost" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- DropTable
DROP TABLE "Game";

-- DropTable
DROP TABLE "GameObject";

-- DropTable
DROP TABLE "UserGame";

-- CreateTable
CREATE TABLE "GameSession" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" INTEGER NOT NULL,
    "result" TEXT NOT NULL,

    CONSTRAINT "GameSession_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FakeUser" (
    "firstName" TEXT NOT NULL,
    "id" SERIAL NOT NULL,
    "lastName" TEXT NOT NULL,
    "gamesWon" INTEGER NOT NULL DEFAULT 0,
    "gamesLost" INTEGER NOT NULL DEFAULT 0,
    "gamesDrawn" INTEGER NOT NULL DEFAULT 0,
    "about" TEXT,

    CONSTRAINT "FakeUser_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TestGameObject" (
    "id" INTEGER NOT NULL,
    "gridData" TEXT NOT NULL,
    "userId" INTEGER NOT NULL,

    CONSTRAINT "TestGameObject_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_externalId_key" ON "User"("externalId");

-- AddForeignKey
ALTER TABLE "GameSession" ADD CONSTRAINT "GameSession_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TestGameObject" ADD CONSTRAINT "TestGameObject_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
