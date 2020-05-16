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
      added: Date.now(),
      _id: Math.random(),
      color: color,
      assignedTo: ["jofh"],
    });
    setColor("");
    setTitle("");
  }
  function titleChanged(evt) {
    setTitle(evt.target.value);
  }
  function colorChanged(evt) {
    setColor(evt.target.value);
  }
  console.log(task_name);
  return (
    <form onSubmit={submit}>
      <label>
        Title
        <input
          type="text"
          name="title"
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
      <input
        disabled={task_name.length === 0 || task_name === " "}
        type="submit"
        name="submit"
        value="Add"
      />
    </form>
  );
}
