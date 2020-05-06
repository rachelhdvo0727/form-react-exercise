import React from "react";
import Newcardbutton from "./newcard-button";

export default function Form(props) {
  function submit(evt) {
    evt.preventDefault();
    console.log("submit?", evt);
    props.onFormSubmit("sent");
  }
  return (
    <form onSubmit={submit}>
      <input />
      <Newcardbutton />
    </form>
  );
}
