import React, { useState } from "react";

export default function Newcardbutton() {
  const initCount = 0;
  const [count, setCount] = useState(initCount);
  function handleClick() {
    //set state to = its current value + 1
    setCount(count + 1);
  }
  return (
    <div>
      <button onClick={handleClick}>Add New Card</button>
    </div>
  );
}
