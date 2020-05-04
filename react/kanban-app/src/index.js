import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
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

//BUILDING COMPONENTS
function App() {
  return (
    <div className="App">
      <Nav />
      <Main />
    </div>
  );
}
function Nav() {
  return <nav>Nav</nav>;
}
function Main() {
  return (
    <main>
      <List header="To-do"></List>
      <List header="Doing"></List>
      <List header="Done"></List>
    </main>
  );
}
function List(props) {
  console.log(props); //objects
  return (
    <section>
      <h2>{props.header}</h2>
      <ul>
        <Card name="Making food" />
        <Card name="Doing laundry" />
      </ul>
      <Form />
    </section>
  );
}
function Card(props) {
  return (
    <article>
      <h3>{props.name}</h3>
      <Button />
    </article>
  );
}
function Button() {
  return <button>Click</button>;
}
function Form() {
  return (
    <form>
      <input />
      <Button />
    </form>
  );
}

ReactDOM.render(<App />, document.getElementById("root"));
