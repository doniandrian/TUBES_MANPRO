function initializeScatterChart(data) {
  var chrt = document.getElementById("scatter-plot").getContext("2d");
  
  var scatdata = data.map(row => ({ x: row.x, y: row.y }));
  console.log(scatdata);
  var scatterChart = new Chart(chrt, {
    type: 'scatter',
    data: {
      datasets: [{
        label: 'Scatter Dataset',
        data: scatdata,
        backgroundColor: 'rgb(255, 99, 132)'
      }],
    },
    options: {
      scales: {
        x: {
          type: 'linear',
          position: 'bottom'
        }
      }
    },
  });
  return scatterChart;
}