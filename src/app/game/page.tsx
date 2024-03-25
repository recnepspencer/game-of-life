"use client";
import SendGameComponent from "../components/gameComponents/SendGameComponent";
import LoadGameBoard from "../components/gameComponents/LoadGameComponent";

const GameComponent = () => {
  return (
    <div>
      <LoadGameBoard />
      <SendGameComponent />
    </div>
  );
};

export default GameComponent;
