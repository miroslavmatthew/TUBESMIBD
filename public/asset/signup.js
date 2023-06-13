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
      defValue.value = "";
      defValue.textContent = "Pilih Kecamatan";
      selectSub.add(defValue);

      let defValueUrb = document.createElement("option");
      defValueUrb.selected = true;
      defValueUrb.disabled = true;
      defValueUrb.hidden = true;
      defValueUrb.value = "";
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
      }
      let defValue = document.createElement("option");
      defValue.selected = true;
      defValue.disabled = true;
      defValue.hidden = true;
      defValue.value = "";
      defValue.textContent = "Pilih Kelurahan";
      selectUrban.add(defValue);
    });
});

let usernames = document.getElementById("username");
let username;
const listusername = [];
let usernameAdmin = fetch("username")
  .then(function (response) {
    return response.text();
  })
  .then(function (text) {
    username = JSON.parse(text).lsusername;
    for (let index = 0; index < username.length; index++) {
      if (username[index].Username != null) {
        listusername.push(username[index].Username);
      }
      if (username[index].UsernameAdmin != null) {
        listusername.push(username[index].UsernameAdmin);
      }
    }
  });

let errMsg;
function validate(){
  let fullnamaVal = document.querySelector("#firstName").value; 
  let districtVal = document.querySelector("#district").value; 
  let subDistrictVal = document.querySelector("#subDistrict").value; 
  let urbanVal = document.querySelector("#urbanVillage").value; 
  let usernameVal = document.querySelector("#username").value; 
  let passVal = document.querySelector("#password").value; 
  let repassVal = document.querySelector("#repassword").value;
  let alamatVal = document.querySelector("#alamat").value;

  let validated = false;
  if(fullnamaVal == ""){
    errMsg = "*Enter Full Name!*"
  } else if(districtVal == ""){
    errMsg = "*Choose District!*"
  } else if(subDistrictVal == ""){
    errMsg = "*Choose Sub-District!*"
  } else if(urbanVal == ""){
    errMsg = "*Choose Urban Village!*"
  } else if(alamatVal == ""){
    errMsg = "*Enter Alamat!*"
  } else if(usernameVal == ""){
    errMsg = "*Enter Username!*"
  } else if(usernameVal.length < 8){
    errMsg = "*Username must be 8 char or more!*"
  } else if(passVal == ""){
    errMsg = "*Enter Password!*"
  } else if(repassVal == ""){
    errMsg = "*Re-enter Password!*"
  } else if(repassVal != passVal){
    errMsg = "*Make sure you re-enter the same password!*"
  } else if(listusername.includes(usernameVal)){
    errMsg = "*Username has already taken! Please re-enter another*"
  } else{
    validated = true;
  }

  document.querySelector("#err").textContent = errMsg;
  return validated;
}

let signupform = document.querySelector("#signupform");
signupform.onsubmit = validate;