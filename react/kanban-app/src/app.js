import React, { useState, useEffect } from "react";
import "./index.css";
import Navi from "./components/navi";
import Main from "./components/main";

export default function App() {
  const [cards, setCards] = useState([]); //create a state and set it to []
  const endpoint = "https://frontendspring20-e4cd.restdb.io/rest/trelloclone";
  const apiKey = "5e956ffd436377171a0c230f";
  //import data with useEffect, then pass it down to updating state function
  useEffect(() => {
    //callback function using arrow function
    fetch(endpoint, {
      method: "get",
      headers: {
        "Content-Type": "application/json; charset=utf-8",
        "x-apikey": apiKey,
        "cache-control": "no-cache",
      },
    })
      .then((res) => res.json())
      .then((data) => setCards(data));
  }, []);
  function onFormSubmit(data) {
    console.log("form submitted", data);
    //Set the state and update everything belongs to a card
    setCards(cards.concat(data));
  }
  function onCardMove(id, whereTo) {
    console.log(id, whereTo);
    const nextCards = cards.map((card) => {
      if (card._id === id) {
        console.log("update the card");
        card.list = whereTo;
      }
      return card;
    });
    setCards(nextCards);
  }
  function onCardDelete(id) {
    console.log(id);
    const nextCards = cards.filter((card) => card._id !== id);
    setCards(nextCards);
  }
  return (
    <div className="App">
      <Navi></Navi>
      {/* {cards.length === 0 && <h2>Loading</h2>} */}
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
