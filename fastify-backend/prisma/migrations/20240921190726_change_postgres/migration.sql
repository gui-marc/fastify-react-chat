-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT,
    "imageId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "onboardingCompleted" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SigInPasscode" (
    "id" TEXT NOT NULL,
    "value" INTEGER NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "SigInPasscode_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Session" (
    "id" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "Session_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Image" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "data" BYTEA NOT NULL,

    CONSTRAINT "Image_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FriendshipRequest" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "fromUserId" TEXT NOT NULL,
    "toUserId" TEXT NOT NULL,

    CONSTRAINT "FriendshipRequest_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Friendship" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "user1Id" TEXT NOT NULL,
    "user2Id" TEXT NOT NULL,

    CONSTRAINT "Friendship_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "FriendshipRequest_fromUserId_toUserId_key" ON "FriendshipRequest"("fromUserId", "toUserId");

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_imageId_fkey" FOREIGN KEY ("imageId") REFERENCES "Image"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SigInPasscode" ADD CONSTRAINT "SigInPasscode_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Session" ADD CONSTRAINT "Session_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FriendshipRequest" ADD CONSTRAINT "FriendshipRequest_fromUserId_fkey" FOREIGN KEY ("fromUserId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FriendshipRequest" ADD CONSTRAINT "FriendshipRequest_toUserId_fkey" FOREIGN KEY ("toUserId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Friendship" ADD CONSTRAINT "Friendship_user1Id_fkey" FOREIGN KEY ("user1Id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Friendship" ADD CONSTRAINT "Friendship_user2Id_fkey" FOREIGN KEY ("user2Id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
