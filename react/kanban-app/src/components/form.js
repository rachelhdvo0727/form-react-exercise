import React, { useState } from "react";
import styles from "./Form.module.css";

export default function Form(props) {
  const [title, setTitle] = useState(" ");
  const [color, setColor] = useState(" ");
  function submit(evt) {
    evt.preventDefault();
    // console.log("submit?", evt);
    props.onFormSubmit({
      title: title,
      list: "todo",
      added: Date.now(),
      color: color,
      assigned_to: ["jofh"],
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
  const inputStyle = {
    borderColor:
      title === " " ? "red" : "blue" && title.length > 0 ? "blue" : "red",
    borderWidth: "1px",
    borderStyle: "solid",
  };
  return (
    <form className={styles.cardForm} onSubmit={submit}>
      <label>
        Title
        <input
          type="text"
          name="title"
          value={title}
          onChange={titleChanged}
          style={inputStyle}
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
        disabled={title.length === 0 || title === " "}
        type="submit"
        name="submit"
        value="Add"
      />
    </form>
  );
}
