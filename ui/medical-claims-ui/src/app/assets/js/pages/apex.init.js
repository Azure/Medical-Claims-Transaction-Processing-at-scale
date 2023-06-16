/**
 * Theme: T-Wind - Tailwind Admin Dashboard Template
 * Author: Mannatthemes
 * File: Apex Js
 */

 var options = {
    series: [{
      name: "Desktops",
      data: [10, 41, 35, 51, 49, 62, 69, 91, 148]
  }],
    chart: {
    height: 350,
    type: 'line',
    zoom: {
      enabled: false
    }
  },
  colors: ['#008ffb'],
  dataLabels: {
    enabled: false
  },
  stroke: {
    curve: 'straight',
    width: [3],
  },
  title: {
    text: 'Product Trends by Month',
    align: 'left'
  },  
  grid: {
    row: {
      colors: ['#f3f3f3', 'transparent'], // takes an array which will be repeated on columns
      opacity: 0.5
    },
  },
  xaxis: {
    categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep'],
  }
  };

  var chart = new ApexCharts(document.querySelector("#apex_line1"), options);
  chart.render();


    //line-2

    var ts2 = 1484418600000;
  var dates = [];
  var spikes = [5, -5, 3, -3, 8, -8]
  for (var i = 0; i < 120; i++) {
    ts2 = ts2 + 86400000;
    var innerArr = [ts2, dataSeries[1][i].value];
    dates.push(innerArr)
  }
    var options = {
        series: [{
        name: 'XYZ MOTORS',
        data: dates
      }],
        chart: {
        type: 'area',
        stacked: false,
        height: 350,
        zoom: {
          type: 'x',
          enabled: true,
          autoScaleYaxis: true
        },
        toolbar: {
          autoSelected: 'zoom'
        }
      },
      stroke: {
        width: [3],
      },
      dataLabels: {
        enabled: false
      },
      markers: {
        size: 0,
      },
      
      fill: {
        type: 'gradient',
        gradient: {
          shadeIntensity: 1,
          inverseColors: false,
          opacityFrom: 0.5,
          opacityTo: 0,
          stops: [0, 90, 100]
        },
      },
      yaxis: {
        labels: {
          formatter: function (val) {
            return (val / 1000000).toFixed(0);
          },
        },
        title: {
          text: 'Price'
        },
      },
      xaxis: {
        type: 'datetime',
      },
      tooltip: {
        shared: false,
        y: {
          formatter: function (val) {
            return (val / 1000000).toFixed(0)
          }
        }
      }
      };

      var chart = new ApexCharts(document.querySelector("#apex_line2"), options);
      chart.render();


      var options = {
        chart: {
            height: 360,
            type: 'area',
            stacked: true,
            toolbar: {
              show: false,
              autoSelected: 'zoom'
            },
        },
        colors: ['#2a77f4', '#a5c2f1'],
        dataLabels: {
            enabled: false
        },
        stroke: {
            curve: 'smooth',
            width: [3, 3],
            dashArray: [0, 4],
            lineCap: 'round'
        },
        grid: {
          borderColor: "#45404a2e",
          padding: {
            left: 0,
            right: 0
          },
          strokeDashArray: 4,
        },
        markers: {
          size: 0,
          hover: {
            size: 0
          }
        },
        series: [{
            name: 'New Visits',
            data: [0,60,20,90,45,110,55,130,44,110,75,120]
        }, {
            name: 'Unique Visits',
            data: [0,45,10,75,35,94,40,115,30,105,65,110]
        }],
      
        xaxis: {
            type: 'month',
            categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
            axisBorder: {
              show: true,
              color: '#45404a2e',
            },  
            axisTicks: {
              show: true,
              color: '#45404a2e',
            },                  
        },
        fill: {
          type: "gradient",
          gradient: {
            shadeIntensity: 1,
            opacityFrom: 0.4,
            opacityTo: 0.3,
            stops: [0, 90, 100]
          }
        },
        
        tooltip: {
            x: {
                format: 'dd/MM/yy HH:mm'
            },
        },
        legend: {
          position: 'top',
          horizontalAlign: 'right'
        },
      }
      
      var chart = new ApexCharts(
        document.querySelector("#apex_area1"),
        options
      );
      
      chart.render();

      //Area-2
  document.addEventListener('DOMContentLoaded', function() {
    var options = {
        annotations: {
        yaxis: [{
            y: 30,
            borderColor: '#999',
            label: {
            show: true,
            text: 'Support',
            style: {
                color: "#fff",
                background: '#03d87f'
            }
          }
        }],
        xaxis: [{
            x: new Date('14 Nov 2012').getTime(),
            borderColor: '#999',
            yAxisIndex: 0,
            label: {
              show: true,
              text: 'Rally',
              style: {
                  color: "#fff",
                  background: '#ffb822'
              }
            },
          }]
        },
        chart: {
          type: 'area',
          height: 350,
        },
        stroke: {
          width: [3],
        },
        dataLabels: {
          enabled: false
        },
        series: [{
            data:[
            [1327359600000,30.95],
            [1327446000000,31.34],
            [1327532400000,31.18],
            [1327618800000,31.05],
            [1327878000000,31.00],
            [1327964400000,30.95],
            [1328050800000,31.24],
            [1328137200000,31.29],
            [1328223600000,31.85],
            [1328482800000,31.86],
            [1328569200000,32.28],
            [1328655600000,32.10],
            [1328742000000,32.65],
            [1328828400000,32.21],
            [1329087600000,32.35],
            [1329174000000,32.44],
            [1329260400000,32.46],
            [1329346800000,32.86],
            [1329433200000,32.75],
            [1329778800000,32.54],
            [1329865200000,32.33],
            [1329951600000,32.97],
            [1330038000000,33.41],
            [1330297200000,33.27],
            [1330383600000,33.27],
            [1330470000000,32.89],
            [1330556400000,33.10],
            [1330642800000,33.73],
            [1330902000000,33.22],
            [1330988400000,31.99],
            [1331074800000,32.41],
            [1331161200000,33.05],
            [1331247600000,33.64],
            [1331506800000,33.56],
            [1331593200000,34.22],
            [1331679600000,33.77],
            [1331766000000,34.17],
            [1331852400000,33.82],
            [1332111600000,34.51],
            [1332198000000,33.16],
            [1332284400000,33.56],
            [1332370800000,33.71],
            [1332457200000,33.81],
            [1332712800000,34.40],
            [1332799200000,34.63],
            [1332885600000,34.46],
            [1332972000000,34.48],
            [1333058400000,34.31],
            [1333317600000,34.70],
            [1333404000000,34.31],
            [1333490400000,33.46],
            [1333576800000,33.59],
            [1333922400000,33.22],
            [1334008800000,32.61],
            [1334095200000,33.01],
            [1334181600000,33.55],
            [1334268000000,33.18],
            [1334527200000,32.84],
            [1334613600000,33.84],
            [1334700000000,33.39],
            [1334786400000,32.91],
            [1334872800000,33.06],
            [1335132000000,32.62],
            [1335218400000,32.40],
            [1335304800000,33.13],
            [1335391200000,33.26],
            [1335477600000,33.58],
            [1335736800000,33.55],
            [1335823200000,33.77],
            [1335909600000,33.76],
            [1335996000000,33.32],
            [1336082400000,32.61],
            [1336341600000,32.52],
            [1336428000000,32.67],
            [1336514400000,32.52],
            [1336600800000,31.92],
            [1336687200000,32.20],
            [1336946400000,32.23],
            [1337032800000,32.33],
            [1337119200000,32.36],
            [1337205600000,32.01],
            [1337292000000,31.31],
            [1337551200000,32.01],
            [1337637600000,32.01],
            [1337724000000,32.18],
            [1337810400000,31.54],
            [1337896800000,31.60],
            [1338242400000,32.05],
            [1338328800000,31.29],
            [1338415200000,31.05],
            [1338501600000,29.82],
            [1338760800000,30.31],
            [1338847200000,30.70],
            [1338933600000,31.69],
            [1339020000000,31.32],
            [1339106400000,31.65],
            [1339365600000,31.13],
            [1339452000000,31.77],
            [1339538400000,31.79],
            [1339624800000,31.67],
            [1339711200000,32.39],
            [1339970400000,32.63],
            [1340056800000,32.89],
            [1340143200000,31.99],
            [1340229600000,31.23],
            [1340316000000,31.57],
            [1340575200000,30.84],
            [1340661600000,31.07],
            [1340748000000,31.41],
            [1340834400000,31.17],
            [1340920800000,32.37],
            [1341180000000,32.19],
            [1341266400000,32.51],
            [1341439200000,32.53],
            [1341525600000,31.37],
            [1341784800000,30.43],
            [1341871200000,30.44],
            [1341957600000,30.20],
            [1342044000000,30.14],
            [1342130400000,30.65],
            [1342389600000,30.40],
            [1342476000000,30.65],
            [1342562400000,31.43],
            [1342648800000,31.89],
            [1342735200000,31.38],
            [1342994400000,30.64],
            [1343080800000,30.02],
            [1343167200000,30.33],
            [1343253600000,30.95],
            [1343340000000,31.89],
            [1343599200000,31.01],
            [1343685600000,30.88],
            [1343772000000,30.69],
            [1343858400000,30.58],
            [1343944800000,32.02],
            [1344204000000,32.14],
            [1344290400000,32.37],
            [1344376800000,32.51],
            [1344463200000,32.65],
            [1344549600000,32.64],
            [1344808800000,32.27],
            [1344895200000,32.10],
            [1344981600000,32.91],
            [1345068000000,33.65],
            [1345154400000,33.80],
            [1345413600000,33.92],
            [1345500000000,33.75],
            [1345586400000,33.84],
            [1345672800000,33.50],
            [1345759200000,32.26],
            [1346018400000,32.32],
            [1346104800000,32.06],
            [1346191200000,31.96],
            [1346277600000,31.46],
            [1346364000000,31.27],
            [1346709600000,31.43],
            [1346796000000,32.26],
            [1346882400000,32.79],
            [1346968800000,32.46],
            [1347228000000,32.13],
            [1347314400000,32.43],
            [1347400800000,32.42],
            [1347487200000,32.81],
            [1347573600000,33.34],
            [1347832800000,33.41],
            [1347919200000,32.57],
            [1348005600000,33.12],
            [1348092000000,34.53],
            [1348178400000,33.83],
            [1348437600000,33.41],
            [1348524000000,32.90],
            [1348610400000,32.53],
            [1348696800000,32.80],
            [1348783200000,32.44],
            [1349042400000,32.62],
            [1349128800000,32.57],
            [1349215200000,32.60],
            [1349301600000,32.68],
            [1349388000000,32.47],
            [1349647200000,32.23],
            [1349733600000,31.68],
            [1349820000000,31.51],
            [1349906400000,31.78],
            [1349992800000,31.94],
            [1350252000000,32.33],
            [1350338400000,33.24],
            [1350424800000,33.44],
            [1350511200000,33.48],
            [1350597600000,33.24],
            [1350856800000,33.49],
            [1350943200000,33.31],
            [1351029600000,33.36],
            [1351116000000,33.40],
            [1351202400000,34.01],
            [1351638000000,34.02],
            [1351724400000,34.36],
            [1351810800000,34.39],
            [1352070000000,34.24],
            [1352156400000,34.39],
            [1352242800000,33.47],
            [1352329200000,32.98],
            [1352415600000,32.90],
            [1352674800000,32.70],
            [1352761200000,32.54],
            [1352847600000,32.23],
            [1352934000000,32.64],
            [1353020400000,32.65],
            [1353279600000,32.92],
            [1353366000000,32.64],
            [1353452400000,32.84],
            [1353625200000,33.40],
            [1353884400000,33.30],
            [1353970800000,33.18],
            [1354057200000,33.88],
            [1354143600000,34.09],
            [1354230000000,34.61],
            [1354489200000,34.70],
            [1354575600000,35.30],
            [1354662000000,35.40],
            [1354748400000,35.14],
            [1354834800000,35.48],
            [1355094000000,35.75],
            [1355180400000,35.54],
            [1355266800000,35.96],
            [1355353200000,35.53],
            [1355439600000,37.56],
            [1355698800000,37.42],
            [1355785200000,37.49],
            [1355871600000,38.09],
            [1355958000000,37.87],
            [1356044400000,37.71],
            [1356303600000,37.53],
            [1356476400000,37.55],
            [1356562800000,37.30],
            [1356649200000,36.90],
            [1356908400000,37.68],
            [1357081200000,38.34],
            [1357167600000,37.75],
            [1357254000000,38.13],
            [1357513200000,37.94],
            [1357599600000,38.14],
            [1357686000000,38.66],
            [1357772400000,38.62],
            [1357858800000,38.09],
            [1358118000000,38.16],
            [1358204400000,38.15],
            [1358290800000,37.88],
            [1358377200000,37.73],
            [1358463600000,37.98],
            [1358809200000,37.95],
            [1358895600000,38.25],
            [1358982000000,38.10],
            [1359068400000,38.32],
            [1359327600000,38.24],
            [1359414000000,38.52],
            [1359500400000,37.94],
            [1359586800000,37.83],
            [1359673200000,38.34],
            [1359932400000,38.10],
            [1360018800000,38.51],
            [1360105200000,38.40],
            [1360191600000,38.07],
            [1360278000000,39.12],
            [1360537200000,38.64],
            [1360623600000,38.89],
            [1360710000000,38.81],
            [1360796400000,38.61],
            [1360882800000,38.63],
            [1361228400000,38.99],
            [1361314800000,38.77],
            [1361401200000,38.34],
            [1361487600000,38.55],
            [1361746800000,38.11],
            [1361833200000,38.59],
            [1361919600000,39.60],
            ]
            
          },
        ],
        markers: {
          size: 0,
          style: 'hollow',
        },
        xaxis: {
          type: 'datetime',
          min: new Date('01 Mar 2012').getTime(),
          tickAmount: 6,
          axisBorder: {
            show: true,
            color: '#bec7e0',
          },  
          axisTicks: {
            show: true,
            color: '#bec7e0',
          },    
        },
        colors: ['#008ffb'],
        tooltip: {
          x: {
              format: 'dd MMM yyyy'
          }
        },
        fill: {
          type: 'gradient',
          gradient: {
              shadeIntensity: 1,
              opacityFrom: 0.7,
              opacityTo: 0.4,
              stops: [0, 100]
          }
        },
    }

    var chart = new ApexCharts(
        document.querySelector("#apex_area2"),
        options
    );

    chart.render();

    var resetCssClasses = function (activeEl) {
        var els = document.querySelectorAll("button");
        Array.prototype.forEach.call(els, function (el) {
        el.classList.remove('active');
        });

        activeEl.target.classList.add('active')
    }

    document.querySelector("#one_month").addEventListener('click', function (e) {
        resetCssClasses(e)
        chart.updateOptions({
        xaxis: {
            min: new Date('28 Jan 2013').getTime(),
            max: new Date('27 Feb 2013').getTime(),
        }
      })
    })

    document.querySelector("#six_months").addEventListener('click', function (e) {
        resetCssClasses(e)
        chart.updateOptions({
        xaxis: {
            min: new Date('27 Sep 2012').getTime(),
            max: new Date('27 Feb 2013').getTime(),
        }
      })
    })

    document.querySelector("#one_year").addEventListener('click', function (e) {
        resetCssClasses(e)
        chart.updateOptions({
        xaxis: {
            min: new Date('27 Feb 2012').getTime(),
            max: new Date('27 Feb 2013').getTime(),
        }
      })
    })

    document.querySelector("#ytd").addEventListener('click', function (e) {
        resetCssClasses(e)
        chart.updateOptions({
        xaxis: {
            min: new Date('01 Jan 2013').getTime(),
            max: new Date('27 Feb 2013').getTime(),
        }
      })
    })

    document.querySelector("#all").addEventListener('click', function (e) {
        resetCssClasses(e)
        chart.updateOptions({
        xaxis: {
            min: undefined,
            max: undefined,
        }
      })
    })

    document.querySelector("#ytd").addEventListener('click', function () {

    })
  })

 //colunm-1
  
 var options = {
  chart: {
      height: 396,
      type: 'bar',
      toolbar: {
          show: false
      },
  },
  plotOptions: {
      bar: {
          horizontal: false,
          endingShape: 'rounded',
          columnWidth: '55%',
      },
  },
  dataLabels: {
      enabled: false
  },
  stroke: {
      show: true,
      width: 2,
      colors: ['transparent']
  },
  colors: ["rgba(42, 118, 244, .18)", '#2a76f4', "rgba(251, 182, 36, .6)"],
  series: [{
      name: 'Net Profit',
      data: [44, 55, 57, 56, 61, 58, 63, 60, 66]
  }, {
      name: 'Revenue',
      data: [76, 85, 101, 98, 87, 105, 91, 114, 94]
  }, {
      name: 'Free Cash Flow',
      data: [35, 41, 36, 26, 45, 48, 52, 53, 41]
  }],
  xaxis: {
      categories: ['Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct'],
      axisBorder: {
          show: true,
          color: '#bec7e0',
        },  
        axisTicks: {
          show: true,
          color: '#bec7e0',
      },    
  },
  legend: {
      offsetY: 6,
  },
  yaxis: {
      title: {
          text: '$ (thousands)'
      }
  },
  fill: {
      opacity: 1

  },
  // legend: {
  //     floating: true
  // },
  grid: {
      row: {
          colors: ['transparent', 'transparent'], // takes an array which will be repeated on columns
          opacity: 0.2
      },
      borderColor: '#f1f3fa'
  },
  tooltip: {
      y: {
          formatter: function (val) {
              return "$ " + val + " thousands"
          }
      }
  }
}

var chart = new ApexCharts(
  document.querySelector("#apex_column1"),
  options
);

chart.render();

//apex-column-2


var options = {
  chart: {
      height: 380,
      type: 'bar',
      toolbar: {
          show: false
      },
  },
  plotOptions: {
      bar: {
          dataLabels: {
              position: 'top', // top, center, bottom
          },
      }
  },
  dataLabels: {
      enabled: true,
      formatter: function (val) {
          return val + "%";
      },
      offsetY: -20,
      style: {
          fontSize: '12px',
          colors: ["#304758"]
      }
  },
  colors: ["#2a76f4"],
  series: [{
      name: 'Inflation',
      data: [2.3, 3.1, 4.0, 10.1, 4.0, 3.6, 3.2, 2.3, 1.4, 0.8, 0.5, 0.2]
  }],
  xaxis: {
      categories: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
      position: 'top',
      labels: {
          offsetY: -18,

      },
      axisBorder: {
          show: true,
          color: '#28365f',
      },
      axisTicks: {
          show: true,
          color: '#28365f',
      },
      crosshairs: {
          fill: {
              type: 'gradient',
              gradient: {
                  colorFrom: '#D8E3F0',
                  colorTo: '#BED1E6',
                  stops: [0, 100],
                  opacityFrom: 0.4,
                  opacityTo: 0.5,
              }
          }
      },
      tooltip: {
          enabled: true,
          offsetY: -35,

      }
  },
  fill: {
      gradient: {
          enabled: false,
          shade: 'light',
          type: "horizontal",
          shadeIntensity: 0.25,
          gradientToColors: undefined,
          inverseColors: true,
          opacityFrom: 1,
          opacityTo: 1,
          stops: [50, 0, 100, 100]
      },
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
              return val + "%";
          }
      }

  },
  title: {
      text: 'Monthly Inflation in Argentina, 2002',
      floating: true,
      offsetY: 350,
      align: 'center',
      style: {
          color: '#8997bd'
      }
  },
  grid: {
      row: {
          colors: ['#afb7d21a', 'transparent'], // takes an array which will be repeated on columns
          opacity: 0.2
      },
      borderColor: '#f1f3fa'
  }
}

var chart = new ApexCharts(
  document.querySelector("#apex_column2"),
  options
);

chart.render();


// apex-bar-1

var options = {
  chart: {
      height: 380,
      type: 'bar',
      toolbar: {
          show: false
      },
  },
  plotOptions: {
      bar: {
          horizontal: true,
      }
  },
  dataLabels: {
      enabled: false
  },
  series: [{
      data: [400, 430, 448, 470, 540, 580, 690, 1100, 1200, 1380]
  }],
  colors: ["#2a76f4"],
  yaxis: {
      axisBorder: {
          show: true,
          color: '#bec7e0',
        },  
        axisTicks: {
          show: true,
          color: '#bec7e0',
      }, 
  },
  xaxis: {
      categories: ['South Korea', 'Canada', 'United Kingdom', 'Netherlands', 'Italy', 'France', 'Japan', 'United States', 'China', 'Germany'],        
  },
  states: {
      hover: {
          filter: 'none'
      }
  },
  grid: {
      borderColor: '#f1f3fa'
  }
}

var chart = new ApexCharts(
  document.querySelector("#apex_bar"),
  options
);

chart.render();

//Mixed-2


var options = {
  chart: {
      height: 380,
      type: 'line',
      stacked: false,
      toolbar: {
          show: false
      },
  },
  dataLabels: {
      enabled: false
  },
  stroke: {
      width: [0, 0, 3]
  },
  series: [{
      name: 'Income',
      type: 'column',
      data: [1.4, 2, 2.5, 1.5, 2.5, 2.8, 3.8, 4.6]
  }, {
      name: 'Cashflow',
      type: 'column',
      data: [1.1, 3, 3.1, 4, 4.1, 4.9, 6.5, 8.5]
  }, {
      name: 'Revenue',
      type: 'line',
      data: [20, 29, 37, 36, 44, 45, 50, 58]
  }],
  colors: ["rgba(42, 118, 244, .18)", '#2a76f4', "rgba(251, 182, 36, .6)"],
  xaxis: {
      categories: [2009, 2010, 2011, 2012, 2013, 2014, 2015, 2016],
      axisBorder: {
        show: true,
        color: '#bec7e0',
      },  
      axisTicks: {
        show: true,
        color: '#bec7e0',
    }, 
  },
  yaxis: [
      {
          axisTicks: {
              show: true,
          },
          axisBorder: {
              show: true,
              color: '#20016c'
          },
          labels: {
              style: {
                  color: '#20016c',
              }
          },
          title: {
              text: "Income (thousand crores)"
          },
      },

      {
          axisTicks: {
              show: true,
          },
          axisBorder: {
              show: true,
              color: '#77d0ba'
          },
          labels: {
              style: {
                  color: '#77d0ba',
              },
              offsetX: 10
          },
          title: {
              text: "Operating Cashflow (thousand crores)",
          },
      },
      {
          opposite: true,
          axisTicks: {
              show: true,
          },
          axisBorder: {
              show: true,
              color: '#fa5c7c'
          },
          labels: {
              style: {
                  color: '#fa5c7c',
              }
          },
          title: {
              text: "Revenue (thousand crores)"
          }
      },

  ],
  tooltip: {
      followCursor: true,
      y: {
          formatter: function (y) {
              if (typeof y !== "undefined") {
                  return y + " thousand crores"
              }
              return y;
          }
      }
  },
  grid: {
      borderColor: '#f1f3fa'
  },
  legend: {
      offsetY: 6,
  },
  responsive: [{
      breakpoint: 600,
      options: {
          yaxis: {
              show: false
          },
          legend: {
              show: false
          }
      }
  }]
}

var chart = new ApexCharts(
  document.querySelector("#apex_mixed"),
  options
);

chart.render();

//apex-bubble2

/*
// this function will generate output in this format
// data = [
  [timestamp, 23],
  [timestamp, 33],
  [timestamp, 12]
  ...
]
*/
function generateData1(baseval1, count, yrange) {
  var i = 0;
  var series = [];
  while (i < count) {
      //var x =Math.floor(Math.random() * (750 - 1 + 1)) + 1;;
      var y = Math.floor(Math.random() * (yrange.max - yrange.min + 1)) + yrange.min;
      var z = Math.floor(Math.random() * (75 - 15 + 1)) + 15;

      series.push([baseval1, y, z]);
      baseval1 += 86400000;
      i++;
  }
  return series;
}


var options2 = {
  chart: {
      height: 380,
      type: 'bubble',
      toolbar: {
          show: false
      },
  },
  dataLabels: {
      enabled: false
  },
  series: [{
      name: 'Product 1',
      data: generateData1(new Date('11 Feb 2017 GMT').getTime(), 20, {
          min: 10,
          max: 60
      })
  },
  {
      name: 'Product 2',
      data: generateData1(new Date('11 Feb 2017 GMT').getTime(), 20, {
          min: 10,
          max: 60
      })
  },
  {
      name: 'Product 3',
      data: generateData1(new Date('11 Feb 2017 GMT').getTime(), 20, {
          min: 10,
          max: 60
      })
  },
  {
      name: 'Product 4',
      data: generateData1(new Date('11 Feb 2017 GMT').getTime(), 20, {
          min: 10,
          max: 60
      })
  }
  ],
  fill: {
      type: 'gradient',
  },
  colors: ["#727cf5", "#0acf97", "#fa5c7c", "#39afd1"],
  xaxis: {
      tickAmount: 12,
      type: 'datetime',

      labels: {
          rotate: 0,
      },
      axisBorder: {
        show: true,
        color: '#bec7e0',
      },  
      axisTicks: {
        show: true,
        color: '#bec7e0',
    }, 
  },
  yaxis: {
      max: 70
  },
  legend: {
      offsetY: 6,
  },
  grid: {
      borderColor: '#f1f3fa'
  }
}

var chart = new ApexCharts(
  document.querySelector("#apex_bubble"),
  options2
);

chart.render();

// Candlestick

var options = {
  chart: {
    height: 320,
    type: 'candlestick',
    toolbar: {
      show: false,
    },
  },
  series: [{
    data: [{
        x: new Date(1538778600000),
        y: [6629.81, 6650.5, 6623.04, 6633.33]
      },
      {
        x: new Date(1538780400000),
        y: [6632.01, 6643.59, 6620, 6630.11]
      },
      {
        x: new Date(1538782200000),
        y: [6630.71, 6648.95, 6623.34, 6635.65]
      },
      {
        x: new Date(1538784000000),
        y: [6635.65, 6651, 6629.67, 6638.24]
      },
      {
        x: new Date(1538785800000),
        y: [6638.24, 6640, 6620, 6624.47]
      },
      {
        x: new Date(1538787600000),
        y: [6624.53, 6636.03, 6621.68, 6624.31]
      },
      {
        x: new Date(1538789400000),
        y: [6624.61, 6632.2, 6617, 6626.02]
      },
      {
        x: new Date(1538791200000),
        y: [6627, 6627.62, 6584.22, 6603.02]
      },
      {
        x: new Date(1538793000000),
        y: [6605, 6608.03, 6598.95, 6604.01]
      },
      {
        x: new Date(1538794800000),
        y: [6604.5, 6614.4, 6602.26, 6608.02]
      },
      {
        x: new Date(1538796600000),
        y: [6608.02, 6610.68, 6601.99, 6608.91]
      },
      {
        x: new Date(1538798400000),
        y: [6608.91, 6618.99, 6608.01, 6612]
      },
      {
        x: new Date(1538800200000),
        y: [6612, 6615.13, 6605.09, 6612]
      },
      {
        x: new Date(1538802000000),
        y: [6612, 6624.12, 6608.43, 6622.95]
      },
      {
        x: new Date(1538803800000),
        y: [6623.91, 6623.91, 6615, 6615.67]
      },
      {
        x: new Date(1538805600000),
        y: [6618.69, 6618.74, 6610, 6610.4]
      },
      {
        x: new Date(1538807400000),
        y: [6611, 6622.78, 6610.4, 6614.9]
      },
      {
        x: new Date(1538809200000),
        y: [6614.9, 6626.2, 6613.33, 6623.45]
      },
      {
        x: new Date(1538811000000),
        y: [6623.48, 6627, 6618.38, 6620.35]
      },
      {
        x: new Date(1538812800000),
        y: [6619.43, 6620.35, 6610.05, 6615.53]
      },
      {
        x: new Date(1538814600000),
        y: [6615.53, 6617.93, 6610, 6615.19]
      },
      {
        x: new Date(1538816400000),
        y: [6615.19, 6621.6, 6608.2, 6620]
      },
      {
        x: new Date(1538818200000),
        y: [6619.54, 6625.17, 6614.15, 6620]
      },
      {
        x: new Date(1538820000000),
        y: [6620.33, 6634.15, 6617.24, 6624.61]
      },
      {
        x: new Date(1538821800000),
        y: [6625.95, 6626, 6611.66, 6617.58]
      },
      {
        x: new Date(1538823600000),
        y: [6619, 6625.97, 6595.27, 6598.86]
      },
      {
        x: new Date(1538825400000),
        y: [6598.86, 6598.88, 6570, 6587.16]
      },
      {
        x: new Date(1538827200000),
        y: [6588.86, 6600, 6580, 6593.4]
      },
      {
        x: new Date(1538829000000),
        y: [6593.99, 6598.89, 6585, 6587.81]
      },
      {
        x: new Date(1538830800000),
        y: [6587.81, 6592.73, 6567.14, 6578]
      },
      {
        x: new Date(1538832600000),
        y: [6578.35, 6581.72, 6567.39, 6579]
      },
      {
        x: new Date(1538834400000),
        y: [6579.38, 6580.92, 6566.77, 6575.96]
      },
      {
        x: new Date(1538836200000),
        y: [6575.96, 6589, 6571.77, 6588.92]
      },
      {
        x: new Date(1538838000000),
        y: [6588.92, 6594, 6577.55, 6589.22]
      },
      {
        x: new Date(1538839800000),
        y: [6589.3, 6598.89, 6589.1, 6596.08]
      },
      {
        x: new Date(1538841600000),
        y: [6597.5, 6600, 6588.39, 6596.25]
      },
      {
        x: new Date(1538843400000),
        y: [6598.03, 6600, 6588.73, 6595.97]
      },
      {
        x: new Date(1538845200000),
        y: [6595.97, 6602.01, 6588.17, 6602]
      },
      {
        x: new Date(1538847000000),
        y: [6602, 6607, 6596.51, 6599.95]
      },
      {
        x: new Date(1538848800000),
        y: [6600.63, 6601.21, 6590.39, 6591.02]
      },
      {
        x: new Date(1538850600000),
        y: [6591.02, 6603.08, 6591, 6591]
      },
      {
        x: new Date(1538852400000),
        y: [6591, 6601.32, 6585, 6592]
      },
      {
        x: new Date(1538854200000),
        y: [6593.13, 6596.01, 6590, 6593.34]
      },
      {
        x: new Date(1538856000000),
        y: [6593.34, 6604.76, 6582.63, 6593.86]
      },
      {
        x: new Date(1538857800000),
        y: [6593.86, 6604.28, 6586.57, 6600.01]
      },
      {
        x: new Date(1538859600000),
        y: [6601.81, 6603.21, 6592.78, 6596.25]
      },
      {
        x: new Date(1538861400000),
        y: [6596.25, 6604.2, 6590, 6602.99]
      },
      {
        x: new Date(1538863200000),
        y: [6602.99, 6606, 6584.99, 6587.81]
      },
      {
        x: new Date(1538865000000),
        y: [6587.81, 6595, 6583.27, 6591.96]
      },
      {
        x: new Date(1538866800000),
        y: [6591.97, 6596.07, 6585, 6588.39]
      },
      {
        x: new Date(1538868600000),
        y: [6587.6, 6598.21, 6587.6, 6594.27]
      },
      {
        x: new Date(1538870400000),
        y: [6596.44, 6601, 6590, 6596.55]
      },
      {
        x: new Date(1538872200000),
        y: [6598.91, 6605, 6596.61, 6600.02]
      },
      {
        x: new Date(1538874000000),
        y: [6600.55, 6605, 6589.14, 6593.01]
      },
      {
        x: new Date(1538875800000),
        y: [6593.15, 6605, 6592, 6603.06]
      },
      {
        x: new Date(1538877600000),
        y: [6603.07, 6604.5, 6599.09, 6603.89]
      },
      {
        x: new Date(1538879400000),
        y: [6604.44, 6604.44, 6600, 6603.5]
      },
      {
        x: new Date(1538881200000),
        y: [6603.5, 6603.99, 6597.5, 6603.86]
      },
      {
        x: new Date(1538883000000),
        y: [6603.85, 6605, 6600, 6604.07]
      },
      {
        x: new Date(1538884800000),
        y: [6604.98, 6606, 6604.07, 6606]
      },
    ]
  }],
  
  xaxis: {
    type: 'datetime',
    axisBorder: {
      show: true,
      color: '#bec7e0',
    },  
    axisTicks: {
      show: true,
      color: '#bec7e0',
    },    
  },
  yaxis: {
      labels: {
          formatter: function (value) {
              return "$" + value ;
          }
      },
      tooltip: {
          enabled: true
      }
  },
  grid: {
    strokeDashArray: 4,
  },
}

var chart = new ApexCharts(
  document.querySelector("#apex_candlestick"),
  options
);

chart.render();

// Treemap

var options = {
  series: [
  {
    data: [
      {
        x: 'New Delhi',
        y: 218
      },
      {
        x: 'Kolkata',
        y: 149
      },
      {
        x: 'Mumbai',
        y: 184
      },
      {
        x: 'Ahmedabad',
        y: 55
      },
      {
        x: 'Bangaluru',
        y: 84
      },
      {
        x: 'Pune',
        y: 31
      },
      {
        x: 'Chennai',
        y: 70
      },
      {
        x: 'Jaipur',
        y: 30
      },
      {
        x: 'Surat',
        y: 44
      },
      {
        x: 'Hyderabad',
        y: 68
      },
      {
        x: 'Lucknow',
        y: 28
      },
      {
        x: 'Indore',
        y: 19
      },
      {
        x: 'Kanpur',
        y: 29
      }
    ]
  }
],
  legend: {
  show: false
},
chart: {
  height: 350,
  type: 'treemap',
  toolbar: {
    show: false,
  },
},

};

var chart = new ApexCharts(document.querySelector("#treemap_1"), options);
chart.render();

var options = {
  series: [
  {
    data: [
      {
        x: 'New Delhi',
        y: 218
      },
      {
        x: 'Kolkata',
        y: 149
      },
      {
        x: 'Mumbai',
        y: 184
      },
      {
        x: 'Ahmedabad',
        y: 55
      },
      {
        x: 'Bangaluru',
        y: 84
      },
      {
        x: 'Pune',
        y: 31
      },
      {
        x: 'Chennai',
        y: 70
      },
      {
        x: 'Jaipur',
        y: 30
      },
      {
        x: 'Surat',
        y: 44
      },
      {
        x: 'Hyderabad',
        y: 68
      },
      {
        x: 'Lucknow',
        y: 28
      },
      {
        x: 'Indore',
        y: 19
      },
      {
        x: 'Kanpur',
        y: 29
      }
    ]
  }
],
  legend: {
  show: false
},
chart: {
  height: 350,
  type: 'treemap',
  toolbar: {
    show: false,
  },
},

colors: [
  '#3B93A5',
  '#F7B844',
  '#ADD8C7',
  '#EC3C65',
  '#CDD7B6',
  '#C1F666',
  '#D43F97',
  '#1E5D8C',
  '#421243',
  '#7F94B0',
  '#EF6537',
  '#C0ADDB'
],
plotOptions: {
  treemap: {
    distributed: true,
    enableShades: false
  }
}
};

var chart = new ApexCharts(document.querySelector("#treemap_2"), options);
chart.render();

// Polar Area

var options = {
  series: [14, 23, 21, 17, 15, 10, 12, 17, 21],
  chart: {
  type: 'polarArea',
  width: 380,
},
stroke: {
  colors: ['#fff']
},
fill: {
  opacity: 0.8
},
responsive: [{
  breakpoint: 480,
  options: {
    chart: {
      width: 200
    },
    legend: {
      position: 'bottom'
    }
  }
}]
};

var chart = new ApexCharts(document.querySelector("#polar_Area_1"), options);
chart.render();

var options = {
  series: [42, 47, 52, 58, 65],
  chart: {
  width: 380,
  type: 'polarArea'
},
labels: ['Rose A', 'Rose B', 'Rose C', 'Rose D', 'Rose E'],
fill: {
  opacity: 1
},
stroke: {
  width: 1,
  colors: undefined
},
yaxis: {
  show: false
},
legend: {
  position: 'bottom'
},
plotOptions: {
  polarArea: {
    rings: {
      strokeWidth: 0
    }
  }
},
theme: {
  monochrome: {
    enabled: true,
    shadeTo: 'light',
    shadeIntensity: 0.6
  }
}
};

var chart = new ApexCharts(document.querySelector("#polar_Area_2"), options);
chart.render();

//
// Pie Charts
//

  
  var options = {
    chart: {
        height: 320,
        type: 'pie',
    }, 
    stroke: {
      show: true,
      width: 2,
      colors: ['transparent']
    },
    series: [50, 50, 50],
    labels: ["Series 1", "Series 2", "Series 3"],
    colors: ["#d9e6fd", "#4a8af6","#fbc659"],
    legend: {
        show: true,
        position: 'bottom',
        horizontalAlign: 'center',
        verticalAlign: 'middle',
        floating: false,
        fontSize: '14px',
        offsetX: 0,
        offsetY: 6
    },
    responsive: [{
        breakpoint: 600,
        options: {
            chart: {
                height: 240
            },
            legend: {
                show: false
            },
        }
    }]
  }
  
  var chart = new ApexCharts(
    document.querySelector("#apex_pie1"),
    options
  );
  
  chart.render();
  
    //apex-pie2
  
  var options = {
    chart: {
        height: 320,
        type: 'donut',
    }, 
    stroke: {
      show: true,
      width: 2,
      colors: ['transparent']
    },
    series: [50, 50, 50,],
    legend: {
        show: true,
        position: 'bottom',
        horizontalAlign: 'center',
        verticalAlign: 'middle',
        floating: false,
        fontSize: '14px',
        offsetX: 0,
        offsetY: 6
    },
    labels: ["Series 1", "Series 2", "Series 3"],
    colors: ["#d9e6fd", "#4a8af6","#fbc659"],
    responsive: [{
        breakpoint: 600,
        options: {
            chart: {
                height: 240
            },
            legend: {
                show: false
            },
        }
    }],
    fill: {
        type: 'gradient'
    }
  }
  
  var chart = new ApexCharts(
    document.querySelector("#apex_pie2"),
    options
  );
  
  chart.render();
  
    //apex-pie3
  
    var options = {
      chart: {
          height: 320,
          type: 'donut',
      },
      stroke: {
          show: true,
          width: 2,
          colors: ['transparent']
      },
      series: [50, 50, 50],
      colors: ["#a3cae0", "#232f5b","#f06a6c"],
      labels: ["Comedy", "Action", "SciFi"],
      dataLabels: {
          dropShadow: {
              blur: 3,
              opacity: 0.8
          }
      },
      fill: {
      type: 'pattern',
        opacity: 1,
        pattern: {
          enabled: true,
          style: ['verticalLines', 'squares', 'horizontalLines', 'circles','slantedLines'], 
        },
      },
      states: {
        hover: {
          enabled: false
        }
      },
      legend: {
          show: true,
          position: 'bottom',
          horizontalAlign: 'center',
          verticalAlign: 'middle',
          floating: false,
          fontSize: '14px',
          offsetX: 0,
          offsetY: 6
      },
      responsive: [{
          breakpoint: 600,
          options: {
              chart: {
                  height: 240
              },
              legend: {
                  show: false
              },
          }
      }]
  }
  
  var chart = new ApexCharts(
      document.querySelector("#apex_pie3"),
      options
  );
  
  chart.render();
  
   
  
  // Apex Radialbar Charts
  
  // Apex-radialbar1
  
  
  var options = {
    chart: {
        height: 320,
        type: 'radialBar',
    },
    plotOptions: {
        radialBar: {
            hollow: {
                size: '70%',
            },
            track: {
              background: '#b9c1d4',
              opacity: 0.5,
            },
            dataLabels: {
              name: {
                  fontSize: '18px',
              },
              value: {
                  fontSize: '16px',
                  color: '#8997bd',
              },          
            }
        },
    },
    colors: ["#4a8af6"],
    series: [70],
    labels: ['CRICKET'],
  
  }
  
  var chart = new ApexCharts(
    document.querySelector("#apex_radialbar1"),
    options
  );
  
  chart.render();
  
  
  
  //Apex-radialbar2
  
  var options = {
    chart: {
        height: 350,
        type: 'radialBar',
    },
    plotOptions: {
        radialBar: {
          track: {
              background: '#b9c1d4',
              opacity: 0.5,            
            },
            dataLabels: {
                name: {
                    fontSize: '22px',
                },
                value: {
                    fontSize: '16px',
                    color: '#8997bd',
                },
                total: {
                    show: true,
                    label: 'Total',
                    color: '#8997bd',
                    formatter: function (w) {
                        // By default this function returns the average of all series. The below is just an example to show the use of custom formatter function
                        return 249
                    }
                }
            }
        }
    },
    series: [44, 55, 67, 83],
    labels: ['Apples', 'Oranges', 'Bananas', 'Berries'],
    
  }
  
  var chart = new ApexCharts(
    document.querySelector("#apex_radialbar2"),
    options
  );
  
  chart.render();
  
  
  
  //Apex-radialbar3
  
  var options = {
    chart: {
        height: 380,
        type: 'radialBar',
    },
    plotOptions: {
        radialBar: {
            startAngle: -135,
            endAngle: 135,
            track: {
              background: '#b9c1d4',
              opacity: 0.3,            
            },
            dataLabels: {
                name: {
                    fontSize: '16px',
                    color: '#8997bd',
                    offsetY: 120
                },
                value: {
                    offsetY: 76,
                    fontSize: '22px',
                    color: '#8997bd',
                    formatter: function (val) {
                        return val + "%";
                    }
                }
            }
        }
    },
    fill: {
        gradient: {
            enabled: true,
            shade: 'dark',
            shadeIntensity: 0.15,
            inverseColors: false,
            opacityFrom: 1,
            opacityTo: 1,
            stops: [0, 50, 65, 91]
        },
    },
    stroke: {
        dashArray: 4
    },
    colors: ["#4a8af6"],
    series: [67],
    labels: ['Median Ratio'],
    responsive: [{
        breakpoint: 380,
        options: {
          chart: {
            height: 280
          }
        }
    }]
  }
  
  var chart = new ApexCharts(
    document.querySelector("#apex_radialbar3"),
    options
  );
  
  chart.render();

//
// Sparkline
//


Apex.grid = {
  padding: {
      right: 0,
      left: 0
  }
}

Apex.dataLabels = {
  enabled: false
}

var randomizeArray = function (arg) {
  var array = arg.slice();
  var currentIndex = array.length, temporaryValue, randomIndex;

  while (0 !== currentIndex) {

      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex -= 1;

      temporaryValue = array[currentIndex];
      array[currentIndex] = array[randomIndex];
      array[randomIndex] = temporaryValue;
  }

  return array;
}

// data for the sparklines that appear below header area
var sparklineData = [47, 45, 54, 38, 56, 24, 65, 31, 37, 39, 62, 51, 35, 41, 35, 27, 93, 53, 61, 27, 54, 43, 19, 46];

// the default colorPalette for this dashboard
//var colorPalette = ['#01BFD6', '#5564BE', '#F7A600', '#EDCD24', '#F74F58'];
var colorPalette = ['#00D8B6', '#008FFB', '#FEB019', '#FF4560', '#775DD0']

var spark1 = {
  chart: {
      type: 'area',
      height: 160,
      sparkline: {
          enabled: true
      },
  },
  stroke: {
      width: 2,
      curve: 'straight'
  },
  fill: {
      opacity: 0.2,
  },
  series: [{
      name: 'Metrica Sales ',
      data: randomizeArray(sparklineData)
  }],
  yaxis: {
      min: 0
  },
  colors: ['#f93b7a'],
  title: {
      text: '$424,652',
      offsetX: 20,
      style: {
          fontSize: '24px',
          color: '#8997bd',
          fontWeight: '500',
      }
  },
  subtitle: {
      text: 'Sales',
      offsetX: 20,
      style: {
          fontSize: '14px',
          color: '#8997bd',
      }
  }
}
new ApexCharts(document.querySelector("#spark1"), spark1).render();

var spark2 = {
  chart: {
      type: 'area',
      height: 160,
      sparkline: {
          enabled: true
      },
  },
  stroke: {
      width: 2,
      curve: 'stepline'
  },
  fill: {
      opacity: 0.2,
  },
  series: [{
      name: 'Metrica Expenses ',
      data: randomizeArray(sparklineData)
  }],
  yaxis: {
      min: 0
  },
  colors: ['#fbb624'],
  title: {
      text: '$235,312',
      offsetX: 20,
      style: {
          fontSize: '24px',
          color: '#8997bd',
          fontWeight: '500',
      }
  },
  subtitle: {
      text: 'Expenses',
      offsetX: 20,
      style: {
          fontSize: '14px',
          color: '#8997bd',
      }
  }
}

new ApexCharts(document.querySelector("#spark2"), spark2).render();

var spark3 = {
  chart: {
      type: 'area',
      height: 160,
      sparkline: {
          enabled: true
      },
  },
  stroke: {
      width: 2,
      curve: 'smooth'
  },
  fill: {
      opacity: 0.2,
  },
  series: [{
      name: 'Net Profits ',
      data: randomizeArray(sparklineData)
  }],
  xaxis: {
      crosshairs: {
          width: 1
      },
  },
  yaxis: {
      min: 0
  },
  colors: ['#0acf97'],
  title: {
      text: '$135,965',
      offsetX: 20,
      style: {
          fontSize: '24px',
          color: '#8997bd',
          fontWeight: '500',
      }
  },
  subtitle: {
      text: 'Profits',
      offsetX: 20,
      style: {
          fontSize: '14px',
          color: '#8997bd',
      }
  }
}

new ApexCharts(document.querySelector("#spark3"), spark3).render();
  