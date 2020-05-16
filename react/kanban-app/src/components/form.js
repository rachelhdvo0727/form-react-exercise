import React, { useState } from "react";

export default function Form(props) {
  const [task_name, setTitle] = useState(" ");
  const [color, setColor] = useState(" ");
  function submit(evt) {
    evt.preventDefault();
    // console.log("submit?", evt);
    props.onFormSubmit({
      title: task_name,
      list: "todo",
      added: 1588055291061,
      id: 1,
      color: color,
      assignedTo: ["jofh"],
    });
    setColor(" ");
    setTitle(" ");
  }
  function titleChanged(evt) {
    setTitle(evt.target.value);
  }
  function colorChanged(evt) {
    setColor(evt.target.value);
  }
  return (
    <form onSubmit={submit}>
      <label>
        Title
        <input
          type="text"
          name="task_name"
          value={task_name}
          onChange={titleChanged}
        />
      </label>
      <label>
        color
        <input
          type="color"
          name="color"
          value={color}
          onChange={colorChanged}
        />
      </label>
      <input type="submit" name="submit" value="Add" />
    </form>
  );
}
