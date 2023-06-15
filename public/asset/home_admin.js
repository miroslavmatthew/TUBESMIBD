function openForm() {
    document.getElementById("popupForm").style.display = "block";
}

const confirm1 = document.querySelector("#submit1");
confirm1.addEventListener('click', submitForm);


let delValue;


function submitForm(){
    fetch(`addtable?no=${confirm1.value}`)
    window.location.href = "/admin";
}

function submitForm2(){
    fetch(`deltable?no=${delValue}`)
    window.location.href = "/admin";
}

function closeForm() {
    document.getElementById("popupForm").style.display = "none";
}

function openForm2(value) {
    document.getElementById("popupForm2").style.display = "block";
    delValue = value;
}

function closeForm2() {
    document.getElementById("popupForm2").style.display = "none";
}

function openForm3() {
    document.getElementById("popupForm3").style.display = "block";
}

function closeForm3() {
    document.getElementById("popupForm3").style.display = "none";
}