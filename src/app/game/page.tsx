'use client'
import React, { useRef, useEffect, useState } from 'react';

const scale = 10;
const userBoardHeight = 32;
const userBoardWidth = 64;

const GameCanvas: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [userList, setUserList] = useState<number[][]>(
    Array.from({ length: userBoardHeight }, () => Array(userBoardWidth).fill(0))
  );
  const [isDrawing, setIsDrawing] = useState(false);
  const [id, setId] = useState('');

  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      if (ctx) {
        canvas.width = userBoardWidth * scale;
        canvas.height = userBoardHeight * scale * 2; // Ensure the canvas is tall enough for both halves
        canvas.style.width = `${canvas.width}px`;
        canvas.style.height = `${canvas.height}px`;

        render(ctx);
      }
    }
  }, []);

  const render = (ctx: CanvasRenderingContext2D) => {
    if (ctx) {
      ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height / 2); // Clear only the top half if needed
      ctx.fillStyle = "gray"; // Example color for the top half
      ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height / 2); // Fill only the top half if needed

      // Render the grid in the bottom half
      for (let y = 0; y < userBoardHeight; y++) {
        for (let x = 0; x < userBoardWidth; x++) {
          ctx.fillStyle = userList[y][x] ? "black" : "white";
          ctx.fillRect(x * scale, (y + userBoardHeight) * scale, scale, scale); // Offset y position by userBoardHeight
        }
      }
    }
  };

  const draw = (x: number, y: number, value: boolean) => {
    const canvas = canvasRef.current;
    if (canvas && isDrawing) {
      const ctx = canvas.getContext('2d');
      if (ctx) {
        const rect = canvas.getBoundingClientRect();
        const mouseX = x - rect.left;
        const mouseY = y - rect.top - (userBoardHeight * scale); // Offset mouseY to account for the top half

        const gridX = Math.floor(mouseX / scale);
        const gridY = Math.floor(mouseY / scale);

        if (gridX >= 0 && gridX < userBoardWidth && gridY >= 0 && gridY < userBoardHeight) {
          const updatedList = [...userList];
          updatedList[gridY][gridX] = value ? 1 : 0;
          setUserList(updatedList);
          render(ctx);
        }
      }
    }
  };

  const handleSaveGrid = async () => {
    try {
      const response = await fetch('/api/test-game-object', {  // This should match the file name in your pages/api directory
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id: parseInt(id, 10), gridData: userList }),
      });
      const result = await response.json();
      if (response.ok) {
        console.log('Grid saved with ID:', result.id);
      } else {
        throw new Error(result.error || 'Failed to save grid');
      }
    } catch (error) {
      console.error('Error saving grid:', error);
    }
  };
  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    setIsDrawing(true);
    draw(e.clientX, e.clientY, true);
  };

  const handleMouseUp = () => {
    setIsDrawing(false);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (isDrawing) {
      draw(e.clientX, e.clientY, true);
    }
  };

  return (
    <div>
      <canvas
        ref={canvasRef}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        onMouseOut={handleMouseUp}
        onMouseMove={handleMouseMove}
        style={{ border: '1px solid black', borderRadius: '8px' }}
      />
      <input
        type="text"
        value={id}
        onChange={(e) => setId(e.target.value)}
        placeholder="Enter ID"
        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
      />
      <button onClick={handleSaveGrid}>Done!</button>
    </div>
  );
};

export default GameCanvas;




