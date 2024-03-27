// pages/api/test-game-object.ts

import type { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '@/lib/db';

interface GridRequestBody {
  id: number;
  gridData: number[][];
}

async function gridHandler(req: Request, res: NextApiResponse) {
  if (req.method === 'POST') {
    const payload = await req.json();
    const { id, gridData } = payload as GridRequestBody;

    try {
      const gameObj = await prisma.testGameObject.create({
        data: {
          id,
          gridData: JSON.stringify(gridData),
        },
      });

      return new Response(JSON.stringify({ data: gameObj }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      });
    } catch (error) {
      return new Response(JSON.stringify({ error: 'Error saving grid' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }
  } else {
    return new Response(JSON.stringify({ error: 'Method Not Allowed' }), {
      status: 405,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

export const POST = gridHandler;
