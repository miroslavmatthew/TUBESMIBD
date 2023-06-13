let meja = document.querySelectorAll(".meja");

function orderMeja(event) {
  let curr = event.currentTarget;
}

for (let i = 0; i < meja.length; i++) {
  meja[i].addEventListener("click", (event) => {
    var form = document.createElement("form");
    form.method = "POST";
    form.action = "confirmation";

    var input = document.createElement("input");
    input.type = "hidden";
    input.name = "noMeja";
    input.value = event.currentTarget.textContent;

    form.appendChild(input);

    document.body.appendChild(form);
    form.submit();
  });
}
