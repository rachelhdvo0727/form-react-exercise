import React from "react";
import Card from "./card";
import Form from "./form";
import Panel from "muicss/lib/react/panel";

export default function List(props) {
  //console.log(props); //current object
  const cards = props.cards.map((card) => (
    <Card
      onCardDelete={props.onCardDelete}
      onCardMove={props.onCardMove}
      key={card._id}
      {...card}
    />
    //added a unique key to each card (needed) to render eff
  ));
  return (
    <Panel>
      <h2>{props.header}</h2>
      <ul>{cards}</ul>
      <Form onFormSubmit={props.onFormSubmit} />
    </Panel>
  );
}
