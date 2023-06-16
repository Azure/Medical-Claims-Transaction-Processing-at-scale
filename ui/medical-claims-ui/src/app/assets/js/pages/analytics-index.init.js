/**
 * Theme: T-Wind - Tailwind Admin Dashboard Template
 * Author: Mannatthemes
 * Analytics Dashboard Js
 */

var ctx2 = document.getElementById("bar").getContext("2d");
var myChart = new Chart(ctx2, {
  type: "bar",
  data: {
    labels: [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ],
    datasets: [
      {
        label: "Monthly Report",
        data: [12, 19, 13, 9, 12, 11, 12, 19, 13, 9, 12, 11],
        borderRadius: 100,
        borderSkipped: false,
        backgroundColor: "#367de4",
        borderColor: "#367de4",
        borderWidth: 1,
        indexAxis: "x",
        barThickness: 15,
        grouped: true,
        maxBarThickness: 9,
        barPercentage: 50,
      },
      {
        label: "Monthly Report",
        data: [8, 12, 15, 11, 8, 14, 16, 13, 10, 7, 19, 16],
        borderRadius: 100,
        borderSkipped: false,
        backgroundColor: "#dbe8fa",
        borderColor: "#dbe8fa",
        borderWidth: 1,
        indexAxis: "x",
        barThickness: 15,
        grouped: true,
        maxBarThickness: 9,
      },
    ],
  },

  options: {
    maintainAspectRatio: false,
    responsive: true,
    plugins: {
      legend: {
        display: false,
        position: "top",
        labels: {
          color: "#7c8ea7",
        },
      },
      title: {
        display: false,
        text: "Chart.js Bar Chart",
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          // Include a dollar sign in the ticks
          callback: function (value, index, values) {
            return "$" + value;
          },
          color: "#7c8ea7",
        },
        grid: {
          drawBorder: "border",
          color: "rgba(132, 145, 183, 0.15)",
          borderDash: [3],
          borderColor: "rgba(132, 145, 183, 0.15)",
        },
        beginAtZero: true,
      },
      x: {
        ticks: {
          color: "#7c8ea7",
        },
        grid: {
          display: false,
          color: "rgba(132, 145, 183, 0.09)",
          borderDash: [3],
          borderColor: "rgba(132, 145, 183, 0.09)",
        },
      },
    },
  },
});

var options = {
  chart: {
    height: 255,
    type: "donut",
  },
  plotOptions: {
    pie: {
      donut: {
        size: "85%",
      },
    },
  },
  dataLabels: {
    enabled: false,
  },

  stroke: {
    show: true,
    width: 2,
    colors: ["transparent"],
  },

  series: [50, 25, 25],
  legend: {
    show: true,
    position: "bottom",
    horizontalAlign: "center",
    verticalAlign: "middle",
    floating: false,
    fontSize: "13px",
    offsetX: 0,
    offsetY: 0,
  },
  labels: ["Mobile", "Tablet", "Desktop"],
  colors: ["#2a76f4", "rgba(42, 118, 244, .5)", "rgba(42, 118, 244, .18)"],

  responsive: [
    {
      breakpoint: 600,
      options: {
        plotOptions: {
          donut: {
            customScale: 0.2,
          },
        },
        chart: {
          height: 240,
        },
        legend: {
          show: false,
        },
      },
    },
  ],
  tooltip: {
    y: {
      formatter: function (val) {
        return val + " %";
      },
    },
  },
};

var chart = new ApexCharts(document.querySelector("#ana_device"), options);
chart.render();

var chartDom = document.getElementById("visitors");
var myChart = echarts.init(chartDom);
var option;

const data = [];
for (let i = 0; i < 4; ++i) {
  data.push(Math.round(Math.random() * 200));
}
option = {
  grid: {
    left: "1%",
    right: "7%",
    bottom: "0%",
    top: "4%",
    containLabel: true,
  },
  xAxis: {
    max: "dataMax",
    axisLine: {
      lineStyle: {
        color: "#858d98",
      },
    },
    splitLine: {
      lineStyle: {
        color: "rgba(133, 141, 152, 0.1)",
      },
    },
  },
  yAxis: {
    type: "category",
    data: ["Organic", "Direct", "Campaign", "Social Media"],
    inverse: true,
    gridIndex: 0,
    animationDuration: 300,
    animationDurationUpdate: 300,
    max: 3, // only the largest 3 bars will be displayed,
    axisLabel: {
      color: "#858d98",
    },
    axisLine: {
      lineStyle: {
        color: "rgba(133, 141, 152, 0.2)",
      },
    },
    axisTick: {
      lineStyle: {
        color: "rgba(133, 141, 152, 0.5)",
      },
    },
    splitLine: {
      lineStyle: {
        color: "rgba(133, 141, 152, 0.1)",
      },
    },
  },
  series: [
    {
      realtimeSort: true,
      name: "Visitors",
      type: "bar",
      data: data,
      barWidth: "10",
      label: {
        show: true,
        position: "right",
        valueAnimation: true,
      },
      itemStyle: {
        emphasis: {
          barBorderRadius: [50, 50, 50, 50],
        },
        normal: {
          barBorderRadius: [50, 50, 50, 50],
          color: "rgba(255, 99, 108, 0.5)",
        },
      },
    },
  ],

  legend: {
    show: false,
  },
  animationDuration: 0,
  animationDurationUpdate: 3000,
  animationEasing: "linear",
  animationEasingUpdate: "linear",
};
function run() {
  for (var i = 0; i < data.length; ++i) {
    if (Math.random() > 0.9) {
      data[i] += Math.round(Math.random() * 2000);
    } else {
      data[i] += Math.round(Math.random() * 200);
    }
  }
  myChart.setOption({
    series: [
      {
        type: "bar",
        data,
      },
    ],
  });
}
setTimeout(function () {
  run();
}, 0);
setInterval(function () {
  run();
}, 3000);

option && myChart.setOption(option);
