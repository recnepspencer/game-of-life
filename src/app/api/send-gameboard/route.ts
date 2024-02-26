
import { PrismaClient } from '@prisma/client';
import { withAuth } from '@clerk/nextjs/api';

const prisma = new PrismaClient();

export default withAuth(async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { userId, result } = req.body;

  if (!userId || !result) {
    return res.status(400).json({ message: 'Missing userId or result' });
  }

  // Create a new game session record
  const gameSession = await prisma.gameSession.create({
    data: {
      userId,
      result,
    },
  });

  // Update the user's gamesPlayed and gamesWon counters
  await prisma.user.update({
    where: { id: userId },
    data: {
      gamesPlayed: { increment: 1 },
      gamesWon: result === 'win' ? { increment: 1 } : undefined,
    },
  });

  res.status(200).json({ message: 'Game result submitted successfully', gameSession });
});