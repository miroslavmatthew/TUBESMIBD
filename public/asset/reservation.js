var today = new Date();
var year = today.getFullYear();
var month = String(today.getMonth() + 1).padStart(2, '0');
var day = String(today.getDate()).padStart(2, '0');
var formattedDate = year + '-' + month + '-' + day;

var hours = String(today.getHours()).padStart(2, '0');
document.querySelector("#date").min = formattedDate;

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
    errMsg = "*Enter date!*";
  } else if (times == "") {
    errMsg = "*Choose Jam Bermain!*";
  } else if(dates == formattedDate){
    if(times <= hours){
      errMsg = "*Enter valid Jam Bermain!*";
    }
    else{
      validated = true;
    }
  } else{
    validated = true;
  }

  document.querySelector("#err").textContent = errMsg;
  return validated;
}

let signupform = document.querySelector("#forms");
signupform.onsubmit = validate;
