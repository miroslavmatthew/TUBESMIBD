let select = document.querySelector("select[name='time']");
function n(n) {
  return n > 9 ? "" + n : "0" + n;
}

for (let index = 8; index <= 21; index++) {
  let option = document.createElement("option");
  option.text = `${n(index)}.00 - ${n(index + 1)}.00`;
  option.value = `${n(index)}:00:00`;
  select.add(option);
}
function validate() {
  let dates = document.querySelector("#date").value;
  let times = document.querySelector("#time").value;

  let validated = false;
  if (dates == "") {
    errMsg = "*Enter date please!*";
  } else if (times == "") {
    errMsg = "*Choose Jam Bermain please!*";
  } else {
    validated = true;
  }

  document.querySelector("#err").textContent = errMsg;
  return validated;
}

let signupform = document.querySelector("#forms");
signupform.onsubmit = validate;
