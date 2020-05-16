import React from "react";
import List from "./list";

export default function Main({
  cards,
  onFormSubmit,
  onCardDelete,
  onCardMove,
}) {
  // console.log(cards);
  return (
    <main>
      <List
        onCardDelete={onCardDelete}
        onCardMove={onCardMove}
        onFormSubmit={onFormSubmit}
        cards={cards.filter((c) => c.list === "todo")}
        header="To-do"
      />
      <List
        onCardDelete={onCardDelete}
        onCardMove={onCardMove}
        onFormSubmit={onFormSubmit}
        cards={cards.filter((c) => c.list === "doing")}
        header="Doing"
      />
      <List
        onCardDelete={onCardDelete}
        onCardMove={onCardMove}
        onFormSubmit={onFormSubmit}
        cards={cards.filter((c) => c.list === "done")}
        header="Done"
      />
    </main>
  );
}
