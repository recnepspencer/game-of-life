'use client';
import React, { useRef, useEffect, useState } from 'react';
const scale = 10;
const boardSize = 64;
const CombinedBoards4p: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [combinedBoard, setCombinedBoard] = useState<number[][]>(
    Array.from({ length: boardSize }, () => Array(boardSize).fill(0))
  );
  const [board1Id, setBoard1Id] = useState('');
  const [board2Id, setBoard2Id] = useState('');
  const [board3Id, setBoard3Id] = useState('');
  const [board4Id, setBoard4Id] = useState('');
  const loadGameBoard = async (id: number, xoffset: number, yoffset: number, team:number) => {
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
              if (gridData[i][j])
              newBoard[i + xoffset][j + yoffset] = team;
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
  const handleLoadBoards = () => {
    if (board1Id && board2Id && board3Id && board4Id) {
      let half = boardSize/2
      loadGameBoard(parseInt(board1Id), 0, 0, 1);
      loadGameBoard(parseInt(board2Id), half, 0, 2);
      loadGameBoard(parseInt(board3Id), 0, half, 3);
      loadGameBoard(parseInt(board4Id), half, half, 4);
    }
  };
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
      }
    }
  }, [combinedBoard]);
  const render = (ctx: CanvasRenderingContext2D) => {
    if (ctx) {
      ctx.fillStyle = 'lightgray';
      ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
      for (let y = 0; y < boardSize; y++) {
        for (let x = 0; x < boardSize; x++) {
          if (combinedBoard[y][x] == 0){
            ctx.fillStyle = "white";
          }
          else if (combinedBoard[y][x] == 1){
            ctx.fillStyle = "blue";
          }
          else if (combinedBoard[y][x] == 2){
            ctx.fillStyle = "red";
          }
          else if (combinedBoard[y][x] == 3){
            ctx.fillStyle = "yellow";
          }
          else if (combinedBoard[y][x] == 4){
            ctx.fillStyle = "green";
          }
          ctx.fillRect(x * scale, y * scale, scale, scale);
        }
      }
    }
  };
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
        const tooManyNeighbors = 3;
        const requiredNeighbors = 2;
        let winner = 0;
        const gameLoop = () => {
          genCount++;
          let boardCopy = structuredClone(combinedBoard);
          for (let i = 0; i < boardSize; i++) {
            for (let j = 0; j < boardSize; j++) {
              let count = [0,0,0,0,0];

              if (i > 0 && j > 0 && boardCopy[i-1][j-1]) { 
                count[0]++;
                count[boardCopy[i-1][j-1]]++; 
              }
              if (i > 0 && boardCopy[i-1][j]) { 
                count[0]++;
                count[boardCopy[i-1][j]]++; 
              }
              if (i > 0 && j < boardSize-1 && boardCopy[i-1][j+1]) {
                count[0]++;
                count[boardCopy[i-1][j+1]]++; 
              }
              
              if (j > 0 && boardCopy[i][j-1]) { 
                count[0]++;
                count[boardCopy[i][j-1]]++; 
              }
              if (j < boardSize-1 && boardCopy[i][j+1]) { 
                count[0]++;
                count[boardCopy[i][j+1]]++; 
              }
              
              if (i < boardSize-1 && j > 0 && boardCopy[i+1][j-1]) { 
                count[0]++;
                count[boardCopy[i+1][j-1]]++; 
              }
              if (i < boardSize-1 && boardCopy[i+1][j]) { 
                count[0]++;
                count[boardCopy[i+1][j]]++; 
              }
              if (i < boardSize-1 && j < boardSize-1 && boardCopy[i+1][j+1]) { 
                count[0]++;
                count[boardCopy[i+1][j+1]]++; 
              }
              
              if(count[0] && (count[0] <= maxNeighbors)){
                let max = 1;
                let tie = [1];
                for(let i = 2; i < 5; i++){
                  if (count[i] > count[max]){
                    max = i;
                    tie = [i];
                  } else if (count[i] == count[max]){
                    tie.push(i)
                  }
                }
                if(boardCopy[i][j]==0){
                  if(((count[0])<=tooManyNeighbors) && (count[max] > requiredNeighbors) && (tie.length == 1)){
                    combinedBoard[i][j] = max;
                  }
                } else{
                  let team = combinedBoard[i][j];
                  if(((count[team]*2-count[0]) > killCount)||(count[team] < requiredAllies)||(count[0] > maxNeighbors)){
                    combinedBoard[i][j] = 0;
                  } else{
                    if(((count[max]*2-count[0]) > defectCount) && (tie.length == 1)){combinedBoard[i][j] = max;}
                  }
                }
              } else if(combinedBoard[i][j]){combinedBoard[i][j] = 0;}
            }
          }

          if (genCount === generations) {
            let count = [0,0,0,0];
            for (let i = 0; i < boardSize; i++) {
              for (let j = 0; j < boardSize; j++) {
                count[combinedBoard[i][j]-1]++;
              }
            }
            let max = 0;
            let tie = [0];
            for(let i = 1; i < 4; i++){
              if (count[i] > count[max]){
                max = i;
                tie = [i];
              } else if (count[i] == count[max]){
                tie.push(i)
              }
            }
            if (tie.length == 1){
              winner = max + 1;
              console.log('Congradulations! player ${winner} won!')
            }
            else{
              let tieString = 'Congradulations, players ';
              for (let i = 0; i < tie.length; i++){
                tieString += '${tie[i]} '
              }
              tieString += 'tied!'
              console.log(tieString)
            }
          }

          render(ctx);
        };
        const interval = setInterval(gameLoop, 1000);
        return () => clearInterval(interval);
      }
    }
  }, [combinedBoard]);
  return (
    <div>
      <div>
        <input
          type="text"
          placeholder="Board 1 ID"
          value={board1Id}
          onChange={(e) => setBoard1Id(e.target.value)}
          style={{ color: 'black' }}
        />
        <input
          type="text"
          placeholder="Board 2 ID"
          value={board2Id}
          onChange={(e) => setBoard2Id(e.target.value)}
          style={{ color: 'black' }}
        />
        <button onClick={handleLoadBoards}>Load Boards</button>
      </div>
      <canvas
        ref={canvasRef}
        style={{ border: '1px solid black', borderRadius: '8px' }}
      />
    </div>
  );
};
export default CombinedBoards4p;