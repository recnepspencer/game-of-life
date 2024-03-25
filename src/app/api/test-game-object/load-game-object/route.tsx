// pages/api/load-game-board.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '@/lib/db';

async function loadGameBoardHandler(req: Request, res: NextApiResponse) {
  if (req.method === 'GET') {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    try {
      const gameObj = await prisma.testGameObject.findUnique({
        where: { id: Number(id) },
      });

      if (gameObj) {
        const gridData = JSON.parse(gameObj.gridData);
        return new Response(JSON.stringify({ gridData }), {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        });
      } else {
        return new Response(JSON.stringify({ error: 'Game board not found' }), {
          status: 404,
          headers: { 'Content-Type': 'application/json' },
        });
      }
    } catch (error) {
      return new Response(JSON.stringify({ error: 'Error loading game board' }), {
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

export const GET = loadGameBoardHandler;