import React from "react";
import CardButton from "./card-button";
import Button from "muicss/lib/react/button";

export default function Card(props) {
  // console.log(props); //current object passed down from parent
  function onDelete() {
    props.onCardDelete(props._id);
  }
  function onMove(whereTo) {
    props.onCardMove(props._id, whereTo);
  }
  //styling
  const cardColor = {
    backgroundColor: props.color,
  };
  return (
    <article style={cardColor}>
      <h3>{props.title}</h3>
      <p>{props.color}</p>
      <CardButton />
      <Button size="small" color="primary" onClick={onDelete}>
        Delete
      </Button>
      <Button size="small" color="primary" onClick={() => onMove("todo")}>
        To Todo
      </Button>
      <Button size="small" color="primary" onClick={() => onMove("doing")}>
        To Doing
      </Button>
      <Button size="small" color="primary" onClick={() => onMove("done")}>
        To Done
      </Button>
    </article>
  );
}
