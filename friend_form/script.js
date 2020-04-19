"use strict";
window.addEventListener("DOMContentLoaded", start);
import {
  endpoint,
  apiKey,
  form,
  pattern,
  elms,
  formElms,
} from "./modules/vars";

function start() {
  document.querySelector(".add").addEventListener("click", (evt) => {
    form.classList.remove("hidden");
    document.querySelector("main").classList.add("blurBg");
  });
  document.querySelector(".cancel").addEventListener("click", () => {
    form.classList.add("hidden");
    document.querySelector("main").classList.remove("blurBg");
  });
  form.setAttribute("novalidate", true);
  checkInfo();
  autoFillInfo();
  get();
}
function checkInfo() {
  form.addEventListener("submit", (evt) => {
    evt.preventDefault(); //turn off validation on submit
    formElms.forEach((elm) => {
      elm.classList.remove("invalid");
    });
    let validForm = true;
    if (form.checkValidity() && validForm) {
      if (form.dataset.state === "post") {
        post({
          first_name: elms.fstname.value,
          last_name: elms.lstname.value,
          age: elms.age.value,
          email: elms.email.value
        });
      } else {
        put({
          first_name: elms.fstname.value,
          last_name: elms.lstname.value,
          age: elms.age.value,
          email: elms.email.value
        }, form.dataset.id);
      }
      form.classList.add("hidden");
      form.reset();
    } else {
      //loop validity
      formElms.forEach((elm) => {
        elm.classList.remove("invalid");
        if (!elm.checkValidity()) {
          elm.classList.add("invalid");
        }
      });
    }
  });
}
function autoFillInfo() {
  elms.unknownDOB.addEventListener("click", (evt) => {
    elms.dob.disabled = !elms.dob.disabled;
    elms.age.disabled = !elms.age.disabled;
  });
  elms.dob.addEventListener("change", (e) => {
    let ageStr = elms.dob.value;
    let ageNum = parseInt(ageStr);
    let currentYr = 2020;
    elms.age.value = currentYr - ageNum;
  });
}
function get() {
  document.querySelector("main").innerHTML = "";
  fetch(endpoint, {
    method: "get",
    headers: {
      accept: "application/json",
      "x-apikey": apiKey,
      "cache-control": "no-cache",
    },
  })
    .then((e) => e.json())
    .then(showData);
}

function showData(e) {
  e.forEach(showFriends);
}

function showFriends(friend) {
  const display = document.querySelector("main");
  const clone = pattern.cloneNode(true);
  clone.querySelector(".first").textContent = friend.first_name;
  clone.querySelector(".last").textContent = friend.last_name;
  clone.querySelector(".email").textContent = friend.email;
  clone.querySelector(".age").textContent = friend.age;
  //clone.querySelector("button").dataset.id = friend._id;
  clone
    .querySelectorAll(`article, button[data-action="delete"]`)
    .forEach((elm) => (elm.dataset.id = friend._id));
  clone
    .querySelector(`[data-action="delete"]`)
    .addEventListener("click", (elm) => deleteAFriend(friend._id));
  clone
    .querySelector(`[data-action="edit"]`)
    .addEventListener("click", (elm) => getAFriend(friend._id, setupFormforEdit));
  display.appendChild(clone);
}
function post(data) {
  const postData = JSON.stringify(data);
  fetch(endpoint, {
    method: "post",
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "x-apikey": apiKey,
      "cache-control": "no-cache",
    },
    body: postData,
  })
    .then((res) => res.json())
    .then((data) => showFriends(data));
}

function deleteAFriend(id) {
  document.querySelector(`article[data-id="${id}"]`).remove();
  fetch(`${endpoint}/${id}`, {
    method: "delete",
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "x-apikey": apiKey,
      "cache-control": "no-cache",
    },
  })
    .then((res) => res.json())
    .then((data) => { });
}
function getAFriend(id, callback) {
  //fetch data, using the id
  fetch(`${endpoint}/${id}`, {
    method: "get",
    headers: {
      accept: "application/json",
      "x-apikey": apiKey,
      "cache-control": "no-cache",
    },
  })
    .then((e) => e.json())
    .then((data) => callback(data));
}
function setupFormforEdit(data) {
  console.log("on");
  //show the form
  form.classList.remove("hidden");
  document.querySelector("main").classList.add("blurBg");
  //populate the form
  form.dataset.state = "put";
  form.dataset.id = data._id;
  elms.fstname.value = data.first_name;
  elms.lstname.value = data.last_name;
  //handle submits
  checkInfo();
  form.classList.add("hidden");
  document.querySelector("main").classList.remove("blurBg");
  //remove evt handler and add evt handler
}
function put(data, id) {
  const putData = JSON.stringify(data);
  fetch(`${endpoint}/${id}`, {
    method: "put",
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "x-apikey": apiKey,
      "cache-control": "no-cache",
    },
    body: putData,
  })
    .then((res) => res.json())
    .then((data) => console.log(data));
}