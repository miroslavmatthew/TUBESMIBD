const ctx = document.getElementById('myChart');
let noMej = JSON.parse(ctx.getAttribute("dataMeja"));
let dt = JSON.parse(ctx.getAttribute("dataTable"));
let listM=[];
let dumy =new Array(17).fill(0);;
let datas = [];
for (let index = 0; index < noMej.length; index++) {
    listM.push(noMej[index].noMeja);
}
for (let index = 0; index < dt.length; index++) {
  dumy[dt[index].noMeja]+=dt[index].hargaTiket;
}
for (let index = 0; index < noMej.length; index++) {
  datas.push(dumy[noMej[index].noMeja]);
}
  new Chart(ctx, {
    type: 'bar',
    data: {
      labels: listM,
      datasets: [{
        label: '# of Revenue',
        data: datas,
        borderWidth: 1
      }]
    },
    options: {
      scales: {
        y: {
          beginAtZero: true
        }
      }
    }
  });


const memberFilter = document.querySelector("#status");


let url = window.location.href;
let queryString = url.split("?")[1];
function filterBy(){
  if(memberFilter.value == "member"){
    // fetch(`filterByMember?${queryString}`).then(function (response) {
    //   return response.text();
    // })
    // .then(function (text) {
    //   username = JSON.parse(text);
    // });
    window.location.href=`/filterByMember?${queryString}`;
  }
  else{
    window.location.href=`/report?${queryString}`;
  }
}
memberFilter.addEventListener('input', filterBy);