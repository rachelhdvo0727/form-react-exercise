import React from "react";
import Card from "./card";
import Form from "./form";

export default function List(props) {
  console.log(props); //objects
  const cards = props.cards.map((card) => (
    <Card
      onCardDelete={props.onCardDelete}
      onCardMove={props.onCardMove}
      key={card.id}
      {...card}
    />
    //added a unique key to each card (needed) to render eff
  ));
  return (
    <section>
      <h2>{props.header}</h2>
      <ul>{cards}</ul>
      <Form onFormSubmit={props.onFormSubmit} />
    </section>
  );
}
