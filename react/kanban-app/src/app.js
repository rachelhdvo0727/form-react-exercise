import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import Navi from "./components/navi";
import Main from "./components/main";

export default function App() {
  const cards = [
    {
      title: "Make it dynamic",
      list: "todo",
      added: 1588055291061,
      id: 1,
      color: "hotpink",
      assignedTo: ["jofh"],
    },
    {
      title: "Make it dynamic",
      list: "todo",
      added: 1588055091061,
      id: 2,
      color: "lightblue",
      assignedTo: ["jofh", "davi"],
    },
  ];
  return (
    <div className="App">
      <Navi />
      <Main cards={cards} />
    </div>
  );
}

ReactDOM.render(<App />, document.getElementById("root"));
