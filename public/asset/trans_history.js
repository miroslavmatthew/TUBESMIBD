function openForm() {

    let tiket = JSON.parse(document.querySelector(".statusBtnBooked").value)
    document.getElementById("formTable").textContent = "Table#" + tiket.noMeja;
    let tglFormatted = tiket.Tanggal.split("T")[0];
    document.getElementById("formDate").textContent = tglFormatted;
    document.getElementById("formStart").textContent = tiket.Jam;
    let start = Number(tiket.Jam.split(":")[0]) + 1;
    let end = start.toString().padStart(2, '0') + ":00:00";
    document.getElementById("formEnd").textContent = end;
    document.getElementById("formStat").textContent = tiket.Status + "\n\n\nPlease redeem this ticket to the receptionist!";
    document.getElementById("popupForm").style.display = "block";
}

function closeForm() {
    document.getElementById("popupForm").style.display = "none";
}