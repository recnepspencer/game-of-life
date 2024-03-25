// Assuming this file is located in /pages/api/update-user-details.ts

import type { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '@/lib/db';

interface UserRequestBody {
  firstName: string;
  lastName: string;
  gamesWon: number;
  gamesLost: number;
  gamesDrawn: number;
  about?: string;
}

interface ApiResponseData {
  error?: string;
  data?: any; // Consider using a more specific type for your data
}

async function postHandler(req: Request, res: NextApiResponse<ApiResponseData>) {
  if (req.method === 'POST') {
    const payload = await req.json();
    const { firstName, lastName, gamesWon, gamesLost, gamesDrawn, about } = payload as UserRequestBody;
    try {
      const userData = await prisma.fakeUser.create({
        data: {
          firstName,
          lastName,
          gamesWon: Number(gamesWon),
          gamesLost: Number(gamesLost),
          gamesDrawn: Number(gamesDrawn),
          about,
        },
      });

      return new Response(JSON.stringify(userData), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    } catch (error) {
      return new Response(JSON.stringify({ error: 'Error creating user' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      });
    }
  } else {
    return new Response(JSON.stringify({ error: 'Method Not Allowed' }), {
      status: 405,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}

export const POST = postHandler;
