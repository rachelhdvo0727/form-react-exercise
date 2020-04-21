"use strcict";
import is from "is_js";
import Cleave from "cleave.js";
import "cleave.js/dist/addons/cleave-phone.dk";
if (is.firefox()) {
  console.log("😈");
} else {
  console.log("🤖");
}

//import { firefox } from "is_js";   //import a specific module
// if (firefox()) {
//   console.log("😈");
// } else {
//   console.log("🤖");
// }

var cleave = new Cleave("#testInput", {
  phone: true,
  phoneRegionCode: "DK",
});
var cleave = new Cleave("#card", {
  creditCard: true,
  onCreditCardTypeChanged: function (input) {
    console.log("fire card input");
  },
});
