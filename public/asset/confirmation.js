let confirm = document.querySelector("#confirm");
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
  input.value = document.getElementById("hari").textContent;

  form.appendChild(input);
  var input = document.createElement("input");
  input.type = "hidden";
  input.name = "jam";
  input.value = document.getElementById("jam").textContent;

  form.appendChild(input);
  var input = document.createElement("input");
  input.type = "hidden";
  input.name = "harga";
  input.value = document.getElementById("harga").textContent;

  form.appendChild(input);
  var input = document.createElement("input");
  input.type = "hidden";
  input.name = "email";
  input.value = document.getElementById("email").value;

  form.appendChild(input);
  document.body.appendChild(form);
  form.submit();
});
cancel.addEventListener("click", () => {
  window.history.back();
});
