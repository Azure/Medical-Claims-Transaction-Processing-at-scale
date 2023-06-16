/**
 * Theme: T-Wind - Tailwind Admin Dashboard Template
 * Author: Mannatthemes
 * NFTs Dashboard Js
 */




 document.addEventListener('readystatechange', (function(event)  {
    if (event.target.readyState === "complete") {
        var clockbox = document.getElementsByClassName("clockbox");
        var countDownDate = new Array();
        for (var i = 0; i < clockbox.length; i++) {
        countDownDate[i] = new Array();
        countDownDate[i]['el'] = clockbox[i];
        countDownDate[i]['time'] = new Date(clockbox[i].getAttribute('data-date')).getTime();
        countDownDate[i]['days'] = 0;
        countDownDate[i]['hours'] = 0;
        countDownDate[i]['seconds'] = 0;
        countDownDate[i]['minutes'] = 0;
        }

        var countdownfunction = setInterval(function () {
        for (var i = 0; i < countDownDate.length; i++) {
            var now = new Date().getTime();
            var distance = countDownDate[i]['time'] - now;
            countDownDate[i]['days'] = Math.floor(distance / (1000 * 60 * 60 * 24));
            countDownDate[i]['hours'] = Math.floor(distance % (1000 * 60 * 60 * 24) / (1000 * 60 * 60));
            countDownDate[i]['minutes'] = Math.floor(distance % (1000 * 60 * 60) / (1000 * 60));
            countDownDate[i]['seconds'] = Math.floor(distance % (1000 * 60) / 1000);

            if (distance < 0) {
            countDownDate[i]['el'].querySelector('.days').innerHTML = 0;
            countDownDate[i]['el'].querySelector('.hours').innerHTML = 0;
            countDownDate[i]['el'].querySelector('.minutes').innerHTML = 0;
            countDownDate[i]['el'].querySelector('.seconds').innerHTML = 0;
            } else {
            countDownDate[i]['el'].querySelector('.days').innerHTML = countDownDate[i]['days'];
            countDownDate[i]['el'].querySelector('.hours').innerHTML = countDownDate[i]['hours'];
            countDownDate[i]['el'].querySelector('.minutes').innerHTML = countDownDate[i]['minutes'];
            countDownDate[i]['el'].querySelector('.seconds').innerHTML = countDownDate[i]['seconds'];
            }

        }
        }, 1000);
    }
    }));




    
      
    var options = {
        series: [
            { name: "Profit", data: [12.45, 16.2, 8.9, 11.42, 12.6, 18.1, 18.2, 14.16, 11.1, 8.09, 16.34, 12.88] },
            { name: "Loss", data: [-11.45, -15.42, -7.9, -12.42, -12.6, -18.1, -18.2, -14.16, -11.1, -7.09, -15.34, -11.88] },
        ],
            chart: {
            type: 'bar',
            height: 340,
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
            horizontal: false,
            columnWidth: '55%',
            endingShape: 'rounded'
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
        grid: {
            strokeDashArray: 3,
            xaxis: {
              lines: {
                show: false,
              },
            },
            yaxis: {
              lines: {
                show: true,
              },
            },
          },
        xaxis: {
            categories: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
            labels: { rotate: -90 },
        },
       
        fill: {
            opacity: 1
        },
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
        tooltip: {
            y: {
                formatter: function (val) {
                    return "$ " + val + " k"
                }
            }
        }
      };

      var chart = new ApexCharts(document.querySelector("#NFTs"), options);
      chart.render();