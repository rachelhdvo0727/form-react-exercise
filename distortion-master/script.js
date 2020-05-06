"use strict";

window.addEventListener("DOMContentLoaded", init);
const HTML = {};
const data = "https://kea-alt-del.dk/kata-distortion/";
function init() {
  console.log("init");
  HTML.inqueue;
  HTML.timeleft = 5;
  HTML.coundownP = document.querySelector(".countdown");
  HTML.numberOfStu = document.querySelector("#students");
  HTML.needle = document.querySelector(".needle");
  setInterval(countDown, 1000);
  setInterval(getData, 6000);
}
function countDown() {
  if (HTML.timeleft <= 0) {
    clearInterval(countDown);
  }
  HTML.coundownP.textContent = 5 - HTML.timeleft;
  HTML.timeleft -= 1;
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
}
