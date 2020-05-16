import React, { useState } from "react";
import styles from "./Form.module.css";
import Button from "muicss/lib/react/button";
import Input from "muicss/lib/react/input";
import { CirclePicker } from "react-color";
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
  function colorChanged(color) {
    setColor(color.hex);
  }
  const inputStyle = {
    borderColor: title === " " ? "" : "" && title.length > 0 ? "" : "",
    // borderWidth: "1px",
    // borderStyle: "solid",
  };
  return (
    <form className={styles.cardForm} onSubmit={submit}>
      <Input
        label="Title"
        floatingLabel={true}
        type="text"
        name="title"
        value={title}
        onChange={titleChanged}
        style={inputStyle}
      />

      {/* <Input
        label="Color"
        floatingLabel={true}
        type="color"
        name="color"
        value={color}
        onChange={colorChanged}
      /> */}
      <CirclePicker
        value={color}
        onChangeComplete={colorChanged}
      ></CirclePicker>
      <Button
        color="accent"
        variant="raised"
        disabled={title.length === 0 || title === " "}
      >
        Add
      </Button>
    </form>
  );
}
