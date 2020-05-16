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
    //const cardSubmit = cards.concat((card) => card.list === list);
    setCards(
      cards.concat({
        title: "OMG, did that just happen?",
        list: "todo",
        added: Date.now(),
        id: Math.random(),
        color: "lightblue",
        assignedTo: ["jofh"],
      })
    );
  }
  function onCardMove(id, whereTo) {
    console.log(id, whereTo);
    const nextCards = cards.map((card) => {
      if (card.id === id) {
        console.log("update the card");
        card.list = whereTo;
      }
      return card;
    });
    setCards(nextCards);
  }
  function onCardDelete(id) {
    console.log(id);
    const nextCards = cards.filter((card) => card.id !== id);
    setCards(nextCards);
  }
  return (
    <div className="App">
      <Navi></Navi>
      <Main
        onCardDelete={onCardDelete}
        onCardMove={onCardMove}
        onFormSubmit={onFormSubmit}
        cards={cards}
      />
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
