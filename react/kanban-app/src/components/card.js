import React from "react";
import CardButton from "./card-button";

export default function Card(props) {
  return (
    <article>
      <h3>{props.title}</h3>
      <p>{props.color}</p>
      <CardButton />
    </article>
  );
}
