/**
 * Theme: T-Wind - Tailwind Admin Dashboard Template
 * Author: Mannatthemes
 * File: Chartjs Js
 */


 var ctx1 = document.getElementById('lineChart').getContext('2d');
 var myChart = new Chart(ctx1, {
     type: 'line',
     data: {
        labels: ['Jan','Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
         datasets: [{
             label: 'Monthly Report',
             data: [12, 19, 13, 9, 12, 11, 12, 19, 13, 9, 12, 11],
             backgroundColor: [
                'rgba(11, 81, 183, 0.1)',
             ],
             borderColor: [
                 'rgba(11, 81, 183, 1)',
             ],
             borderWidth: 2,
             borderDash	:[3],
             borderJoinStyle: "round",
             borderCapStyle: "round",
             pointBorderColor: 'rgba(11, 81, 183, 1)',
             pointRadius: 3,
             pointBorderWidth: 1,
             tension: 0.3,
         },
         {
            label: 'Monthly Report',
            data: [8, 12, 15, 11, 8, 14, 16, 13, 10, 7, 19, 16],
            backgroundColor: [
               'rgba(28, 202, 184, 0.1)',
            ],
            borderColor: [
                'rgba(28, 202, 184, 1)',
            ],
            borderWidth: 2,
            borderDash	:[0],
            borderJoinStyle: "round",
            borderCapStyle: "round",
            pointBorderColor: 'rgba(28, 202, 184, 1)',
            pointRadius: 3,
            pointBorderWidth: 1,
            tension: 0.3,
        }]
     },
     options: {
        maintainAspectRatio: false,
        plugins: {
            legend: {
                labels: {                   
                    color: '#7c8ea7',
                }
            }
        }  ,
        scales: {            
            y: {
                beginAtZero: true,
                ticks: {
                    // Include a dollar sign in the ticks
                    callback: function(value, index, values) {
                        return '$' + value;
                    },
                    color: '#7c8ea7',
                },               
                grid: {
                    drawBorder: 'border',
                    color: 'rgba(132, 145, 183, 0.15)',
                    borderDash: [3],
                    borderColor: 'rgba(132, 145, 183, 0.15)',
                } ,
                beginAtZero: true,
            },
            x: {   
              ticks: {
                color: '#7c8ea7',
              },            
                grid: {
                    display: false,
                    color: 'rgba(132, 145, 183, 0.09)',
                    borderDash: [3],
                    borderColor: 'rgba(132, 145, 183, 0.09)',
                }    
            }            
         },
         
     }
 });

 var ctx2 = document.getElementById('bar').getContext('2d');
 var myChart = new Chart(ctx2, {
     type: 'bar',
     data: {
         labels: ['Jan','Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
         datasets: [{
             label: 'Monthly Report',
             data: [12, 19, 13, 9, 12, 11, 12, 19, 13, 9, 12, 11],
             borderRadius: 100,
             borderSkipped: false,
             backgroundColor: '#367de4',
             borderColor: '#367de4',
             borderWidth: 1,
             indexAxis: 'x',
             barThickness: 15,
             grouped: true,
             maxBarThickness: 9,  
             barPercentage: 50
         },
         {
            label: 'Monthly Report',
            data: [8, 12, 15, 11, 8, 14, 16, 13, 10, 7, 19, 16],
            borderRadius: 100,
            borderSkipped: false,
            backgroundColor: '#1ccab8',
            borderColor: '#1ccab8',
            borderWidth: 1,
            indexAxis: 'x',
            barThickness: 15,
            grouped: true,
            maxBarThickness: 9,            
        }]
     },
    
     options: {
        maintainAspectRatio: false,
        responsive: true,
        plugins: {
          legend: {
            position: 'top',
            labels: {                   
                color: '#7c8ea7',
            }
          },
          title: {
            display: false,
            text: 'Chart.js Bar Chart'
          }
        },
        scales: {            
            y: {
                beginAtZero: true,
                ticks: {
                    // Include a dollar sign in the ticks
                    callback: function(value, index, values) {
                        return '$' + value;
                    },
                    color: '#7c8ea7',
                },               
                grid: {
                    drawBorder: 'border',
                    color: 'rgba(132, 145, 183, 0.15)',
                    borderDash: [3],
                    borderColor: 'rgba(132, 145, 183, 0.15)',
                } ,
                beginAtZero: true,
            },
            x: {   
              ticks: {
                color: '#7c8ea7',
              },            
                grid: {
                    display: false,
                    color: 'rgba(132, 145, 183, 0.09)',
                    borderDash: [3],
                    borderColor: 'rgba(132, 145, 183, 0.09)',
                }    
            }            
         },
    },
 });


 
 var ctx3 = document.getElementById('doughnut').getContext('2d');
 var myChart = new Chart(ctx3, {
     type: 'doughnut',
     data: {
        labels: [            
            "Desktops",
            "Laptop",
            "Tablets",        
            "Mobiles",],
         datasets: [{
             data: [80, 50, 100, 121],
             backgroundColor: [
                "#4d79f6",
                "#ff5da0",
                "#e0e7fd",
                "#4ac7ec",
            ],
            cutout: 100,
            radius: 100,
            borderColor: "transparent",
            borderRadius: 0,
            hoverBackgroundColor: [
                "#4d79f6",
                "#ff5da0",
                "#e0e7fd",
                "#4ac7ec",
            ],             
         },]
     },
     options: {
        maintainAspectRatio: false,
        plugins: {
            legend: {
                labels: {                   
                    color: '#7c8ea7',
                }
            }
        }         
     }
 });

 
 var ctx4 = document.getElementById('polarArea').getContext('2d');
 var myChart = new Chart(ctx4, {
     type: 'polarArea',
     data: {
        labels: [            
        "Desktops",
        "Laptop",
        "Tablets",        
        "Mobiles",],
         datasets: [{
             data: [80, 50, 100, 121],
             backgroundColor: [
                "#4d79f6",
                "#ff5da0",
                "#e0e7fd",
                "#4ac7ec",
            ],
            borderColor: "transparent",
            hoverBackgroundColor: [
                "#4d79f6",
                "#ff5da0",
                "#e0e7fd",
                "#4ac7ec",
            ],             
         },]
     },
     options: {
        maintainAspectRatio: false,  
        plugins: {
            legend: {
                labels: {                   
                    color: '#7c8ea7',
                }
            }
        }       
     }
 });


 var ctx5 = document.getElementById('pie').getContext('2d');
 var myChart = new Chart(ctx5, {
     type: 'pie',
     data: {
        labels: [            
            "Desktops",
            "Laptop",
            "Tablets",        
            "Mobiles",],
         datasets: [{
             data: [80, 50, 100, 121],
             backgroundColor: [
                "#4d79f6",
                "#ff5da0",
                "#e0e7fd",
                "#4ac7ec",
            ],
            cutout: 0,
            radius: 100,
            borderColor: "transparent",
            borderRadius: 0,
            hoverBackgroundColor: [
                "#4d79f6",
                "#ff5da0",
                "#e0e7fd",
                "#4ac7ec",
            ],             
         },]
     },
     options: {
        maintainAspectRatio: false,         
        plugins: {
            legend: {
                labels: {                   
                    color: '#7c8ea7',
                }
            }
        }
     }
 });

 var ctx6 = document.getElementById('radar').getContext('2d');
 var myChart = new Chart(ctx6, {
     type: 'radar',
     data: {
        labels: ['Jan','Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
         datasets: [{
             label: 'Monthly Report',
             data: [12, 19, 13, 9, 12, 11, 12, 19, 13, 9, 12, 11],
             backgroundColor: [
                'rgba(11, 81, 183, 0.1)',
             ],
             borderColor: [
                 'rgba(11, 81, 183, 1)',
             ],
             borderWidth: 2,
             borderDash	:[3],
             borderJoinStyle: "round",
             borderCapStyle: "round",
             pointBorderColor: 'rgba(11, 81, 183, 1)',
             pointRadius: 3,
             pointBorderWidth: 1,
             tension: 0.3,
             fill: true,
             hitRadius: 5,
         },
         {
            label: 'Monthly Report',
            data: [8, 12, 15, 11, 8, 14, 16, 13, 10, 7, 19, 16],
            backgroundColor: [
               'rgba(28, 202, 184, 0.1)',
            ],
            borderColor: [
                'rgba(28, 202, 184, 1)',
            ],
            borderWidth: 2,
            borderDash	:[0],
            borderJoinStyle: "round",
            borderCapStyle: "round",
            pointBorderColor: 'rgba(28, 202, 184, 1)',
            pointRadius: 3,
            pointBorderWidth: 1,
            tension: 0.3,
        }]
     },
     options: {
        maintainAspectRatio: false, 
        scales: { 
            r: {
                angleLines: {
                    display: true,
                    color: 'rgba(132, 145, 183, 0.15)',
                    borderDash: [2]
                },
            } ,     
         }, 
        plugins: {
            legend: {
                labels: {                   
                    color: '#7c8ea7',
                }
            }
        }
     }
 });