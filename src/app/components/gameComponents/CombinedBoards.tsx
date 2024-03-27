// components/CombinedBoards.tsx
'use client';
import React, { useRef, useEffect, useState } from 'react';

const scale = 10;
const userBoardHeight = 32;
const userBoardWidth = 64;

const CombinedBoards: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [userList1, setUserList1] = useState<number[][]>(
    Array.from({ length: userBoardHeight }, () => Array(userBoardWidth).fill(0))
  );
  const [userList2, setUserList2] = useState<number[][]>(
    Array.from({ length: userBoardHeight }, () => Array(userBoardWidth).fill(0))
  );

  useEffect(() => {
    const loadGameBoard = async (id: number, setUserList: (data: number[][]) => void) => {
      try {
        const response = await fetch(`/api/test-game-object/load-game-object?id=${id}`, {
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

    loadGameBoard(3, setUserList1);
    loadGameBoard(4, setUserList2);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      if (ctx) {
        canvas.width = userBoardWidth * scale;
        canvas.height = userBoardHeight * scale * 2;
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
          let boardCopy = structuredClone(userList1);

          for (let i = 0; i < userBoardHeight; i++) {
            for (let j = 0; j < userBoardWidth; j++) {
              let player1 = 0;
              if (i > 0 && j > 0 && boardCopy[i - 1][j - 1] === 1) player1++;
              if (i > 0 && boardCopy[i - 1][j] === 1) player1++;
              if (i > 0 && j < userBoardWidth - 1 && boardCopy[i - 1][j + 1] === 1) player1++;

              if (j > 0 && boardCopy[i][j - 1] === 1) player1++;
              if (j < userBoardWidth - 1 && boardCopy[i][j + 1] === 1) player1++;

              if (i < userBoardHeight - 1 && j > 0 && boardCopy[i + 1][j - 1] === 1) player1++;
              if (i < userBoardHeight - 1 && boardCopy[i + 1][j] === 1) player1++;
              if (i < userBoardHeight - 1 && j < userBoardWidth - 1 && boardCopy[i + 1][j + 1] === 1) player1++;

              let player2 = 0;
              if (i > 0 && j > 0 && userList2[i - 1][j - 1] === 1) player2++;
              if (i > 0 && userList2[i - 1][j] === 1) player2++;
              if (i > 0 && j < userBoardWidth - 1 && userList2[i - 1][j + 1] === 1) player2++;

              if (j > 0 && userList2[i][j - 1] === 1) player2++;
              if (j < userBoardWidth - 1 && userList2[i][j + 1] === 1) player2++;

              if (i < userBoardHeight - 1 && j > 0 && userList2[i + 1][j - 1] === 1) player2++;
              if (i < userBoardHeight - 1 && userList2[i + 1][j] === 1) player2++;
              if (i < userBoardHeight - 1 && j < userBoardWidth - 1 && userList2[i + 1][j + 1] === 1) player2++;

              if (boardCopy[i][j] === 1) {
                if (player1 + player2 > maxNeighbors) {
                  userList1[i][j] = 0;
                } else if (player1 < requiredAllies) {
                  userList1[i][j] = 0;
                } else if (player2 - player1 > defectCount) {
                  userList1[i][j] = 0;
                  userList2[i][j] = 1;
                } else if (player2 - player1 > killCount) {
                  userList1[i][j] = 0;
                }
              } else if (userList2[i][j] === 1) {
                if (player1 + player2 > maxNeighbors) {
                  userList2[i][j] = 0;
                } else if (player2 < requiredAllies) {
                  userList2[i][j] = 0;
                } else if (player1 - player2 > defectCount) {
                  userList2[i][j] = 0;
                  userList1[i][j] = 1;
                } else if (player1 - player2 > killCount) {
                  userList2[i][j] = 0;
                }
              } else {
                if (player1 + player2 > tooManyNeighbors) {
                  // Stay dead
                } else if (player2 - player1 > 0 && player2 > requiredNeighbors) {
                  userList2[i][j] = 1;
                } else if (player1 - player2 > 0 && player1 > requiredNeighbors) {
                  userList1[i][j] = 1;
                }
              }
            }
          }

          if (genCount === generations) {
            let count = 0;
            for (let i = 0; i < userBoardHeight; i++) {
              for (let j = 0; j < userBoardWidth; j++) {
                count += userList1[i][j] - userList2[i][j];
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
  }, [userList1, userList2]);

  const render = (ctx: CanvasRenderingContext2D) => {
    if (ctx) {
      ctx.fillStyle = 'lightgray';
      ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);

      for (let y = 0; y < userBoardHeight; y++) {
        for (let x = 0; x < userBoardWidth; x++) {
          ctx.fillStyle = userList1[y][x] ? "black" : "white";
          ctx.fillRect(x * scale, y * scale, scale, scale);
        }
      }

      for (let y = 0; y < userBoardHeight; y++) {
        for (let x = 0; x < userBoardWidth; x++) {
          ctx.fillStyle = userList2[y][x] ? "green" : "white";
          ctx.fillRect(x * scale, (y + userBoardHeight) * scale, scale, scale);
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