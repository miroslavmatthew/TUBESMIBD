let select = document.querySelector("select[name='district']");
let selectSub = document.querySelector("select[name='subDistrict']");
let selectUrban = document.querySelector("select[name='urbanVillage']");
let kots;
const promise = fetch("kota")
  .then(function (response) {
    return response.text();
  })
  .then(function (text) {
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
  while (selectSub.firstChild) {
    selectSub.removeChild(selectSub.lastChild);
  }
  selectSub.disabled = false;
  const promise = fetch(`kecamatan?idKota=${select.value}`)
    .then(function (response) {
      return response.text();
    })
    .then(function (text) {
      kecs = JSON.parse(text).kecamatan;
      for (let index = 0; index < kecs.length; index++) {
        let option = document.createElement("option");
        let namakecs = kecs[index];
        option.text = `${namakecs.namaKecamatan}`;
        option.value = namakecs.idKecamatan;
        selectSub.add(option);
      }
      let defValue = document.createElement("option");
      defValue.selected = true;
      defValue.disabled = true;
      defValue.hidden = true;
      defValue.textContent = "Pilih Kecamatan";
      selectSub.add(defValue);

      let defValueUrb = document.createElement("option");
      defValueUrb.selected = true;
      defValueUrb.disabled = true;
      defValueUrb.hidden = true;
      defValueUrb.textContent = "Pilih Kelurahan";
      selectUrban.add(defValueUrb);

      selectUrban.disabled = true;
    });
});

selectSub.addEventListener("input", function () {
  while (selectUrban.firstChild) {
    selectUrban.removeChild(selectUrban.lastChild);
  }
  selectUrban.disabled = false;
  const promise = fetch(`kelurahan?idKecamatan=${selectSub.value}`)
    .then(function (response) {
      return response.text();
    })
    .then(function (text) {
      kels = JSON.parse(text).kelurahan;
      for (let index = 0; index < kels.length; index++) {
        let option = document.createElement("option");
        let namakels = kels[index];
        option.text = `${namakels.namaKelurahan}`;
        option.value = namakels.idKelurahan;
        selectUrban.add(option);
        let defValue = document.createElement("option");
        defValue.selected = true;
        defValue.disabled = true;
        defValue.hidden = true;
        defValue.textContent = "Pilih Kelurahan";
        selectUrban.add(defValue);
      }
    });
});
