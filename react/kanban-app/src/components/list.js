import React from "react";
import Card from "./card";
import Form from "./form";

export default function List(props) {
  console.log(props); //objects
  return (
    <section>
      <h2>{props.header}</h2>
      <ul>
        <Card {...props.cards[0]} />
        <Card {...props.cards[1]} />
      </ul>
      <Form />
    </section>
  );
}
