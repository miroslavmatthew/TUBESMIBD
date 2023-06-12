let select = document.querySelector("select[name='district']");
let kots;
const promise = fetch("kota")
  .then(function (response) {
    return response.text();
  })
  .then(function (text) {
    console.log(text);
    kots = JSON.parse(text).kota;
    let select = document.querySelector("select[name='district']");
    for (let index = 0; index < kots.length; index++) {
      let option = document.createElement("option");
      let namakots = kots[index];
      option.text = `${namakots.namaKota}`;
      option.value = namakots.idKota;
      select.add(option);
    }
  });

select.addEventListener("input", function () {
  let selectSub = document.querySelector("select[name='subDistrict']");
  while (selectSub.children.length > 1) {
    selectSub.removeChild(selectSub.lastChild);
  }

  selectSub.firstChild.selected = true;
  const promise = fetch(`kecamatan?idKota=${select.value}`)
    .then(function (response) {
      return response.text();
    })
    .then(function (text) {
      console.log(text);
      kecs = JSON.parse(text).kecamatan;
      for (let index = 0; index < kecs.length; index++) {
        let option = document.createElement("option");
        let namakecs = kecs[index];
        option.text = `${namakecs.namaKecamatan}`;
        option.value = namakecs.idKecamatan;
        selectSub.add(option);
      }

      selectSub.disabled = false;
    });
});
