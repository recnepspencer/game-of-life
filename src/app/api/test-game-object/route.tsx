// pages/api/test-game-object.ts

import type { NextApiResponse } from 'next';
import { prisma } from '@/lib/db';

interface GridRequestBody {
  id: number;
  gridData: number[][];
}

interface ApiResponseData {
  error?: string;
  data?: any; // You can define a more specific type based on your data structure
}

async function gridHandler(req: Request, res: NextApiResponse<ApiResponseData>) {
  if (req.method === 'POST') {
    let payload: GridRequestBody;

    try {
      payload = await req.json() as GridRequestBody;
    } catch (error) {
      console.error('Error parsing JSON:', error);
      return res.status(400).json({ error: 'Bad request' });
    }

    try {
      const { id, gridData } = payload;
      
      if (!id || !gridData) {
        console.error('Missing id or gridData');
        return res.status(400).json({ error: 'Missing id or gridData' });
      }

      const serializedData = JSON.stringify(gridData);
      const gridEntry = await prisma.testGameObject.create({
        data: {
          id,
          gridData: serializedData,
        },
      });

      res.status(200).json({ data: gridEntry });
    } catch (error) {
      console.error('Error saving grid data:', error);
      res.status(500).json({ error: 'Error saving grid data' });
    }
  } else {
    res.status(405).json({ error: 'Method Not Allowed' });
  }
}

export const POST = gridHandler;
