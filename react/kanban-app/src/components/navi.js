import React from "react";
import RandomComp from "./random-comp";
//import CardButton from "./card-button";
export default function Navi(props) {
  return (
    <nav>
      {props.children}
      <RandomComp></RandomComp>
    </nav>
  );
}
