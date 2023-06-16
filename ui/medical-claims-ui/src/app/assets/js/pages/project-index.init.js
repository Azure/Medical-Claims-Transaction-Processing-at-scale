/**
 * Theme: T-Wind - Tailwind Admin Dashboard Template
 * Author: Mannatthemes
 * Project Dashboard Js
 */


// Radial

var options = {
    chart: {
      type: 'radialBar',
      height: 325,
      dropShadow: {
        enabled: true,
        top: 5,
        left: 0,
        bottom: 0,
        right: 0,
        blur: 5,
        color: '#45404a2e',
        opacity: 0.35
      },
    },
    plotOptions: {
      radialBar: {
        offsetY: -10,
        startAngle: 0,
        endAngle: 270,
        hollow: {
          margin: 5,
          size: '50%',
          background: 'transparent',  
        },
        track: {
          show: false,
        },
        dataLabels: {
          name: {
              fontSize: '18px',
          },
          value: {
              fontSize: '16px',
              color: '#50649c',
          },
          
        }
      },
    },
    colors: ["#2a76f4","rgba(42, 118, 244, .5)","rgba(42, 118, 244, .18)"],
    stroke: {
      lineCap: 'round'
    },
    series: [71, 63, 100],
    labels: ['Completed', 'Active', 'Assigned'],
    legend: {
      show: true,
      floating: true,
      position: 'left',
      offsetX: -10,
      offsetY: 0,
      labels: {
        colors: '#94a3b8',
        useSeriesColors: false,
      },
    },
    responsive: [{
        breakpoint: 480,
        options: {
            legend: {
                show: true,
                floating: true,
                position: 'left',
                offsetX: 10,
                offsetY: 0,
            }
        }
    }]
  }
  
  
  var chart = new ApexCharts(
    document.querySelector("#task_status"),
    options
  );
  
  chart.render()




  var options = {
    series: [{
    name: 'Inflation',
    data: [2.3, 3.1, 4.0, 10.1, 4.0, 3.6, 3.2, 2.3, 1.4, 0.8, 0.5, 0.2]
  }],
    chart: {
    height: 350,
    type: 'bar',
    toolbar: {
        show: false,
      },
    dropShadow: {
        enabled: true,
        top: 12,
        left: 0,
        bottom: 0,
        right: 0,
        blur: 2,
        color: "rgba(132, 145, 183, 0.3)",
        opacity: 0.35,
      },
  },
  plotOptions: {
    bar: {
      borderRadius: 10,
      columnWidth: '50%',
      dataLabels: {
        position: 'top', // top, center, bottom
      },
    }
  },
  colors:['#394766'],
  dataLabels: {
    enabled: true,
    formatter: function (val) {
        return "$" + val + "k"
    },
    offsetY: -20,
    style: {
      fontSize: '13px',
      fontWeight: 'normal',
      colors: ["#95aac9"]
    }
  },
  
  xaxis: {
    categories: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
    position: 'top',
    axisBorder: {
      show: false
    },
    axisTicks: {
      show: false
    },
    tooltip: {
      enabled: true,
    }
  },
  yaxis: {
    axisBorder: {
      show: false
    },
    axisTicks: {
      show: false,
    },
    labels: {
      show: false,
      formatter: function (val) {
        return "$" + val + "k"
      }
    }
  
  },
};

  var chart = new ApexCharts(document.querySelector("#budgets"), options);
  chart.render();