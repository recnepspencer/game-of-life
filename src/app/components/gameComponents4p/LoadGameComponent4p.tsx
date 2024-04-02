// components/LoadGameBoard.tsx
'use client';
import React, { useRef, useEffect, useState } from 'react';

const scale = 10;
const userBoardHeight = 32;
const userBoardWidth = 32;

const LoadGameBoard4p: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [userList, setUserList] = useState<number[][]>(
    Array.from({ length: userBoardHeight }, () => Array(userBoardWidth).fill(0))
  );
  const [id, setId] = useState('');

  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      if (ctx) {
        canvas.width = userBoardWidth * scale;
        canvas.height = userBoardHeight * scale;
        canvas.style.width = `${canvas.width}px`;
        canvas.style.height = `${canvas.height}px`;
        render(ctx);
      }
    }
  }, [userList]);

  const render = (ctx: CanvasRenderingContext2D) => {
    if (ctx) {
      ctx.fillStyle = 'lightgray';
      ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);

      for (let y = 0; y < userBoardHeight; y++) {
        for (let x = 0; x < userBoardWidth; x++) {
          ctx.fillStyle = userList[y][x] ? "black" : "white";
          ctx.fillRect(x * scale, y * scale, scale, scale);
        }
      }
    }
  };

  const handleLoadGrid = async () => {
    try {
      const response = await fetch(`/api/test-game-object/load-game-object-4p?id=${id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      const result = await response.json();
      if (response.ok) {
        setUserList(result.gridData);
      } else {
        throw new Error(result.error || 'Failed to load grid');
      }
    } catch (error) {
      console.error('Error loading grid:', error);
    }
  };

  return (
    <div>
      <input
        type="text"
        value={id}
        onChange={(e) => setId(e.target.value)}
        placeholder="Enter ID"
        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
      />
      <button onClick={handleLoadGrid}>Load</button>
      <canvas
        ref={canvasRef}
        style={{ border: '1px solid black', borderRadius: '8px' }}
      />
    </div>
  );
};

export default LoadGameBoard4p;