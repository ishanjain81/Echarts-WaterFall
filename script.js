
// API URL
const url = 'https://run.mocky.io/v3/e2ffac92-48e0-4826-a59f-bf76fc727383';

// Accessing HTML Elements
var myChart = echarts.init(document.getElementById('Aplha-Charts'));
var profitValue = document.getElementById("profit-value");
var lossValue = document.getElementById("loss-value");
var netValue = document.getElementById("net-value");

// Window Length variable
var w = window.innerWidth;

// Declaring variables to handle responsive design
var legendDirec = 10;
var legendOrient = 'horizontal';
var labelFontSize = 10;
var legendShow = true;

// medium sized screen
if(w <= 768){
    legendDirec = 10;
    legendOrient = 'vertical';
    labelFontSize = 8;
}

// small size screen
if(w <= 400){
    labelFontSize = 0;
    legendShow = false;
}

// function to process the data recieved from API
function processData(data){
    var diff = [];
    data.forEach(element => {
        diff.push({
            category: element.subcategory,
            diff: Number((element.d__2022sale - element.d__2021sale).toFixed(2))
        })
    });
    return diff;
}

// Plotting function
function plotCurve(data){

    var total = 0;
    var profit = 0;
    var loss = 0;
    var net = 0;

    for(var i = 0;i < data.length; i++){
        total += data[i].diff;
    }
    
    // sorting on basis of difference
    data.sort(function(a, b){return a.diff - b.diff});

    // Positive label options { shown label on TOP}
    var labelOptionsPositive = {
        position: 'top',
        show: true,
        fontSize: labelFontSize,
        padding: 0.7,
        textBorderColor: '#000',
        color: '#000'
    }

    // Negative label options { shown label on BOTTOM}
    var labelOptionsNegative = {
        position: 'bottom',
        show: true,
        fontSize: labelFontSize,
        padding: 0.7,
        textBorderColor: '#000',
        color: '#000'
    }

    var color1,color2,labelOptions1,labelOptions2;

    // if sum is +ve reverse the array and define the colors of bars
    if(total >= 0){
        data.reverse();
        color1 = '#7FFFD4';
        color2 = '#DC143C';
        labelOptions1 = labelOptionsPositive;
        labelOptions2 = labelOptionsNegative;
    }
    else{
        color1 = '#DC143C';
        color2 = '#7FFFD4';
        labelOptions1 = labelOptionsNegative;
        labelOptions2 = labelOptionsPositive;
    }

    // Arrays for collecting data of plots
    var help = [];
    var positive = [];
    var negative = [];
    var netTotal = [];

    for (var i = 0, sum = 0; i < data.length; ++i) {

        // Handling +ve and -ve sum condition
        var val = total >= 0 ? data[i].diff : -data[i].diff;

        if (val >= 0) {
          positive.push(val);
          negative.push('-');
          profit += data[i].diff;
        } else {
          positive.push('-');
          negative.push(-val);
          loss += data[i].diff;
        }
      
        if (i === 0) {
          help.push(0);
        } else {
          sum += (total >= 0 ? data[i - 1].diff : -data[i-1].diff);
          sum = Number(sum.toFixed(2));
          if (val < 0) {
            help.push(Number((sum + val).toFixed(2)));
          } else {
            help.push(sum);
          }
        }
        netTotal.push("-");
    }

    // Net Profit or Loss
    net = profit + loss;

    positive.push('-');
    negative.push('-');
    netTotal.push(Math.abs(net));

    help.push(0);
      
    // Plots options used in echart library
    option = {
        title: {
            text: 'Accumulated Waterfall Chart'
        },
        legend: {
            orient: legendOrient,
            top: 0,
            right: legendDirec,
            show: legendShow,
        },
        grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: true
        },
        xAxis: {
            type: 'category',
            splitLine: { show: true },
            data: (function() {
            var list = [];
            for (var i = 0; i < data.length; i++) {
                list.push(data[i].category);
            }
            list.push("");
            return list;
            })()
        },
        yAxis: {
            type: 'value'
        },
        series: [
            {
            type: 'bar',
            stack: 'all',
            itemStyle: {
                normal: {
                barBorderColor: 'rgba(0,0,0,0)',
                color: 'rgba(0,0,0,0)'
                },
                emphasis: {
                barBorderColor: 'rgba(0,0,0,0)',
                color: 'rgba(0,0,0,0)'
                }
            },
            data: help,
            },
            {
            name: 'Profit',
            type: 'bar',
            stack: 'all',
            data: positive,
            itemStyle: {
                color: color1
            },
            label: labelOptions1
            },
            {
            name: 'Loss',
            type: 'bar',
            stack: 'all',
            data: negative,
            itemStyle: {
                color: color2
            },
            label: labelOptions2
            },
            {
            name: 'Net',
            type: 'bar',
            stack: 'all',
            data: netTotal,
            itemStyle: {
                color: '#87CEFA'
            },
            label: {
                normal: {
                    position: 'top',
                    show: true,
                    formatter: [Math.abs(net)].join('\n'),
                    fontSize: labelFontSize,
                    color: 'black'
                }
            }
            }
        ]
    };
      
    // Adding Profits and Loss to the DOM
    profitValue.innerText = Math.abs(profit);
    lossValue.innerText = Math.abs(loss);
    netValue.innerText = net;

    // Plot Curve
    myChart.setOption(option);
}

// Function to CALL the API and process the data
async function APICall(url){
    const response = await fetch(url);
    var APIdata = await response.json();
    var data = processData(APIdata.data);
    plotCurve(data);
}

// Resposive design
window.onresize = function() {
    myChart.resize();
};

APICall(url);