import React from 'react';
import axios from 'axios';

export default function Game() {
  const gameData = [
    [0,0,1,0,0],
    [0,1,0,1,0],
    [1,0,1,0,1],
    [0,1,1,1,0],
    [1,0,0,0,1]
  ];

  const sendGameData = async () => {
    try {
      const response = await axios.post('/api/game', gameData);
      console.log('Game data stored:', response.data);
    } catch (error) {
      console.error('Error storing game data:', error);
    }
  };

  return (
    <div>
      <button onClick={sendGameData}>Send Game Data</button>
    </div>
  );
}