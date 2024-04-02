"use client";
import SendGameComponent4p from "../components/gameComponents4p/SendGameComponent4p";
import LoadGameBoard4p from "../components/gameComponents4p/LoadGameComponent4p";
import CombinedBoards4p from "../components/gameComponents4p/CombinedBoards4p";

const GameComponent = () => {
  return (
    <div>
      <LoadGameBoard4p />
      <LoadGameBoard4p />
      <LoadGameBoard4p />
      <SendGameComponent4p />
      <CombinedBoards4p />

    </div>
  );
};

export default GameComponent;
