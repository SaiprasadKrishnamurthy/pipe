function drawTitle(id,title){
    document.getElementById(id).previousElementSibling.children[0].innerHTML=title;
}

//var paletteColors = "#95CEFF, #90ed7d, #f7a35c, #8085e9, #f15c80, #808000, #00FF00, #FFD700, #00FFFF,#7FFFD4, #483D8B, #800080, #DDA0DD, #FF00FF, #FF1493, #FFFACD, #BC8F8F, #F0FFF0, #C0C0C0,#546e91, #8bde95, #d2ab58, #273c71, #98bf6e, #4daa4b, #98abc5, #cc1010, #31383b, #006391,#c2643f, #b0a474, #a5a39c, #a9c2bc, #22af8c, #7fcecf, #987ac6, #3d3b87, #b77b1c, #c9c2b6,#807ece, #8db27c, #be66a2, #9ed3c6, #00644b, #005064, #77979f, #77e079, #9c73ab, #1f79a7";

//var paletteColors = "#E83D2D,#EC7B35,#F2AE3F,#FAE64C,#bbcd18,#78CC44,#51A13F,#65C27B,#6AD0AE,#95DADB,#78B6D0,#A7D9FB,#3E84D0,#899FE5,#8B7DE8,#925FCA,#B96ECB,#CC4784";

//var paletteColors = "#053D56,#FCB414,#E07A28,#42AFB6,#CB1B4A,#053D56,#FCB414,#007A7D,#C2C923";
var paletteColors = "#2D9EB6,#97C34D,#f8bd19,#F67C33,#3390CE,#48BF7D,#F4D033,#e44a00,#6baa01";

//Draw 3D Pie Chart using Fusioncharts lib
function draw3DPie(id,data){
    //Set chart title
    var title = data.title!=null ?data.title :"My Pie Chart Title";
    drawTitle(id,title);
    
    //set onclick dashletMax function to the div
    if(id.indexOf("dashletMax") == -1)
        setOnclickMaxFun(id,data,"draw3DPie");

    //Creating data object
    var chartsData = [];
    var keys = getKeysFromJsonPayLoad(data.values);
    keys.forEach(function(key){
        var obj = {"label": key, "value": data.values[key]};
        chartsData.push(obj);
    });
    
    var linechart = new FusionCharts({
        type: 'pie3d',
        renderAt: id,
        width: '95%',
        height: '85%',
        dataFormat: 'json',
        dataSource: {
            "chart": {
                "baseFont": "sans-serif",
                "chartTopMargin": "3",
                "use3DLighting": "1",
                "animation": "1",
                "animateClockwise": "1",
                "alphaAnimation": "0",
                "paletteColors": paletteColors,
                "showZeroPies": "0",
                "showPercentValues": "1",
                "showPercentInTooltip": "0",
                "showLabels": "1",
                "showValues": "1",
                "labelSepChar": ", ",
                "useDataPlotColorForLabels": "1",
                "bgColor": "#ffffff",
                "showBorder": "0",
                "pieRadius": "50%",
                "enableSlicing": "1",
                "showShadow": "0",
                "startingAngle": "0",
                "enableMultiSlicing": "1",
                "pieYScale": "40",
                "pieSliceDepth": "25",
                "enableSmartLabels": "1",
                "skipOverlapLabels": "1",
                "isSmartLineSlanted": "1",
                "manageLabelOverflow": "1",
                "decimals": "2",
                //Tooltip attributes
                "toolTipColor": "#ffffff",
                "toolTipBorderThickness": "0",
                "toolTipBgColor": "#000000",
                "toolTipBgAlpha": "80",
                "toolTipBorderRadius": "2",
                "toolTipPadding": "5",
                "showToolTipShadow": "1",
                "showHoverEffect":"1",
                //Leegend attributes
                "showLegend": "1",
                "legendBgColor": "#ffffff",
                "legendBorderAlpha": '0',
                "legendShadow": '1',
                "legendItemFontSize": '10',
                "legendItemFontColor": '#666666',
                "legendItemHoverFontColor": "#000000",
                "legendAllowDrag": "0",
                "minimiseWrappingInLegend": "0",
                "exportEnabled": "1",
                "exportShowMenuItem": "1",
                "exportTargetWindow": "_blank",
                "exportFileName": title+"_"+id
            },
            "data": chartsData
        },
        //events:{
        //        'renderComplete': function(eventObj, args) {
        //            alert(eventObj.eventType + " was raised by the chart whose ID is " + eventObj.sender.id);
        //        }
        //    }
    });

    //pie3Dchart.addEventListener("renderComplete", function(eventObj, eventArgs) {
   //     alert(eventObj.eventType + " was raised by the chart whose ID is " + eventObj.sender.id);
   // });
    linechart.render();
}


//Draw Pyramid Chart
function drawPyramid(id,data){
    //Set chart title
    var title = data.title!=null ?data.title :"My Pie Chart Title";
    drawTitle(id,title);
    
    //set onclick dashletMax function to the div
    if(id.indexOf("dashletMax") == -1)
        setOnclickMaxFun(id,data,"drawPyramid");

    //Creating data object
        var chartsData = [];
        var keys = getKeysFromJsonPayLoad(data.values);
        keys.forEach(function(key){
            var obj = {"label": key, "value": data.values[key]};
            chartsData.push(obj);
        });
    
    var pyramidChart = new FusionCharts({
        type: 'pyramid',
        renderAt: id,
        width: '95%',
        height: '85%',
        dataFormat: 'json',
        dataSource: {
            "chart": {
                "chartLeftMargin": "50",
                "chartRightMargin": "50",
                "baseFont": "sans-serif",
                "showBorder": "0",
                "bgColor": "#ffffff",
                "paletteColors": paletteColors,
                "manageResize": "1",
                "use3dlighting": "1",
                "showValues": "1",
                "showLabels": "1",
                "labelDisplay": "auto",
                "useEllipsesWhenOverflow": "1",
                "maxLabelHeight": "25",
                "labelDistance": 40,
                "enableSmartLabels": "1",
                "useDataPlotColorForLabels": "1",
                "showPercentValues": "0",
                //Tooltip attributes
                "toolTipColor": "#ffffff",
                "toolTipBorderThickness": "0",
                "toolTipBgColor": "#000000",
                "toolTipBgAlpha": "80",
                "toolTipBorderRadius": "2",
                "toolTipPadding": "5",
                "showToolTipShadow": "1",
                "showHoverEffect":"1",
                //Leegend attributes
                "showLegend": "1",
                "legendBgColor": "#ffffff",
                "legendBorderAlpha": '0',
                "legendShadow": '1',
                "legendItemFontSize": '10',
                "legendItemFontColor": '#666666',
                "legendItemHoverFontColor": "#000000",
                "legendAllowDrag": "0",
                "minimiseWrappingInLegend": "0"
            },
            "data": chartsData
        }  
    });
    pyramidChart.render();
}

//Draw 3D-Doughnut chart.
function draw3Ddoughnut(id,data){
    //Set chart title
    var title = data.title!=null ?data.title :"My Pie Chart Title";
        drawTitle(id,title);
    
    //set onclick dashletMax function to the div
    if(id.indexOf("dashletMax") == -1)
        setOnclickMaxFun(id,data,"draw3Ddoughnut");

    //Creating data object
        var chartsData = [];
        var keys = getKeysFromJsonPayLoad(data.values);
        keys.forEach(function(key){
            var obj = {"label": key, "value": data.values[key]};
            chartsData.push(obj);
        });
    
    var doughnutChart = new FusionCharts({
        type: 'doughnut3d',
        renderAt: id,
        width: '95%',
        height: '85%',
        dataFormat: 'json',
        dataSource: {
            "chart": {
                "baseFont": "sans-serif",
                "chartTopMargin": "3",
                "use3DLighting": "1",
                "animation": "1",
                "animateClockwise": "1",
                "alphaAnimation": "0",
                "paletteColors": paletteColors,
                "showZeroPies": "0",
                "showPercentValues": "1",
                "showPercentInTooltip": "0",
                "showLabels": "1",
                "showValues": "1",
                "labelSepChar": ", ",
                "useDataPlotColorForLabels": "1",
                "bgColor": "#ffffff",
                "showBorder": "0",
                "use3DLighting": "0",
                "pieRadius": "60%",
                "enableSlicing": "1",
                "showShadow": "0",
                "startingAngle": "0",
                "enableMultiSlicing": "1",
                "pieYScale": "40",
                "pieSliceDepth": "25",
                "enableSmartLabels": "1",
                "skipOverlapLabels": "1",
                "isSmartLineSlanted": "1",
                "manageLabelOverflow": "1",
                "decimals": "2",
                //Tooltip attributes
                "toolTipColor": "#ffffff",
                "toolTipBorderThickness": "0",
                "toolTipBgColor": "#000000",
                "toolTipBgAlpha": "80",
                "toolTipBorderRadius": "2",
                "toolTipPadding": "5",
                "showToolTipShadow": "1",
                "showHoverEffect":"1",
                //Leegend attributes
                "showLegend": "1",
                "legendBgColor": "#ffffff",
                "legendBorderAlpha": '0',
                "legendShadow": '1',
                "legendItemFontSize": '10',
                "legendItemFontColor": '#666666',
                "legendItemHoverFontColor": "#000000",
                "legendAllowDrag": "0",
                "minimiseWrappingInLegend": "0"
            },
            "data": chartsData
        }
    });
    doughnutChart.render();
}

//Draw Multi Series Line chart using Fusionchart lib
function drawLine(id,data){
    //Setting title
    var title = data.title!=null ?data.title :"My Line Chart Title";
    drawTitle(id,title);
    
    //set onclick dashletMax function to the div
    if(id.indexOf("dashletMax") == -1)
        setOnclickMaxFun(id,data,"drawLine");
    
    //Restructuring the data.
    let xAxisLabel = new Set();
    var xAxisLabelJsonArray = [];
    var dataset = [];
    var tempobj={};
    data.series.forEach(function(series){
        var keys = getKeysFromJsonPayLoad(series.xy);
        keys.forEach(function(key){
           if(!xAxisLabel.has(key))
               xAxisLabel.add(key);
        });
    });
    
    xAxisLabel.forEach(function(val){
        xAxisLabelJsonArray.push({"label": val});
    });
    
    data.series.forEach(function(series){
        xAxisLabel.forEach(function(val){
            tempobj[val]=0;
        });
        var xydata = [];
        var keys = getKeysFromJsonPayLoad(series.xy);
        keys.forEach(function(key){
            tempobj[key]=series.xy[key];
        });
        
        xAxisLabel.forEach(function(val){
            xydata.push({"label": val,"value": tempobj[val]});
        });
        dataset.push({
                "seriesname": series.name,
                "data": xydata
            });
    });

    var lineChart = new FusionCharts({
        type: 'msspline',
        renderAt: id,
        width: '95%',
        height: '85%',
        dataFormat: 'json',
        dataSource: {
            "chart": {
                //Chart attributes
                "paletteColors": paletteColors,
                "bgcolor": "white",
                "showBorder": "0",
                "baseFont": "sans-serif",
                "chartTopMargin": "40",
                "canvasPadding": "20",
                //X-Axis Name
                "xAxisName": data.xaxisLabel,
                "xAxisNameFontColor": "#000000",
                "xAxisNameFontSize": 14,
                "xAxisNameFontBold": "0",
                "xAxisNameAlpha": 60,
                "xAxisNamePadding": "10",
                //Y-Axis Name
                "yAxisName": data.yaxisLabel,
                "yAxisNameFontColor": "#000000",
                "yAxisNameFontSize": 14,
                "yAxisNameFontBold": "0",
                "yAxisNameAlpha": 60,
                "transposeAxis": "1",
                "yAxisNamePadding": "10",
                "showAxisLines": "0",
                "yAxisValuesPadding": "10",
                "setAdaptiveYMin": "1",
                //X-Axix Label attributes
                "labelPadding": "10",
                "showLabels": "1",
                "labelDisplay": "auto",
                "useEllipsesWhenOverflow": "1",
                "maxLabelHeight": "25",
                //Value attributes
                "showValues": "0",
                "showShadow": "1",
                "showZeroPlaneValue": "1",
                "valuePosition": "ABOVE",
                //Line And Anchor attributes
                "lineThickness": 1,
                "anchorRadius": 4,
                "anchorBorderThickness": 1,
                "anchorSides": 1,
                "showHoverEffect":"1",
                "anchorHoverRadius": 7,
                "anchorBgHoverColor": "#000000",
                "anchorBgHoverAlpha": "20",
                "anchorBorderHoverThickness": 2,
                //Tooltip attributes
                "toolTipColor": "#ffffff",
                "toolTipBorderThickness": "0",
                "toolTipBgColor": "#000000",
                "toolTipBgAlpha": "80",
                "toolTipBorderRadius": "2",
                "toolTipPadding": "5",
                "showToolTipShadow": "1",
                //Div lines attribute
                "showZeroPlane": "1",
                "numVDivLines": xAxisLabel.size-2,
                "adjustDiv": "1",
                "divLineColor": "#000000",
                "divLineAlpha": "10",
                "divlineThickness": "1",
                "divLineIsDashed": "0",
                "showCanvasBorder": "0",
                "zeroPlaneColor": "#000000",
                "zeroPlaneThickness": 2,
                "zeroPlaneAlpha": "5",
                //Legend attributes
                "showLegend": "1",
                "legendBgColor": "#ffffff",
                "legendBorderAlpha": '0',
                "legendShadow": '1',
                "legendItemFontSize": '10',
                "legendItemFontColor": '#666666',
                "legendItemHoverFontColor": "#000000",
                "legendAllowDrag": "0",
                "minimiseWrappingInLegend": "0",
                "plotHighlightEffect": "fadeout|color=black, alpha=10"
                //Export Chart
                    //"exportEnabled": "1",
                    //"exportFileName": data.title
            },
            "categories": [
                {
                    "category": xAxisLabelJsonArray
                }
            ],
            "dataset": dataset
        }
    });
    lineChart.render();
}


//Draw Scatter Chart
function drawScatter(id,data){
    //Setting title
    var title = data.title!=null ?data.title :"My Scatter Chart Title";
    drawTitle(id,title);
    
    //set onclick dashletMax function to the div
    if(id.indexOf("dashletMax") == -1)
        setOnclickMaxFun(id,data,"drawScatter");
    
    //Restructuring the data.
    let xAxisLabel = new Set();
    var xAxisLabelJsonArray = [];
    var dataset = [];
    var tempobj={};

    data.series.forEach(function(series){
            var keys = getKeysFromJsonPayLoad(series.xy);
            keys.forEach(function(key){
               if(!xAxisLabel.has(key))
                   xAxisLabel.add(key);
            });
        });

        xAxisLabel.forEach(function(val){
            xAxisLabelJsonArray.push({"label": val});
        });

        var i=3;
        data.series.forEach(function(series){
            xAxisLabel.forEach(function(val){
                tempobj[val]=0;
            });
            var xydata = [];
            var keys = getKeysFromJsonPayLoad(series.xy);
            keys.forEach(function(key){
                tempobj[key]=series.xy[key];
            });

            xAxisLabel.forEach(function(val){
                xydata.push({"label": val,"value": tempobj[val]});
            });
            dataset.push({
                    "seriesname": series.name,
                    "anchorSides": i,
                    "anchorBgColor": "#000000",
                    "data": xydata
                });
            ++i;
        });

    var lineChart = new FusionCharts({
        type: 'msline',
        renderAt: id,
        width: '95%',
        height: '85%',
        dataFormat: 'json',
        dataSource: {
            "chart": {
                //Chart attributes
                "animation": "1",
                "paletteColors": paletteColors,
                "bgcolor": "white",
                "showBorder": "0",
                "baseFont": "sans-serif",
                "chartTopMargin": "40",
                "canvasPadding": "20",
                //X-Axis Name
                "xAxisName": data.xaxisLabel,
                "xAxisNameFontColor": "#000000",
                "xAxisNameFontSize": 14,
                "xAxisNameFontBold": "0",
                "xAxisNameAlpha": 60,
                "xAxisNamePadding": "10",
                //Y-Axis Name
                "yAxisName": data.yaxisLabel,
                "yAxisNameFontColor": "#000000",
                "yAxisNameFontSize": 14,
                "yAxisNameFontBold": "0",
                "yAxisNameAlpha": 60,
                "transposeAxis": "1",
                "yAxisNamePadding": "10",
                "showAxisLines": "0",
                "yAxisValuesPadding": "10",
                "setAdaptiveYMin": "1",
                //X-Axix Label attributes
                "labelPadding": "10",
                "showLabels": "1",
                "labelDisplay": "auto",
                "useEllipsesWhenOverflow": "1",
                "maxLabelHeight": "25",
                //Value attributes
                "showValues": "0",
                "showShadow": "0",
                "showZeroPlaneValue": "1",
                "valuePosition": "ABOVE",
                //Line And Anchor attributes
                "lineThickness": 0,
                "anchorRadius": 1,
                "anchorBorderThickness": 5,
                "showHoverEffect":"1",
                "anchorHoverRadius": 1,
                "anchorBgHoverColor": "#000000",
                "anchorBgHoverAlpha": "20",
                "anchorBorderHoverThickness": 8,
                //Tooltip attributes
                "toolTipColor": "#ffffff",
                "toolTipBorderThickness": "0",
                "toolTipBgColor": "#000000",
                "toolTipBgAlpha": "80",
                "toolTipBorderRadius": "2",
                "toolTipPadding": "5",
                "showToolTipShadow": "1",
                //Div lines attribute
                "showZeroPlane": "1",
                "numVDivLines": xAxisLabel.size-2,
                "adjustDiv": "1",
                "divLineColor": "#000000",
                "divLineAlpha": "10",
                "divlineThickness": "1",
                "divLineIsDashed": "0",
                "showCanvasBorder": "0",
                "zeroPlaneColor": "#000000",
                "zeroPlaneThickness": 2,
                "zeroPlaneAlpha": "5",
                //Legend attributes
                "showLegend": "1",
                "legendBgColor": "#ffffff",
                "legendBorderAlpha": '0',
                "legendShadow": '1',
                "legendItemFontSize": '10',
                "legendItemFontColor": '#666666',
                "legendItemHoverFontColor": "#000000",
                "legendAllowDrag": "0",
                "minimiseWrappingInLegend": "0",
                "plotHighlightEffect": "fadeout|color=black, alpha=30"
                //Export Chart
                    //"exportEnabled": "1",
                    //"exportFileName": data.title
            },
            "categories": [
                {
                    "category": xAxisLabelJsonArray
                }
            ],
            "dataset": dataset
        }
    });
    lineChart.render();
    
}


//Draw multi chart Area 
function drawMultiArea(id,data){
    //Setting title
    var title = data.title!=null ?data.title :"My Area Chart Title";
    drawTitle(id,title);
    
    //set onclick dashletMax function to the div
    if(id.indexOf("dashletMax") == -1)
        setOnclickMaxFun(id,data,"drawMultiArea");
    
    //Restructuring the data.
        let xAxisLabel = new Set();
        var xAxisLabelJsonArray = [];
        var dataset = [];
        var tempobj={};
        data.series.forEach(function(series){
            var keys = getKeysFromJsonPayLoad(series.xy);
            keys.forEach(function(key){
               if(!xAxisLabel.has(key))
                   xAxisLabel.add(key);
            });
        });

        xAxisLabel.forEach(function(val){
            xAxisLabelJsonArray.push({"label": val});
        });

        data.series.forEach(function(series){
            xAxisLabel.forEach(function(val){
                tempobj[val]=0;
            });
            var xydata = [];
            var keys = getKeysFromJsonPayLoad(series.xy);
            keys.forEach(function(key){
                tempobj[key]=series.xy[key];
            });

            xAxisLabel.forEach(function(val){
                xydata.push({"label": val,"value": tempobj[val]});
            });
            dataset.push({
                    "seriesname": series.name,
                    "data": xydata
                });
        });

    
    var chartType;
    if(data.stacked == true)
        chartType="stackedarea2d";
    else
        chartType="mssplinearea";
    
    var areaChart = new FusionCharts({
        type: chartType,
        renderAt: id,
        width: '95%',
        height: '85%',
        dataFormat: 'json',
        dataSource: {
    		"chart": {
                //chart Attribute
                "baseFont": "sans-serif",
                "chartTopMargin": "40",
                "paletteColors": paletteColors,
                "usePlotGradientColor": "0",
                "bgColor": "#ffffff",
                "showBorder": "0",
                "showShadow": "1",
                "canvasBgColor": "#ffffff",
                "showCanvasBorder": "0",
                "canvasPadding": "10",
                //X-Axis Name
                "xAxisName": data.xaxisLabel,
                "xAxisNameFontColor": "#000000",
                "xAxisNameFontSize": 14,
                "xAxisNameFontBold": "0",
                "xAxisNameAlpha": 60,
                "xAxisNamePadding": "10",
                //Y-Axis Name
                "yAxisName": data.yaxisLabel,
                "yAxisNameFontColor": "#000000",
                "yAxisNameFontSize": 14,
                "yAxisNameFontBold": "0",
                "yAxisNameAlpha": 60,
                "transposeAxis": "1",
                "yAxisNamePadding": "10",
                "showAxisLines": "0",
                "yAxisValuesPadding": "10",
                "setAdaptiveYMin": "1",
                //X-Axix Label attributes
                "labelPadding": "10",
                "showLabels": "1",
                "labelDisplay": "auto",
                "useEllipsesWhenOverflow": "1",
                "maxLabelHeight": "25",
                //Plot attributes
                "showValues": "0",
                "showZeroPlaneValue": "1",
                "showPlotBorder": "0",
                "anchorRadius": 2,
                "anchorBorderThickness": 1,
                "anchorSides": 1,
                "showHoverEffect":"1",
                "anchorHoverRadius": 6,
                "anchorBgHoverColor": "#000000",
                "anchorBgHoverAlpha": "20",
                "anchorBorderHoverThickness": 1,
                //Div lines attribute
                "showZeroPlane": "1",
                "adjustDiv": "1",
                "divLineColor": "#000000",
                "divLineAlpha": "10",
                "divlineThickness": "1",
                "divLineIsDashed": "0",
                "zeroPlaneColor": "#000000",
                "zeroPlaneThickness": 2,
                "zeroPlaneAlpha": "10",
                "showAlternateHGridColor": "0",
                "minimizeTendency": "1",
                //Legend attributes
                "showLegend": "1",
                "legendBgColor": "#ffffff",
                "legendBorderAlpha": '0',
                "legendShadow": '1',
                "legendItemFontSize": '10',
                "legendItemFontColor": '#666666',
                "legendItemHoverFontColor": "#000000",
                "legendAllowDrag": "0",
                "minimiseWrappingInLegend": "0",
                "plotHighlightEffect": "fadeout|color=black, alpha=10",
                //Tooltip attributes
                "toolTipColor": "#ffffff",
                "toolTipBorderThickness": "0",
                "toolTipBgColor": "#000000",
                "toolTipBgAlpha": "80",
                "toolTipBorderRadius": "2",
                "toolTipPadding": "5",
                "showToolTipShadow": "1"
            },
            "categories": [
              {
                "category": xAxisLabelJsonArray
              }
            ],
            "dataset": dataset
}
    });
    areaChart.render();
}

function drawMultiBar(id,data){
    if(data.horizontal === true){
        //Setting title
        var title = data.title!=null ?data.title :"My Bar Chart Title";
        drawTitle(id,title);

        drawMultiBar3D(id,data);
    }else{
        //Setting title
        var title = data.title!=null ?data.title :"My Column Chart Title";
        drawTitle(id,title);

        drawMultiColumn3D(id,data);
    }

}



//Draw Multi Series Bar chart 3D
function drawMultiBar3D(id,data){
    //Setting title
    drawTitle(id,data.title);
    
    //set onclick dashletMax function to the div
    if(id.indexOf("dashletMax") == -1)
        setOnclickMaxFun(id,data,"drawMultiBar3D");
    
    //Restructuring the data.
    let xAxisLabel = new Set();
    var xAxisLabelJsonArray = [];
    var dataset = [];
    var tempobj={};
    data.data.forEach(function(series){
        series.seriesData.forEach(function(seriesData){
           if(!xAxisLabel.has(seriesData.x)) 
               xAxisLabel.add(seriesData.x);
        });
    });
    
    xAxisLabel.forEach(function(val){
        xAxisLabelJsonArray.push({"label": val});tempobj[val]=0;
    });
    
    data.data.forEach(function(series){
        xAxisLabel.forEach(function(val){
            tempobj[val]=0;
        });
        var xydata = [];
        series.seriesData.forEach(function(data){
            tempobj[data.x]=data.y
        });
        
        xAxisLabel.forEach(function(val){
            xydata.push({"label": val,"value": tempobj[val]});
        });
        dataset.push({
                "seriesname": series.seriesName,
                "data": xydata
            });
    });
    
    
    
    var barchart3d = new FusionCharts({
        type: 'msbar3d',
        renderAt: id,
        width: '95%',
        height: '85%',
        dataFormat: 'json',
        dataSource: {
            "chart": {
                //chart attributes
                "paletteColors": paletteColors,
                "showShadow": "1",
                "adjustDiv": "1",
                "use3DLighting": "1",
                "bgcolor": "#ffffff",
                "showBorder": "0",
                "baseFont": "sans-serif",
                "chartTopMargin": "40",
                "canvasBgColor": "#ffffff",
                "canvasBaseColor": "#ffffff",
                "showCanvasBase": "1",
                "canvasBaseDepth": 13,
                "canvasBgDepth": 7,
                //Bar Attributes
                "maxBarHeight": "50",
                "showHoverEffect":"1",
                "overlapBars": "1",
                "plotHoverEffect": "1",
                //X-Axis Attributes
                "xAxisname": data.xaxisLabel,
                "useEllipsesWhenOverflow": "1",
                "maxLabelWidthPercent": "10",
                "xAxisNameFontColor": "#000000",
                "xAxisNameFontSize": 14,
                "xAxisNameFontBold": "0",
                "xAxisNameAlpha": 60,
                "xAxisNamePadding": "10",
                //Y-Axis Attributes
                "yAxisname": data.yaxisLabel,
                "setAdaptiveYMin": "1",
                "yAxisNameFontColor": "#000000",
                "yAxisNameFontSize": 14,
                "yAxisNameFontBold": "0",
                "yAxisNameAlpha": 60,
                "transposeAxis": "1",
                "yAxisNamePadding": "10",
                "yAxisValuesPadding": "10",
                "showAxisLines": "0",
                //Legend Attributes
                "showLegend": "1",
                "legendBgColor": "#ffffff",
                "legendBorderAlpha": '0',
                "legendShadow": '1',
                "legendItemFontSize": '10',
                "legendItemFontColor": '#666666',
                "legendItemHoverFontColor": "#000000",
                "legendAllowDrag": "0",
                "minimiseWrappingInLegend": "0",
                //"plotHighlightEffect": "fadeout|color=black, alpha=10",
                //Value Attributes
                "showValues": "1",
                "placeValuesInside": "1",
                "valueFontColor": "#F5F5F5",
                "valueFontItalic": "1",
                //Div Line Attribute
                "divLineColor": "#000000",
                "divLineAlpha": "10",
                "divlineThickness": "1",
                "divLineIsDashed": "0",
                "showCanvasBorder": "0",
                "zeroPlaneColor": "#000000",
                "zeroPlaneThickness": 2,
                "zeroPlaneAlpha": "5",
                "showAlternateHGridColor": "1",
                //Tooltip attributes
                "toolTipColor": "#ffffff",
                "toolTipBorderThickness": "0",
                "toolTipBgColor": "#000000",
                "toolTipBgAlpha": "80",
                "toolTipBorderRadius": "2",
                "toolTipPadding": "5",
                "showToolTipShadow": "1"
            },            
            "categories": [
                {
                    "category": xAxisLabelJsonArray
                }
            ],           
            "dataset": dataset
        }
    });
    barchart3d.render();
}

//Draw multi series column charts 3D
function drawMultiColumn3D(id,data){
    
    //set onclick dashletMax function to the div
    if(id.indexOf("dashletMax") == -1)
        setOnclickMaxFun(id,data,"drawMultiColumn3D");
    
    //Restructuring the data.
        let xAxisLabel = new Set();
        var xAxisLabelJsonArray = [];
        var dataset = [];
        var tempobj={};
        data.series.forEach(function(series){
            var keys = getKeysFromJsonPayLoad(series.xy);
            keys.forEach(function(key){
               if(!xAxisLabel.has(key))
                   xAxisLabel.add(key);
            });
        });

        xAxisLabel.forEach(function(val){
            xAxisLabelJsonArray.push({"label": val});
        });

        data.series.forEach(function(series){
            xAxisLabel.forEach(function(val){
                tempobj[val]=0;
            });
            var xydata = [];
            var keys = getKeysFromJsonPayLoad(series.xy);
            keys.forEach(function(key){
                tempobj[key]=series.xy[key];
            });

            xAxisLabel.forEach(function(val){
                xydata.push({"label": val,"value": tempobj[val]});
            });
            dataset.push({
                    "seriesname": series.name,
                    "data": xydata
                });
        });
    
    var chartType;
    if(data.stacked === true)
        chartType="stackedColumn3D";
    else
        chartType="mscolumn3d";
    
    
    var columnchart3d = new FusionCharts({
        type: chartType,
        renderAt: id,
        width: '95%',
        height: '85%',
        dataFormat: 'json',
        dataSource: {
            "chart": {
                //chart attributes
                "paletteColors": paletteColors,
                "showShadow": "1",
                "adjustDiv": "1",
                "use3DLighting": "1",
                "bgcolor": "#ffffff",
                "showBorder": "0",
                "baseFont": "sans-serif",
                "chartTopMargin": "40",
                "canvasBgColor": "#ffffff",
                "canvasBaseColor": "#ffffff",
                "showCanvasBase": "1",
                "canvasBaseDepth": 13,
                "canvasBgDepth": 7,
                //Bar Attributes
                "showHoverEffect":"1",
                "overlapColumns": "1",
                "plotHoverEffect": "1",
                "maxColWidth": 50,
                //X-Axis Attributes
                "xAxisname": data.xaxisLabel,
                "maxLabelHeight": "25",
                "useEllipsesWhenOverflow": "1",
                "xAxisNameFontColor": "#000000",
                "xAxisNameFontSize": 14,
                "xAxisNameFontBold": "0",
                "xAxisNameAlpha": 60,
                "xAxisNamePadding": "10",
                //Y-Axis Attributes
                "yAxisname": data.yaxisLabel,
                "setAdaptiveYMin": "0",
                "yAxisNameFontColor": "#000000",
                "yAxisNameFontSize": 14,
                "yAxisNameFontBold": "0",
                "yAxisNameAlpha": 60,
                "transposeAxis": "1",
                "yAxisNamePadding": "10",
                "showAxisLines": "0",
                "yAxisValuesPadding": "10",
                //Legend Attributes
                "showLegend": "1",
                "legendBgColor": "#ffffff",
                "legendBorderAlpha": '0',
                "legendShadow": '1',
                "legendItemFontSize": '10',
                "legendItemFontColor": '#666666',
                "legendItemHoverFontColor": "#000000",
                "legendAllowDrag": "0",
                "minimiseWrappingInLegend": "0",
                //"plotHighlightEffect": "fadeout|color=black, alpha=10",
                //Value Attributes
                "showValues": "1",
                "placeValuesInside": "1",
                "valueFontColor": "#F5F5F5",
                "valueFontItalic": "1",
                //Div Line Attribute
                "divLineColor": "#000000",
                "divLineAlpha": "10",
                "divlineThickness": "1",
                "divLineIsDashed": "0",
                "showCanvasBorder": "0",
                "zeroPlaneColor": "#000000",
                "zeroPlaneThickness": 2,
                "zeroPlaneAlpha": "5",
                "showAlternateHGridColor": "1",
                //Tooltip attributes
                "toolTipColor": "#ffffff",
                "toolTipBorderThickness": "0",
                "toolTipBgColor": "#000000",
                "toolTipBgAlpha": "80",
                "toolTipBorderRadius": "2",
                "toolTipPadding": "5",
                "showToolTipShadow": "1"
            },            
            "categories": [
                {
                    "category": xAxisLabelJsonArray
                }
            ],           
            "dataset": dataset
        }
    });
    columnchart3d.render();
}

function drawGauge3D(id,data){
    //Setting title
    var title = data.title!=null ?data.title :"My Gauge Chart Title";
    drawTitle(id,title);
    data["chartType"]="angulargauge";
    drawGauge(id,data);
}

function drawThermometer3D(id,data){
    //Setting title
    var title = data.title!=null ?data.title :"My Thermometer Chart Title";
    drawTitle(id,title);
    data["chartType"]="thermometer";
    drawGauge(id,data);
}

//Draw Gauge Chart
function drawGauge(id,data){
    
    //set onclick dashletMax function to the div
    if(id.indexOf("dashletMax") == -1)
        setOnclickMaxFun(id,data,"drawGauge");

    var label = data.subtitle!=null ?data.subtitle :"Label";
    
    var gaugeChart = new FusionCharts({
        type: data.chartType,
        renderAt: id,
        width: '75%',
        height: '75%',
        dataFormat: 'json',
        dataSource: {
            "chart": {
                "manageResize": "1",
                "bgcolor": "#ffffff",
                "baseFont": "sans-serif",
                "chartTopMargin": "40",
                "subcaption": label,
                "subCaptionFontSize": 15,
                "subCaptionFontBold": "0",
                "showShadow": "1",
                "showBorder": "0",
                "showHoverEffect": "1",
                "lowerLimit": data.min,
                "upperLimit": data.max,
                "gaugeFillMix": "{dark-30},{light-60},{dark-10}",
                "gaugeFillRatio": "15",
                "gaugeinnerradius": "40%",
                "tickValueDistance": "7",
                "showValue": "1",
                "valueFontBold": "1",
                "valueFontSize": 12,
                "pivotRadius": "10",
                "valueBelowPivot": "1",
                "valueAbovePointer": "1",
                "cylFillColor": "#008ee4",
                "cylRadius": "60",
                "thmFillColor": "#008ee4",
                "toolTipColor": "#ffffff",
                "toolTipBorderThickness": "0",
                "toolTipBgColor": "#000000",
                "toolTipBgAlpha": "80",
                "toolTipBorderRadius": "2",
                "toolTipPadding": "5",
                "showToolTipShadow": "1"
            },
            "colorRange": {
                "color": [
                    {
                        "minValue": "0",
                        "maxValue": data.max/2,
                        "code": "#6baa01",
                        "label": "Low"
                    },
                    {
                        "minValue": data.max/2,
                        "maxValue": (data.max/2)+(data.max/4),
                        "code": "#f8bd19",
                        "label": "Moderate"
                    },
                    {
                        "minValue": (data.max/2)+(data.max/4),
                        "maxValue": data.max,
                        "code": "#e44a00",
                        "label": "High"
                    }
                ]
            },
            "dials": {
                "dial": [{
                    "value": data.value,
                    "tooltext": label+" is "+data.value
                }]
            },
            "pointers": {
                "pointer": [
                    {
                       "value": data.value,
                        "tooltext": label+" is "+data.value
                    }
                ]
            },
            "value": data.value
        }
    });
    gaugeChart.render();
}

//Draw table
function drawTable(id,data){

    //Setting title
    drawTitle(id,data.title);

    //set onclick dashletMax function to the div
    if(id.indexOf("dashletMax") == -1)
        setOnclickMaxFun(id,data,"drawTable");
    //var width = $("#"+id).width()/data.columnNames.length;
    var width = (document.getElementById(id).offsetWidth/100)*98;
    
    //Table related tools section
    var tableTools = document.createElement("div");
        tableTools.setAttribute("class","table-tools");
    
    //Show-N rows dom
    var showNRows = document.createElement("div");
        showNRows.setAttribute("class","table-tools-section show-n-rows");
        showNRows.innerHTML = "Show <select onchange=\"showNRowsChange(this)\"><option value=\"10\" >10</option><option value=\"25\" >25</option><option value=\"50\" >50</option><option value=\"100\" >100</option></select> entries";
    tableTools.appendChild(showNRows);
    
    //Pagination dom
    var pagination = document.createElement("div");
        pagination.setAttribute("class","table-tools-section pagination-dom");
        //pagination.innerHTML = "Pagination ToDo";
    tableTools.appendChild(pagination);
    
    //Filter Dom
    var filter = document.createElement("div");
        filter.setAttribute("class","table-tools-section filter-dom");
        filter.innerHTML = "<div class=\"form-group\"><div class=\"form-group has-feedback\"><input type=\"text\" class=\"form-control\" onkeyup=\"filterTableRows(this)\" placeholder=\"Filter\"><span class=\"form-control-feedback fi-filter\"></span></div></div>";
    tableTools.appendChild(filter);
        
    document.getElementById(id).appendChild(tableTools);
    
    var tableToolsHeight = $(tableTools).height();
    showNRows.style.paddingTop = (tableToolsHeight - 10)/2;
    filter.style.paddingTop = (tableToolsHeight - 30)/2;
    pagination.style.paddingTop = (tableToolsHeight - 20)/2;
    
    
    //Table Content
    var tableCon = document.createElement("table");
        tableCon.style.width = width;
        var thead = document.createElement("thead");
            thead.style.width = width;
            var trHead = document.createElement("tr");
                trHead.style.width = width;
    for(var i=0;i<data.header.length;++i){
        var th = document.createElement("th");
            th.style.width = width/data.header.length;
            th.innerHTML = data.header[i];
            th.setAttribute("onClick","sortTable(this,+"+i+")");
            var sortIcon = document.createElement("span");
                sortIcon.setAttribute("class","fi-chevron table-sort-icon");
            th.appendChild(sortIcon);
        trHead.appendChild(th);
    }
    thead.appendChild(trHead);
    tableCon.appendChild(thead);
    var tbody = document.createElement("tbody");
        tbody.style.width = width;
    for(var l=0;l<data.rows.length;++l){
        var tr = document.createElement("tr");
            tr.style.width = width;
            var values = getValuesFromJsonPayLoad(data.rows[l]);

        for(var j=0;j<values.length;++j){
            var td = document.createElement("td");
                td.style.width = width/values.length;
                td.innerHTML = values[j];
            tr.appendChild(td);
        }
        tbody.appendChild(tr);
    }
    tableCon.appendChild(tbody);
    
    document.getElementById(id).appendChild(tableCon);
    
    createPagination(pagination,tbody.children);
    
    var wid = $(tableCon).width();
    var hig = $(tableCon).height();
    $(tableCon).css({'height': 0});
    //$(tableCon).animate({opacity: '1'},300);
    $(tableCon).animate({height: hig},1200);
}

//Table Sort Function - sort table
function sortTable(ele,index){
    var thSpan = ele.children[0];
    var direction = thSpan.className.indexOf("asc") > -1 ? "dec" : "asc"; 
    if(thSpan.className.indexOf("asc") > -1){
        direction = "dec";
        thSpan.classList.remove("asc");
        thSpan.classList.add("dec");
    }
    else if(thSpan.className.indexOf("dec") > -1){
        direction = "asc";
        thSpan.classList.remove("dec");
        thSpan.classList.add("asc");
    }
    else{
        //Remove others th Active class
        var otherTh = ele.parentNode.children;
        for(var i=0;i<otherTh.length;++i){
            if(otherTh[i].children[0].classList.contains("active")){
                otherTh[i].children[0].classList.remove("active");
                otherTh[i].children[0].classList.remove("asc");
                otherTh[i].children[0].classList.remove("dec");
            }
        }
        direction = "asc";
        thSpan.classList.add("active");
        thSpan.classList.add("asc");
    }
    //Get all rows of tbody table
    var tableRows = $(ele.parentNode.parentNode.nextElementSibling.childNodes).get();
    tableRows.sort(function(row1,row2){
        var row1Content = $(row1).children('td').eq(index).text().toUpperCase();
        var row2Content = $(row2).children('td').eq(index).text().toUpperCase();
        if(direction === "asc"){
            if(row1Content == "")
                return 1;
            else if(row2Content == "")
                return -1;
            else if(row1Content > row2Content)
                return 1;
            else
                return -1;
        }else{
            if(row1Content < row2Content)
                return 1;
            else
                return -1;
        }
    });
    var table = ele.parentNode.parentNode.parentNode;
    var flag=false;
    $.each(tableRows,function(i,row){
      if(!row.classList.contains("filtered")){
        $(table).children('tbody').append(row);
        if(flag)
        {row.style.background = "#f0f4f4"; flag=false;}
        else
           { row.style.background = "#ffffff"; flag=true;}
      }
    });
    
    //ToDo: Update Pagination
    createPagination(table.previousElementSibling.children[1],tableRows);
}

//Filter Table Function
function filterTableRows(ele){
    var attachTable = ele.parentElement.parentElement.parentElement.parentElement.nextElementSibling;
    var rows = attachTable.children[1].children;
    var filteredRows = $(rows).filter(function(index,row){
        if(row.innerText.toLowerCase().indexOf(ele.value.toLowerCase()) <= -1)
            return false;
        else
            return true;
    });
    var evenRow = false;
    for(var i=0;i<rows.length;++i){
        if(filteredRows.filter(function(index,row){if(row==rows[i]) return true; else return false}).length > 0)
        {
            rows[i].classList.remove("filtered");
            if(evenRow){
                rows[i].style.background = "#f0f4f4";
                evenRow = false;
            }else{
                rows[i].style.background = "#ffffff";
                evenRow = true;
            }
        }else{
            rows[i].classList.add("filtered");
        }
    }
    //Update sorting - if any
    var th = attachTable.children[0].children[0].children;
    var isPaginationCalled = false;
    for(var i=0;i<th.length;++i){
        if(th[i].children[0].classList.contains("asc"))
        { 
            th[i].children[0].classList.remove("asc");
            sortTable(th[i],i);
            isPaginationCalled = true;
            break;
        }else if(th[i].children[0].classList.contains("dec")){
            th[i].children[0].classList.remove("dec");
            th[i].children[0].classList.add("asc");
            sortTable(th[i],i);
            isPaginationCalled = true;
            break;
        }
    }
    
    //Update Pagination
    if(!isPaginationCalled){
        createPagination(ele.parentElement.parentElement.parentElement.previousElementSibling,rows);
    }
}

//Show N Rows
function showNRowsChange(ele){
    var rows = ele.parentNode.parentNode.nextElementSibling.children[1].children;
    createPagination(ele.parentNode.nextElementSibling,rows);
}

//Create Pagination
function createPagination(ele,rows){
    //Get Non Filtered Rows to apply pagination on those]
    var nonFilteredRows = $(rows).filter(function(index,row){if(!row.classList.contains("filtered")) return true; else return false;});
    //Get Show-N value
    var showNvalue = ele.previousElementSibling.children[0].value;
    
    drawPagination(ele,nonFilteredRows,showNvalue);
    
    //nonFilteredRows[0].classList.add("paged-out");
    //Hiding Table Rows for Pagination
    showNvalue = Number(showNvalue);
    var curPage = 1;
    var startIndex = (curPage-1)*showNvalue;
    var endIndex = (curPage*showNvalue)-1;
    for(var i=startIndex;i<=endIndex && i<nonFilteredRows.length;++i){
        nonFilteredRows[i].classList.remove("paged-out");
    }
    for(var i=endIndex+1;i<nonFilteredRows.length;++i){
        nonFilteredRows[i].classList.add("paged-out");
    }
}
//Draw Pagination
function drawPagination(ele,rows,showNvalue){
    //empty pagination tab
    while (ele.firstChild) {
        ele.removeChild(ele.firstChild);
    }
    
    var totalPages = Math.floor(rows.length / showNvalue);
        if(rows.length % showNvalue != 0)
            ++totalPages;
    
    //Create Previous Page
    var prev = document.createElement("div");
        prev.setAttribute("class","pagination-pages inactive");
        prev.setAttribute("currentPage",1);
        prev.innerHTML = "Prev";
    
    ele.appendChild(prev);
    
    //Create Page Numbers
    var ellipseFlag = false;
    for(var i=1;i<=totalPages;++i){
        var page = document.createElement("div");
        if(i==1)
           page.setAttribute("class","pagination-pages selected"); 
        else{
            page.setAttribute("class","pagination-pages active");
            page.setAttribute("onClick","jumpToNthPage(this,"+totalPages+","+showNvalue+")");
        }
        if(totalPages>6 && i>2 && i<totalPages)
        {
            if(ellipseFlag)
                 continue;
            else{
                page.setAttribute("class","pagination-pages");
                page.setAttribute("value","-1");
                page.innerHTML = "...";//"<span class=\"fiext-ellipses\"></span>";
                ellipseFlag=true;
                ele.appendChild(page);
            }
        }else{
            page.setAttribute("value",i);
            page.innerHTML = i;
            ele.appendChild(page);
        }
    }
    
    //Create Next Page
    var next = document.createElement("div");
        if(totalPages == 1 || totalPages <= 0)
            next.setAttribute("class","pagination-pages inactive");
        else{
            next.setAttribute("class","pagination-pages active");
            next.setAttribute("onClick","jumpToNextPage(this,"+totalPages+","+showNvalue+")");
        }
        next.setAttribute("currentPage",1);
        next.innerHTML = "Next";
    ele.appendChild(next);     
}

function jumpToPrevPage(ele,totalPages,showNvalue){
    var curPage = Number(ele.getAttribute("currentPage"));
    var paginationDom = ele.parentNode;
    var prevPage = curPage-1;
    var prev = paginationDom.firstChild;
    var next = paginationDom.lastChild;
    
    pagesEllipsesDraw(paginationDom,curPage,prevPage,totalPages,showNvalue); 
    
    var childs = paginationDom.children;
    var childLen = childs.length;
    if(curPage == totalPages){
        childs[childLen-2].classList.remove("selected");
        childs[childLen-2].classList.add("active");
        childs[childLen-2].setAttribute("onClick","jumpToNthPage(this,"+totalPages+","+showNvalue+")");
        next.setAttribute("onClick","jumpToNextPage(this,"+totalPages+","+showNvalue+")");
        next.classList.remove("inactive");
        next.classList.add("active");
    }
    if(prevPage == 1){
        prev.setAttribute("onClick","");
        prev.classList.remove("active");
        prev.classList.add("inactive");
    }
    prev.setAttribute("currentPage",prevPage);
    next.setAttribute("currentPage",prevPage);
    
    
    var rows = ele.parentNode.parentNode.nextElementSibling.children[1].children;
    var nonFilteredRows = $(rows).filter(function(index,row){if(!row.classList.contains("filtered")) return true; else return false;});
    //Hide Rows For CurPage
    var startIndex = (curPage-1)*showNvalue;
    var endIndex = (curPage*showNvalue)-1;
    for(var i=startIndex;i<=endIndex && i<nonFilteredRows.length;++i){
        nonFilteredRows[i].classList.add("paged-out");
    }
    startIndex = (prevPage-1)*showNvalue;
    endIndex = (prevPage*showNvalue)-1;
    for(var i=startIndex;i<=endIndex && i<nonFilteredRows.length;++i){
        nonFilteredRows[i].classList.remove("paged-out");
    }
}
function jumpToNextPage(ele,totalPages,showNvalue){
    var curPage = Number(ele.getAttribute("currentPage"));
    var paginationDom = ele.parentNode;
    var nextPage = curPage+1;
    var prev = paginationDom.firstChild;
    var next = paginationDom.lastChild;
    
    pagesEllipsesDraw(paginationDom,curPage,nextPage,totalPages,showNvalue); 
    
    if(curPage == 1){
        paginationDom.children[1].classList.remove("selected");
        paginationDom.children[1].classList.add("active");
        paginationDom.children[1].setAttribute("onClick","jumpToNthPage(this,"+totalPages+","+showNvalue+")");
        prev.setAttribute("onClick","jumpToPrevPage(this,"+totalPages+","+showNvalue+")");
        prev.classList.remove("inactive");
        prev.classList.add("active");
    }
    if(nextPage == totalPages){
        next.setAttribute("onClick","");
        next.classList.remove("active");
        next.classList.add("inactive");
    }
    prev.setAttribute("currentPage",nextPage);
    next.setAttribute("currentPage",nextPage);
    
    var rows = ele.parentNode.parentNode.nextElementSibling.children[1].children;
    var nonFilteredRows = $(rows).filter(function(index,row){if(!row.classList.contains("filtered")) return true; else return false;});
    //Hide Rows For CurPage
    var startIndex = (curPage-1)*showNvalue;
    var endIndex = (curPage*showNvalue)-1;
    for(var i=startIndex;i<=endIndex && i<nonFilteredRows.length;++i){
        nonFilteredRows[i].classList.add("paged-out");
    }
    startIndex = (nextPage-1)*showNvalue;
    endIndex = (nextPage*showNvalue)-1;
    for(var i=startIndex;i<=endIndex && i<nonFilteredRows.length;++i){
        nonFilteredRows[i].classList.remove("paged-out");
    }
}

function jumpToNthPage(ele,totalPages,showNvalue){
    var paginationDom = ele.parentNode;
    var prev = paginationDom.firstChild;
    var next = paginationDom.lastChild;
    var curPage = Number(prev.getAttribute("currentPage"));
    var nextPage = Number(ele.getAttribute("value"));
    
    pagesEllipsesDraw(paginationDom,curPage,nextPage,totalPages,showNvalue);
    
    if(curPage == 1){
        paginationDom.children[1].classList.remove("selected");
        paginationDom.children[1].classList.add("active");
        paginationDom.children[1].setAttribute("onClick","jumpToNthPage(this,"+totalPages+","+showNvalue+")");
        prev.setAttribute("onClick","jumpToPrevPage(this,"+totalPages+","+showNvalue+")");
        prev.classList.remove("inactive");
        prev.classList.add("active");
    }else if(curPage == totalPages){
        var childs = paginationDom.children;
        var childLen = childs.length;
        childs[childLen-2].classList.remove("selected");
        childs[childLen-2].classList.add("active");
        childs[childLen-2].setAttribute("onClick","jumpToNthPage(this,"+totalPages+","+showNvalue+")");
        next.setAttribute("onClick","jumpToNextPage(this,"+totalPages+","+showNvalue+")");
        next.classList.remove("inactive");
        next.classList.add("active");
    }
    if(nextPage == totalPages){
        next.setAttribute("onClick","");
        next.classList.remove("active");
        next.classList.add("inactive");
    }else if(nextPage == 1){
        prev.setAttribute("onClick","");
        prev.classList.remove("active");
        prev.classList.add("inactive");
    }
    
    prev.setAttribute("currentPage",nextPage);
    next.setAttribute("currentPage",nextPage);
    
    var rows = ele.parentNode.parentNode.nextElementSibling.children[1].children;
    var nonFilteredRows = $(rows).filter(function(index,row){if(!row.classList.contains("filtered")) return true; else return false;});
    //Hide Rows For CurPage
    var startIndex = (curPage-1)*showNvalue;
    var endIndex = (curPage*showNvalue)-1;
    for(var i=startIndex;i<=endIndex && i<nonFilteredRows.length;++i){
        nonFilteredRows[i].classList.add("paged-out");
    }
    startIndex = (nextPage-1)*showNvalue;
    endIndex = (nextPage*showNvalue)-1;
    for(var i=startIndex;i<=endIndex && i<nonFilteredRows.length;++i){
        nonFilteredRows[i].classList.remove("paged-out");
    }
}

function pagesEllipsesDraw(paginationDom,sourcePage,destPage,totalPages,showNvalue){
    for(var i=2;i<paginationDom.children.length-2;){
        paginationDom.removeChild(paginationDom.children[i]);
    }
    if(destPage == totalPages){
        paginationDom.lastChild.previousElementSibling.classList.remove("active");
        paginationDom.lastChild.previousElementSibling.classList.add("selected");
    }else if(destPage == 1){
        paginationDom.firstChild.nextElementSibling.classList.remove("active");
        paginationDom.firstChild.nextElementSibling.classList.add("selected");
    }else{
        var page = document.createElement("div");
            page.setAttribute("class","pagination-pages selected");
            page.setAttribute("value",destPage);
            page.innerHTML = destPage;
        $(paginationDom).children(':eq(1)').after(page);
    }
    if(destPage-1 > 1){
        var pagePre = document.createElement("div");
            pagePre.setAttribute("class","pagination-pages active");
            pagePre.setAttribute("onClick","jumpToNthPage(this,"+totalPages+","+showNvalue+")");
            pagePre.setAttribute("value",destPage-1);
            pagePre.innerHTML = destPage-1;
        $(paginationDom).children(':eq(1)').after(pagePre);
    }
    if(totalPages-destPage > 1){
        var pageNext = document.createElement("div");
            pageNext.setAttribute("class","pagination-pages active");
            pageNext.setAttribute("onClick","jumpToNthPage(this,"+totalPages+","+showNvalue+")");
            pageNext.setAttribute("value",destPage+1);
            pageNext.innerHTML = destPage+1;
        $(paginationDom).children(":eq("+(paginationDom.children.length-2)+")").before(pageNext);
    }
    if(destPage-2 > 1){
        var ellipse = document.createElement("div");
            ellipse.setAttribute("class","pagination-pages");
            ellipse.setAttribute("value",-1);
            ellipse.innerHTML = "...";
        $(paginationDom).children(':eq(1)').after(ellipse);
    }
    if(totalPages-(destPage+1) > 1){
        var ellipse = document.createElement("div");
            ellipse.setAttribute("class","pagination-pages");
            ellipse.setAttribute("value",-1);
            ellipse.innerHTML = "...";
        $(paginationDom).children(":eq("+(paginationDom.children.length-2)+")").before(ellipse);
    }
}