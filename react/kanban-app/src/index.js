import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./app";

// function Container() {
//   //say Hi 3 times with Geeting function
//   return (
//     <article>
//       <Greeting />
//       <Greeting />
//       <Greeting />
//     </article>
//   );
// }
// function Greeting() {
//   //greeting Component
//   return <h1>Hi Rachel</h1>;
// }

//PROPS
// function Container() {
//   //say Hi 3 times with Geeting function
//   return (
//     <article>
//       <Greeting name="Rachel" />
//       <Greeting name="Rachel Vo" />
//       <Greeting name="Rachel Duc Hong Vo" />
//     </article>
//   );
// }
// function Greeting(props) {
//   //greeting Component
//   return <h1>Hi {props.name}</h1>; //{} used to interpolate variables
// }

ReactDOM.render(<App />, document.getElementById("root"));
