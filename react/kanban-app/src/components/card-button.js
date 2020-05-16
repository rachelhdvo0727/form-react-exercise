import React, { useState } from "react";
import Button from "muicss/lib/react/button";

export default function CardButton(props) {
  const [clicks, setClicks] = useState(0);
  function clicked(e) {
    setClicks(clicks + 1);
  }
  return (
    <Button size="small" color="primary" onClick={clicked}>
      Edit {clicks}
    </Button>
  );
}
