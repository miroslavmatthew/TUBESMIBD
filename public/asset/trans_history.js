const getPreviousDayFormatted = (dateStr) => {
    const [year, month, day] = dateStr.split('-');
    
    const currentDate = new Date(year, month - 1, day);
    currentDate.setDate(currentDate.getDate() - 1);
  
    const options = { day: 'numeric', month: 'long', year: 'numeric' };
    const formattedDate = currentDate.toLocaleDateString(undefined, options);
  
    return formattedDate;
  };

function openForm() {

    let tiket = JSON.parse(document.querySelector(".statusBtnBooked").value)
    document.getElementById("formTable").textContent = "Table#" + tiket.noMeja;
    let tglFormatted = tiket.Tanggal.split("T")[0];
    document.getElementById("formDate").textContent = getPreviousDayFormatted(tglFormatted);
    document.getElementById("formStart").textContent = tiket.Jam;
    let start = Number(tiket.Jam.split(":")[0]) + 1;
    let end = start.toString().padStart(2, '0') + ":00:00";
    document.getElementById("formEnd").textContent = end;
    document.getElementById("formStat").textContent = tiket.Status;
    document.getElementById("formMsg").textContent = "Please redeem this ticket to the receptionist";
    document.getElementById("popupForm").style.display = "block";
}

function closeForm() {
    document.getElementById("popupForm").style.display = "none";
}