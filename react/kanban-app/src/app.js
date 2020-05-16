import React, { useState, useEffect } from "react";
import "./index.css";
import Navi from "./components/navi";
import Main from "./components/main";
import { RestDB } from "./modules/restdb";

export default function App() {
  const [cards, setCards] = useState([]); //create a state and set it to []

  //import data with useEffect, then pass it down to updating state function
  useEffect(() => {
    RestDB.getData(setCards);
    //callback function using arrow function
    // fetch(endpoint, {
    //   method: "get",
    //   headers: {
    //     "Content-Type": "application/json; charset=utf-8",
    //     "x-apikey": apiKey,
    //     "cache-control": "no-cache",
    //   },
    // })
    //   .then((res) => res.json())
    //   .then((data) => setCards(data));
  }, []);
  function onFormSubmit(data) {
    console.log("form submitted", data);
    RestDB.addData(setCards, cards, data);
    //Set the state and update everything belongs to a card
    //setCards(cards.concat(data));
  }
  function onCardMove(_id, whereTo) {
    console.log(_id, whereTo);
    const nextCards = cards.map((card) => {
      if (card._id === _id) {
        console.log("update the card");
        card.list = whereTo;
      }
      return card;
    });
    RestDB.moveData({ list: whereTo }, _id);
    setCards(nextCards); //update state
  }
  function onCardDelete(_id) {
    const nextCards = cards.filter((card) => card._id !== _id);
    RestDB.deleteData(_id);
    setCards(nextCards); //update state
  }
  return (
    <div className="App">
      <Navi></Navi>
      {cards.length === 0 && <h2>Loading</h2>}
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
