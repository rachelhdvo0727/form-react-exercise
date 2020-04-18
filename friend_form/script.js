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

    if (form.checkValidity() && validForm) {
      //send data
      post({
        first_name: elms.fstname.value,
        last_name: elms.lstname.value,
        age: elms.age.value,
        email: elms.email.value,
      });
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
