import React from "react";
import List from "./list";

export default function Main({ cards }) {
  console.log(cards);
  return (
    <main>
      <List
        cards={cards.filter((c) => c.list === "todo")}
        header="To-do"
      ></List>
      <List
        cards={cards.filter((c) => c.list === "doing")}
        header="Doing"
      ></List>
      <List cards={cards.filter((c) => c.list === "done")} header="Done"></List>
    </main>
  );
}
