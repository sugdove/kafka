var details = $.cookie("details");
if(details){
    details = JSON.parse(details);
}
var topic = details.topic;
var zookeeper = details.zookeeper;
var groupname = details.groupname;
var websocket = null;
var cost;//已消费
var all; //总条数
var remind;//剩余条数
//判断当前浏览器是否支持websocket
zookeeper = zookeeper.replace("/","|");
if ('WebSocket' in window) {
    websocket = new WebSocket("ws://" + localhost + "/longGangKafka/WebSocketLog/"+zookeeper+"/"+groupname+"/"+topic)
}
else {
    alert('当前浏览器不支持WebSocket');
}
//调用websocket反回的信息，将日志信息展现在页面上
websocket.onmessage = function (event) {
    var data = JSON.parse(event.data);
    cost = data[0].value;
    all = data[1].value;
    remind = all-cost;
    console.log(data);
    console.log(data[0].value);
    console.log(data[1].value);
};
//监听窗口关闭事件，当窗口关闭时，主动去关闭websocket连接，防止连接还没断开就关闭窗口，server端会抛异常
window.onbeforeunload = function () {
    closeWebSocket();
};

//关闭WebSocket连接
function closeWebSocket() {
    websocket.close();
}
Highcharts.setOptions({
    global: {
        useUTC: false
    }
});

function activeLastPointToolip(chart) {
    var points = chart.series[0].points;
    chart.tooltip.refresh(points[points.length - 1]);
}

$('#all_details').highcharts({
    chart: {
        type: 'spline',
        animation: Highcharts.svg, // don't animate in old IE
        marginRight: 10,
        events: {
            load: function () {
                // set up the updating of the chart each second
                var series = this.series[0],
                    chart = this;
                setInterval(function () {
                    var x = (new Date()).getTime(); // current time
                    var y = all * 1;
                    //console.log("CPU:" + CPU + "%");
                    series.addPoint([x, y], true, true);
                }, 2000);
            }
        }
    },
    credits: {enabled: false},//不显示LOGO
    title: {
        text: ''
    },
    xAxis: {
        type: 'datetime',
        tickPixelInterval: 150
    },
    yAxis: {
        title: {
            text: ''
        },
        //Y轴单位
        labels: {
            formatter: function () {
                return this.value + '条';
            }
        },
        plotLines: [{
            value: 0,
            width: 1,
            color: '#808080'
        }]
    },

    tooltip: {
        formatter: function () {
            return '<b>' + this.series.name + '</b><br/>' +
                Highcharts.dateFormat('%Y-%m-%d %H:%M:%S', this.x) + '<br/>' +
                Highcharts.numberFormat(this.y, 2) + "条";
        }
    },
    legend: {
        enabled: false
    },
    exporting: {
        enabled: false
    },
    series: [{
        name: '总条数',
        data: (function () {
            // generate an array of random data
            var data = [],
                time = (new Date()).getTime(),
                i;
            for (i = -19; i <= 0; i += 1) {
                data.push({
                    x: null,
                    y: null
                });
            }
            return data;
        }())
    }]
});
$('#cost_details').highcharts({
    chart: {
        type: 'spline',
        animation: Highcharts.svg, // don't animate in old IE
        marginRight: 10,
        events: {
            load: function () {
                // set up the updating of the chart each second
                var series = this.series[0],
                    chart = this;
                setInterval(function () {
                    var x = (new Date()).getTime(); // current time
                    var y = cost * 1;
                    //console.log("CPU:" + CPU + "%");
                    series.addPoint([x, y], true, true);
                }, 2000);
            }
        }
    },
    credits: {enabled: false},//不显示LOGO
    title: {
        text: ''
    },
    xAxis: {
        type: 'datetime',
        tickPixelInterval: 150
    },
    yAxis: {
        title: {
            text: ''
        },
        //Y轴单位
        labels: {
            formatter: function () {
                return this.value + '条';
            }
        },
        plotLines: [{
            value: 0,
            width: 1,
            color: '#808080'
        }]
    },

    tooltip: {
        formatter: function () {
            return '<b>' + this.series.name + '</b><br/>' +
                Highcharts.dateFormat('%Y-%m-%d %H:%M:%S', this.x) + '<br/>' +
                Highcharts.numberFormat(this.y, 2) + "条";
        }
    },
    legend: {
        enabled: false
    },
    exporting: {
        enabled: false
    },
    series: [{
        name: '已消费',
        data: (function () {
            // generate an array of random data
            var data = [],
                time = (new Date()).getTime(),
                i;
            for (i = -19; i <= 0; i += 1) {
                data.push({
                    x: null,
                    y: null
                });
            }
            return data;
        }())
    }]
});
$('#remind_details').highcharts({
    chart: {
        type: 'spline',
        animation: Highcharts.svg, // don't animate in old IE
        marginRight: 10,
        events: {
            load: function () {
                // set up the updating of the chart each second
                var series = this.series[0],
                    chart = this;
                setInterval(function () {
                    var x = (new Date()).getTime(); // current time
                    var y = remind * 1;
                    //console.log("CPU:" + CPU + "%");
                    series.addPoint([x, y], true, true);
                }, 2000);
            }
        }
    },
    credits: {enabled: false},//不显示LOGO
    title: {
        text: ''
    },
    xAxis: {
        type: 'datetime',
        tickPixelInterval: 150
    },
    yAxis: {
        title: {
            text: ''
        },
        //Y轴单位
        labels: {
            formatter: function () {
                return this.value + '条';
            }
        },
        plotLines: [{
            value: 0,
            width: 1,
            color: '#808080'
        }]
    },

    tooltip: {
        formatter: function () {
            return '<b>' + this.series.name + '</b><br/>' +
                Highcharts.dateFormat('%Y-%m-%d %H:%M:%S', this.x) + '<br/>' +
                Highcharts.numberFormat(this.y, 2) + "条";
        }
    },
    legend: {
        enabled: false
    },
    exporting: {
        enabled: false
    },
    series: [{
        name: '剩余条数',
        data: (function () {
            // generate an array of random data
            var data = [],
                time = (new Date()).getTime(),
                i;
            for (i = -19; i <= 0; i += 1) {
                data.push({
                    x: null,
                    y: null
                });
            }
            return data;
        }())
    }]
});