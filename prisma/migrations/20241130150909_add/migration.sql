/*
  Warnings:

  - Added the required column `content` to the `Post` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Post" ADD COLUMN     "content" TEXT NOT NULL,
ADD COLUMN     "thumbnailLink" TEXT;

-- CreateIndex
CREATE INDEX "Comment_createdAt_commenterId_postId_idx" ON "Comment"("createdAt", "commenterId", "postId");

-- CreateIndex
CREATE INDEX "Post_createdAt_pubStatus_idx" ON "Post"("createdAt", "pubStatus");
