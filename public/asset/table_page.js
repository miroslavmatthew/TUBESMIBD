let meja = document.querySelectorAll(".meja");

function orderMeja(event) {
  let curr = event.currentTarget;
}

for (let i = 0; i < meja.length; i++) {
  meja[i].addEventListener("click", (event) => {
    const input = {};
    input["noMeja"] = i + 1;
    fetch("confirmation", {
      method: "post",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify({ noMeja: 1 }),
    });
  });
}
