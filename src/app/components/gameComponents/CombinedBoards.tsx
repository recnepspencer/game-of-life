// components/CombinedBoards.tsx
'use client';
import React, { useRef, useEffect, useState } from 'react';

const scale = 10;
const boardSize = 64;

const CombinedBoards: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [combinedBoard, setCombinedBoard] = useState<number[][]>(
    Array.from({ length: boardSize }, () => Array(boardSize).fill(0))
  );

  useEffect(() => {
    const loadGameBoard = async (id: number, offset: number) => {
      try {
        const response = await fetch(`/api/test-game-object/load-game-object?id=${id}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });
        const result = await response.json();
        if (response.ok) {
          const gridData = result.gridData;
          setCombinedBoard((prevBoard) => {
            const newBoard = [...prevBoard];
            for (let i = 0; i < gridData.length; i++) {
              for (let j = 0; j < gridData[i].length; j++) {
                newBoard[i + offset][j] = gridData[i][j];
              }
            }
            return newBoard;
          });
        } else {
          throw new Error(result.error || 'Failed to load grid');
        }
      } catch (error) {
        console.error('Error loading grid:', error);
      }
    };

    loadGameBoard(3, 0);
    loadGameBoard(4, boardSize / 2);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      if (ctx) {
        canvas.width = boardSize * scale;
        canvas.height = boardSize * scale;
        canvas.style.width = `${canvas.width}px`;
        canvas.style.height = `${canvas.height}px`;
        render(ctx);

        let genCount = 0;
        const generations = 100;
        const maxNeighbors = 3;
        const requiredAllies = 2;
        const defectCount = 1;
        const killCount = 0;
        const tooManyNeighbors = 5;
        const requiredNeighbors = 2;
        let winner = 0;

        const gameLoop = () => {
          genCount++;
          let boardCopy = structuredClone(combinedBoard);

          for (let i = 0; i < boardSize; i++) {
            for (let j = 0; j < boardSize; j++) {
              let player1 = 0;
              let player2 = 0;

              // Count neighbors for player 1
              if (i > 0 && j > 0 && boardCopy[i - 1][j - 1] === 1) player1++;
              if (i > 0 && boardCopy[i - 1][j] === 1) player1++;
              if (i > 0 && j < boardSize - 1 && boardCopy[i - 1][j + 1] === 1) player1++;
              if (j > 0 && boardCopy[i][j - 1] === 1) player1++;
              if (j < boardSize - 1 && boardCopy[i][j + 1] === 1) player1++;
              if (i < boardSize - 1 && j > 0 && boardCopy[i + 1][j - 1] === 1) player1++;
              if (i < boardSize - 1 && boardCopy[i + 1][j] === 1) player1++;
              if (i < boardSize - 1 && j < boardSize - 1 && boardCopy[i + 1][j + 1] === 1) player1++;

              // Count neighbors for player 2
              if (i > 0 && j > 0 && boardCopy[i - 1][j - 1] === 2) player2++;
              if (i > 0 && boardCopy[i - 1][j] === 2) player2++;
              if (i > 0 && j < boardSize - 1 && boardCopy[i - 1][j + 1] === 2) player2++;
              if (j > 0 && boardCopy[i][j - 1] === 2) player2++;
              if (j < boardSize - 1 && boardCopy[i][j + 1] === 2) player2++;
              if (i < boardSize - 1 && j > 0 && boardCopy[i + 1][j - 1] === 2) player2++;
              if (i < boardSize - 1 && boardCopy[i + 1][j] === 2) player2++;
              if (i < boardSize - 1 && j < boardSize - 1 && boardCopy[i + 1][j + 1] === 2) player2++;

              if (boardCopy[i][j] === 1) {
                if (player1 + player2 > maxNeighbors) {
                  combinedBoard[i][j] = 0;
                } else if (player1 < requiredAllies) {
                  combinedBoard[i][j] = 0;
                } else if (player2 - player1 > defectCount) {
                  combinedBoard[i][j] = 0;
                  combinedBoard[i][j] = 2;
                } else if (player2 - player1 > killCount) {
                  combinedBoard[i][j] = 0;
                }
              } else if (boardCopy[i][j] === 2) {
                if (player1 + player2 > maxNeighbors) {
                  combinedBoard[i][j] = 0;
                } else if (player2 < requiredAllies) {
                  combinedBoard[i][j] = 0;
                } else if (player1 - player2 > defectCount) {
                  combinedBoard[i][j] = 0;
                  combinedBoard[i][j] = 1;
                } else if (player1 - player2 > killCount) {
                  combinedBoard[i][j] = 0;
                }
              } else {
                if (player1 + player2 > tooManyNeighbors) {
                  // Stay dead
                } else if (player2 - player1 > 0 && player2 > requiredNeighbors) {
                  combinedBoard[i][j] = 2;
                } else if (player1 - player2 > 0 && player1 > requiredNeighbors) {
                  combinedBoard[i][j] = 1;
                }
              }
            }
          }

          if (genCount === generations) {
            let count = 0;
            for (let i = 0; i < boardSize; i++) {
              for (let j = 0; j < boardSize; j++) {
                count += combinedBoard[i][j] === 1 ? 1 : combinedBoard[i][j] === 2 ? -1 : 0;
              }
            }
            if (count > 0) {
              winner = 1;
              console.log("Congratulations! You won!");
            } else if (count < 0) {
              winner = 2;
              console.log("Better luck next time.");
            } else {
              winner = 3;
              console.log("It's a draw!");
            }
          }

          render(ctx);
        };

        const interval = setInterval(gameLoop, 1000);
        return () => clearInterval(interval);
      }
    }
  }, [combinedBoard]);

  const render = (ctx: CanvasRenderingContext2D) => {
    if (ctx) {
      ctx.fillStyle = 'lightgray';
      ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);

      for (let y = 0; y < boardSize; y++) {
        for (let x = 0; x < boardSize; x++) {
          ctx.fillStyle = combinedBoard[y][x] === 1 ? "green" : combinedBoard[y][x] === 2 ? "red" : "white";
          ctx.fillRect(x * scale, y * scale, scale, scale);
        }
      }
    }
  };

  return (
    <div>
      <canvas
        ref={canvasRef}
        style={{ border: '1px solid black', borderRadius: '8px' }}
      />
    </div>
  );
};

export default CombinedBoards;