import React from "react";
import CardButton from "./card-button";

export default function Card(props) {
  // console.log(props); //current object passed down from parent
  function onDelete() {
    props.onCardDelete(props._id);
  }
  function onMove(whereTo) {
    props.onCardMove(props._id, whereTo);
  }
  return (
    <article>
      <h3>{props.task_name}</h3>
      <p>{props.color}</p>
      <CardButton />
      <button onClick={onDelete}>Delete</button>
      <button onClick={() => onMove("todo")}>To Todo</button>
      <button onClick={() => onMove("doing")}>To Doing</button>
      <button onClick={() => onMove("done")}>To Done</button>
    </article>
  );
}
