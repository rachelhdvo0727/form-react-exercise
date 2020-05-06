import React, { useState } from "react";

export default function CardButton(props) {
  const [clicks, setClicks] = useState(0);
  function clicked(e) {
    setClicks(clicks + 1);
  }
  return <button onClick={clicked}>Edit {clicks}</button>;
}
