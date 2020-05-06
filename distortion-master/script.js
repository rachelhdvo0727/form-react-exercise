"use strict";

window.addEventListener("DOMContentLoaded", init);
const HTML = {};
const data = "https://kea-alt-del.dk/kata-distortion/";
function init() {
  console.log("init");
  HTML.inqueue;
  HTML.numberOfStu = document.querySelector("#students");
  HTML.needle = document.querySelector(".needle");
  setInterval(getData, 5000);
}
async function getData() {
  const myQueue = await fetch(data);
  HTML.inqueue = await myQueue.json();
  showQueue(HTML.inqueue);
  //console.log(HTML.inqueue.inQueue);
}
function showQueue(queue) {
  console.log("show queue");
  console.log(HTML.inqueue.inQueue);
  HTML.numberOfStu.innerHTML = queue.inQueue + " students";
  HTML.needle.classList.add("move");
}
