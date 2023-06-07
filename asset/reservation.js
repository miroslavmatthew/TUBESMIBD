let select = document.querySelector("select[name='time']");
function n(n) {
  return n > 9 ? "" + n : "0" + n;
}

for (let index = 8; index <= 21; index++) {
  let option = document.createElement("option");
  option.text = `${n(index)}.00 - ${n(index + 1)}.00`;
  option.value = index;
  select.add(option);
}
