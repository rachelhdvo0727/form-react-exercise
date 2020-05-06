import React from "react";
import List from "./list";

export default function Main({ cards, onFormSubmit }) {
  console.log(cards);
  return (
    <main>
      <List
        onFormSubmit={onFormSubmit}
        cards={cards.filter((c) => c.list === "todo")}
        header="To-do"
      />
      <List
        onFormSubmit={onFormSubmit}
        cards={cards.filter((c) => c.list === "doing")}
        header="Doing"
      />
      <List
        onFormSubmit={onFormSubmit}
        cards={cards.filter((c) => c.list === "done")}
        header="Done"
      />
    </main>
  );
}
