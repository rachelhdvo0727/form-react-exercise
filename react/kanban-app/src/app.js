import React, { useState } from "react";
import "./index.css";
import Navi from "./components/navi";
import Main from "./components/main";

export default function App() {
  // const cards = [
  //   {
  //     title: "Make it dynamic",
  //     list: "todo",
  //     added: 1588055291061,
  //     id: 1,
  //     color: "hotpink",
  //     assignedTo: ["jofh"],
  //   },
  //   {
  //     title: "Make it dynamic",
  //     list: "todo",
  //     added: 1588055091061,
  //     id: 2,
  //     color: "lightblue",
  //     assignedTo: ["jofh", "davi"],
  //   },
  // ];
  const [cards, setCards] = useState([
    {
      title: "Make it dynamic",
      list: "todo",
      added: 1588055291061,
      id: 1,
      color: "hotpink",
      assignedTo: ["jofh"],
    },
    {
      title: "Make it dynamic",
      list: "todo",
      added: 1588055091061,
      id: 2,
      color: "lightblue",
      assignedTo: ["jofh", "davi"],
    },
  ]);

  return (
    <div className="App">
      <Navi></Navi>
      <Main cards={cards} />
      <button
        onClick={() =>
          setCards(
            cards.concat({
              title: "OMG, did that just happen?",
              list: "todo",
              added: Date.now(),
              id: Math.random(),
              color: "lightblue",
              assignedTo: ["jofh"],
            })
          )
        }
      >CLick This</button>
    </div>
  );
}
