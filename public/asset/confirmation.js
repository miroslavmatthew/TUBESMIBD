const confirm = document.getElementById("confirm");
let cancel = document.querySelector("#cancel");
confirm.addEventListener("click", (event) => {
  var form = document.createElement("form");
  form.method = "POST";
  form.action = "success";

  var input = document.createElement("input");
  input.type = "hidden";
  input.name = "noMeja";
  input.value = document.getElementById("noMeja").textContent;

  form.appendChild(input);
  var input = document.createElement("input");
  input.type = "hidden";
  input.name = "hari";
  var date = new Date(document.getElementById("hari").textContent);

  var year = date.getFullYear();
  var month = String(date.getMonth() + 1).padStart(2, "0");
  var day = String(date.getDate()).padStart(2, "0");

  var dateString = year + "-" + month + "-" + day;

  input.value = dateString;

  form.appendChild(input);
  var input = document.createElement("input");
  input.type = "hidden";
  input.name = "jam";
  input.value = document.getElementById("jam").textContent;

  form.appendChild(input);
  var input = document.createElement("input");
  input.type = "hidden";
  input.name = "harga";
  var unformattedNumber = document
    .getElementById("harga")
    .textContent.replace(/\D/g, "");
  var integerValue = parseInt(unformattedNumber);

  input.value = integerValue;

  function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    return emailRegex.test(email);
  }

  form.appendChild(input);
  var input = document.createElement("input");
  input.type = "hidden";
  input.name = "email";
  let s = confirm.getAttribute("login");
  if (s == "true") {
    if (isValidEmail(document.getElementById("email").value)) {
      input.value = document.getElementById("email").value;
    } else {
      document.getElementById("required").style.color = "#cb0033";
      return false;
    }
  }

  form.appendChild(input);
  document.body.appendChild(form);
  form.submit();
});
cancel.addEventListener("click", () => {
  window.history.back();
});
