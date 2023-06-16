const ctx = document.getElementById('myChart');

  new Chart(ctx, {
    type: 'bar',
    data: {
      labels: ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange', 'Mango'],
      datasets: [{
        label: '# of Votes',
        data: [12, 19, 3, 5, 2, 3,30],
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
    fetch(`filterByMember?${queryString}`).then(function (response) {
      return response.text();
    })
    .then(function (text) {
      username = JSON.parse(text);
    });
  }
}
memberFilter.addEventListener('input', filterBy);