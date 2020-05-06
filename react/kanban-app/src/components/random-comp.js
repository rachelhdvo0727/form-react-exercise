import React, { useState } from "react";

export default function RandomComp() {
  const initCount = 0;
  const [count, setCount] = useState(initCount);
  function handleClick() {
    //set state to = its current value + 1
    setCount(count + 1);
  }
  return (
    <div>
      <button onClick={handleClick}>Counting</button>
      {/* receive counts as a prop */}
      <Something some={count}></Something>
    </div>
  );
}
//receive counts as a prop
function Something(props) {
  return <div>{props.some}</div>;
}
