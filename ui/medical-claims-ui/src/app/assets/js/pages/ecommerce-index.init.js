/**
 * Theme: T-Wind - Tailwind Admin Dashboard Template
 * Author: Mannatthemes
 * Ecommerce Dashboard Js
 */

var options = {
  chart: {
    height: 335,
    type: "area",
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
  colors: ["#f1a760", "#6d81f5"],
  dataLabels: {
    enabled: false,
  },
  stroke: {
    show: true,
    curve: "smooth",
    width: [4, 4],
    dashArray: [0, 4],
    lineCap: "round",
  },
  series: [
    {
      name: "Income",
      data: [31, 40, 28, 51, 31, 40, 28, 51, 31, 40, 28, 51],
    },
    {
      name: "Expenses",
      data: [0, 30, 10, 40, 30, 60, 50, 80, 70, 100, 90, 130],
    },
  ],
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

  yaxis: {
    labels: {
      offsetX: -12,
      offsetY: 0,
    },
  },
  grid: {
    strokeDashArray: 3,
    xaxis: {
      lines: {
        show: true,
      },
    },
    yaxis: {
      lines: {
        show: false,
      },
    },
  },
  legend: {
    show: false,
  },

  fill: {
    type: "gradient",
    gradient: {
      type: "vertical",
      shadeIntensity: 1,
      inverseColors: !1,
      opacityFrom: 0.05,
      opacityTo: 0.05,
      stops: [45, 100],
    },
  },
};

var chart = new ApexCharts(document.querySelector("#Revenu_Status"), options);
chart.render();

var chartDom = document.getElementById("weekly_report");
var myChart = echarts.init(chartDom);
var option;

option = {
  tooltip: {
    trigger: "axis",
    axisPointer: {
      type: "shadow",
    },
  },
  grid: {
    top: "10%",
    left: "3%",
    right: "4%",
    bottom: "3%",
    containLabel: true,
  },
  xAxis: [
    {
      type: "category",
      data: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
      boundaryGap: false,
      axisLine: {
        show: false,
      },
      axisLabel: {
        show: false,
      },
      axisTick: {
        show: false,
      },
      axisPointer: {
        type: "none",
      },
    },
  ],
  yAxis: [
    {
      type: "value",
      splitLine: {
        show: false,
      },
      axisLine: {
        show: false,
      },
      axisLabel: {
        show: false,
      },
      axisTick: {
        show: false,
      },
      axisPointer: {
        type: "none",
      },
    },
  ],
  tooltip: {
    show: true,
    trigger: "axis",
    padding: [5, 10],
    formatter: "{b0} : {c0}",
    transitionDuration: 0,
    backgroundColor: "rgba(133, 141, 152, 0.01)",
    borderColor: "rgba(133, 141, 152, 0.15)",
    textStyle: {
      color: "rgba(133, 141, 152, 0.9)",
    },
    borderWidth: 1,
    position: function (point, params, dom, rect, size) {
      // fixed at top
      return [point[0], "-20%"];
    },
  },
  series: [
    {
      type: "bar",
      showBackground: true,
      backgroundStyle: {
        borderRadius: 10,
      },
      z: 10,
      barWidth: "6px",
      itemStyle: {
        barBorderRadius: 10,
        color: "rgba(62, 199, 121, 0.5)",
      },
      data: [10, 52, 200, 334, 390, 330, 220],
    },
  ],
};
option && myChart.setOption(option);

var map = new jsVectorMap({
  map: "world",
  selector: "#map_1",
  zoomOnScroll: false,
  zoomButtons: false,
  selectedMarkers: [1, 1],
  markersSelectable: true,
  markers: [
    {
      name: "Russia",
      coords: [61.524, 105.3188],
      // style: { fill: 'red' }
    },
    { name: "Canada", coords: [56.1304, -106.3468] },
    { name: "Palestine", coords: [31.9474, 35.2272] },
    { name: "Greenland", coords: [71.7069, -42.6043] },
  ],
  markerStyle: {
    initial: { fill: "#5c5cff" },
    selected: { fill: "#ff5da0" },
    // initial: {
    //   image: '../../assets/images/flags/us_flag.jpg'
    // }
  },
  labels: {
    markers: {
      render: (marker) => marker.name,
    },
  },
});

var chartDom = document.getElementById("Sales");
var myChart = echarts.init(chartDom);
var option;

option = {
  tooltip: {
    show: true,
    trigger: "item",
    padding: [5, 10],
    formatter: "{b0} : {c0}",
    transitionDuration: 0,
    backgroundColor: "rgba(255, 255, 255, 0.5)",
    borderColor: "rgba(133, 141, 152, 0.15)",
    textStyle: {
      color: "rgba(0, 0, 0, 0.9)",
    },
    borderWidth: 1,
  },
  legend: {
    bottom: "0%",
    left: "center",
    orient: "horizontal",
    borderRadius: 50,
    textStyle: {
      color: '#94a3b8'
    },
  },
  series: [
    {
      name: "Access From",
      type: "pie",
      radius: ["45%", "60%"],
      avoidLabelOverlap: false,
      itemStyle: {
        borderRadius: 8,
        borderColor: "#fff",
        borderWidth: 2,
      },
      label: {
        show: false,
        position: "center",
      },
      emphasis: {
        label: {
          show: true,
          fontSize: "16",
          fontWeight: "bold",
        },
      },
      labelLine: {
        show: false,
      },
      color: ["#fb57a4", "#8092f5", "#fec23f"],
      data: [
        { value: 735, name: "Direct" },
        { value: 580, name: "Email" },
        { value: 300, name: "Video Ads" },
      ],
    },
  ],
};

option && myChart.setOption(option);
