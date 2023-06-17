const ctx = document.getElementById("myChart");
let noMej = JSON.parse(ctx.getAttribute("dataMeja"));
let dt = JSON.parse(ctx.getAttribute("dataTable"));
let subclass = ctx.getAttribute("subclass");
console.log(subclass);
let listM = [];
let dumy = new Array(noMej.length + 1).fill(0);
let datas = [];
let mes = "Nomor Meja";
if (subclass == "true") {
  for (let index = 0; index < noMej.length; index++) {
    listM.push(noMej[index].class);
  }
  for (let index = 0; index < dt.length; index++) {
    dumy[dt[index].id] = dt[index].total;
  }
  for (let index = 0; index < noMej.length; index++) {
    datas.push(dumy[noMej[index].id]);
  }
  mes = ctx.getAttribute("nama");
} else {
  for (let index = 0; index < noMej.length; index++) {
    listM.push(noMej[index].noMeja);
  }
  for (let index = 0; index < dt.length; index++) {
    dumy[dt[index].noMeja] += dt[index].hargaTiket;
  }
  for (let index = 0; index < noMej.length; index++) {
    datas.push(dumy[noMej[index].noMeja]);
  }
}

new Chart(ctx, {
  type: "bar",
  data: {
    labels: listM,
    datasets: [
      {
        label: "# of Revenue",
        data: datas,
        borderWidth: 1,
        backgroundColor: "#CB0033",
      },
    ],
  },
  options: {
    animation: {
      duration: 1000, // Set the animation duration in milliseconds
      easing: "easeInOutQuart", // Set the animation easing function
    },
    layout: {
      padding: {
        top: 20, // Add margin to the top
        bottom: 20, // Add margin to the bottom
        left: 20, // Add margin to the left
        right: 20, // Add margin to the right
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: "Total Pendapatan",
          color: "white",
          font: {
            size: 14,
          },
        },
        ticks: {
          color: "white",
          font: {
            size: 14,
          },
        },
      },
      x: {
        title: {
          display: true,
          text: mes,
          color: "white",
          font: {
            size: 14,
          },
        },
        ticks: {
          color: "white",
          font: {
            size: 14,
          },
        },
      },
    },
    plugins: {
      legend: {
        labels: {
          color: "white",
          font: {
            size: 14,
          },
        },
      },
    },
  },
});

const memberFilter = document.querySelector("#status");
const subCat = document.querySelector("#by");
let url = window.location.href;
let queryString = url.split("?")[1];
function filterBy() {
  if (memberFilter.value == "member") {
    // fetch(`filterByMember?${queryString}`).then(function (response) {
    //   return response.text();
    // })
    // .then(function (text) {
    //   username = JSON.parse(text);
    // });
    window.location.href = `/filterByMember?${queryString}`;
  } else {
    window.location.href = `/report?${queryString}`;
  }
}
function filterOf() {
  if (subCat.value == "district") {
    window.location.href = `/filterByDistric?${queryString}`;
  } else if (subCat.value == "subDistrict") {
    window.location.href = `/filterBySubDistric?${queryString}`;
  } else if (subCat.value == "urbanVillage") {
    window.location.href = `/filterByUrban?${queryString}`;
  } else {
    window.location.href = `/report?${queryString}`;
  }
}
memberFilter.addEventListener("input", filterBy);
subCat.addEventListener("input", filterOf);
