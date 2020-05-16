import React from "react";
import CardButton from "./card-button";

export default function Card(props) {
  console.log(props);
  function onDelete() {
    props.onCardDelete(props.id);
  }
  function onMove(whereTo) {
    props.onCardMove(props.id, whereTo);
  }
  return (
    <article>
      <h3>{props.title}</h3>
      <p>{props.color}</p>
      <CardButton />
      <button onClick={onDelete}>Delete</button>
      <button onClick={() => onMove("todo")}>To Todo</button>
      <button onClick={() => onMove("doing")}>To Doing</button>
      <button onClick={() => onMove("done")}>To Done</button>
    </article>
  );
}
