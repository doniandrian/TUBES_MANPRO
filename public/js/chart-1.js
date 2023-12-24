var chrt = document.getElementById("scatter-plot").getContext("2d");
      var chartId = new Chart(chrt, {
         type: 'scatter',
         data : {
          datasets: [{
            label: 'Scatter Dataset',
            data: [{
              x: -10,
              y: 0
            }, {
              x: 0,
              y: 10
            }, {
              x: 10,
              y: 5
            }, {
              x: 0.5,
              y: 5.5
            }],
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