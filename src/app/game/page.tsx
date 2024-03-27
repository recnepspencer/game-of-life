"use client";
import SendGameComponent from "../components/gameComponents/SendGameComponent";
import LoadGameBoard from "../components/gameComponents/LoadGameComponent";
import CombinedBoards from "../components/gameComponents/CombinedBoards";

const GameComponent = () => {
  return (
    <div>
      <LoadGameBoard />
      <SendGameComponent />
      <CombinedBoards />

    </div>
  );
};

export default GameComponent;
