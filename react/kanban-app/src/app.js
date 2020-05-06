import React, { useState } from "react";
import "./index.css";
import Navi from "./components/navi";
import Main from "./components/main";

export default function App() {
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
  function onFormSubmit(data) {
    console.log("form submitted", data);
    setCards(
      cards.concat({
        title: "OMG, did that just happen?",
        list: "doing",
        added: Date.now(),
        id: Math.random(),
        color: "lightblue",
        assignedTo: ["jofh"],
      })
    );
  }
  return (
    <div className="App">
      <Navi></Navi>
      {/* <Main cards={cards} /> */}
      <Main onFormSubmit={onFormSubmit} cards={cards} />
      {/* <button
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
      >
        Click This
      </button> */}
    </div>
  );
}
