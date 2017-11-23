/*
 * Copyright 2006 by Cisco Systems
 * All rights reserved.
 *
 * This software is the confidential and proprietary information
 * of Cisco Systems,  ("Confidential Information").  You
 * shall not disclose such Confidential Information and shall use
 * it only in accordance with the terms of the license agreement
 * you entered into with Cisco Systems.
 */

/**
 * @author rosharm3 and aarulpra
 */



function multiSelectDropdown(id){
    $(id).multiselect({columns:1,placeholder:'Select Languages'});
}

function customChartPopupRemove(){
  console.log("clicked on close button");
  $("div.customChartPopupParent").remove();
}

function customizeChartPopup(reportID,chartID,chartTitle,previousChoice,event){
  //if( !event ) event = window.event;
  var logsessionId = localStorage.getItem("logsessionId");
  var sessionId = localStorage.getItem("sessionId");
   $.get("/webacs/reportsAction.do?command=customizeChart&reportId="+reportID+"&logSessionId="+logsessionId+"&sessionId="+sessionId, function(data, status){
        if(status === "success")
            createPopupElement(data,reportID,chartID,chartTitle,previousChoice,event);
   });
}

function setDefaultTab(){
		var allTabs = $(".customChartPopupTabActive");

		for(var i=0;i<allTabs.length;++i){
	    var sliderID = allTabs[i].parentNode.children[0].id;
		var x = allTabs[i].offsetLeft+"px";
    	var y = allTabs[i].offsetTop+"px";
    	var width = $(allTabs[i]).width()+"px";
    	var height = $(allTabs[i]).height()+"px";
    	var padding = $(allTabs[i]).css('padding');
    	$("#"+sliderID).css("left",x);
    	$("#"+sliderID).css("top",y);
    	$("#"+sliderID).css("width",width);
    	$("#"+sliderID).css("height",height);
    	$("#"+sliderID).css("padding",padding);
    }

	}

function switchttab(tab){

		var allTabs = tab.parentNode.children;
		for(var i=0;i<allTabs.length;++i){
			if(allTabs[i].className.indexOf("customChartPopupTabActive") >= 0)
			{
				allTabs[i].className = "customChartPopupTab";
				//allTabs[i].className = allTabs[i].className.replace("customChartPopupTabActive","");
				break;
			}
		}

		//tab.className = tab.className.replace(" customChartPopupTab","");
    	tab.className = " customChartPopupTabActive";

    	var sliderID = tab.parentNode.children[0].id;
        debugger;
    	var x = tab.offsetLeft+"px";
    	var y = tab.offsetTop+"px";
    	var width = $(tab).width();
    	var height = $(tab).height();
    	var padding = $(tab).css('padding');
    	$("#"+sliderID).animate({ "left": x , "top": y , "width": width , "height": height , "padding": padding}, 400 );


	}

function createPopupElement(popupFormData,reportID,chartID,chartTitle,previousChoice,event){

    //Top level div for popup
      var customChartdivParent = document.createElement("div");
          customChartdivParent.className = 'customChartPopupParent';

      //Form level div for popup
            var customPopupdiv = document.createElement("div");
                customPopupdiv.className = 'customChartPopup';
                var xpoint = event.clientX;
                var windowWidth = window.innerWidth;
                var innerHeight = window.innerHeight;
                if(xpoint <= windowWidth/2)
                  xpoint += windowWidth/4;
                else
                  xpoint -= windowWidth/4;

                $(customPopupdiv).css("left",xpoint);
                $(customPopupdiv).css("top",event.clientY);
                $(customPopupdiv).css("z-index","-1");
            //Content for popup

      var popupTitleDiv = document.createElement("div");
          popupTitleDiv.className = "customPopupTitleDiv";

      //Title Content
          var customChartPopupTitle = document.createElement("span");
            customChartPopupTitle.className = 'customChartPopupTitle';
            customChartPopupTitle.innerHTML = "Customize Chart";


          //Close button for popup
        var customChartPopupclosebutton = document.createElement("span");
            customChartPopupclosebutton.className = 'fi-delete customChartPopupclose';
            //customChartPopupclosebutton.innerHTML = "x";
            customChartPopupclosebutton.onclick = function() {customChartPopupRemove(); }

        //Adding title to title div
        popupTitleDiv.appendChild(customChartPopupTitle);
        //Adding close button to title div
        popupTitleDiv.appendChild(customChartPopupclosebutton);

        //Adding title div to popup level div
        customPopupdiv.appendChild(popupTitleDiv);
        //Adding popup level div to root level div
        customChartdivParent.appendChild(customPopupdiv);
        //Adding root level div to body
        document.body.appendChild(customChartdivParent);

        var formDiv = document.createElement("div");
                formDiv.className = "customChartPopupFormDiv";

            var form = document.createElement("form");
                form.setAttribute("name","costomChart");
                $(form).on('submit', function (e) {

                var isRequiredSelected = getAllSelectedInputsAndConvertChart(popupFormData,reportID,chartID,chartTitle);
                if(isRequiredSelected == true)
                    converttoSelectedChart();
                else
                    alert("Please select Y-Axis from dropdown.");

                //stop form submission
                e.preventDefault();
                });

            //Creating Radio buttons for all available charts
            var radioDiv =  document.createElement("div");
                 radioDiv.className = "customChartPopupInputContainer";
            var  tabSlidingWindow = document.createElement("div");
                 tabSlidingWindow.className = "slider";
                 tabSlidingWindow.id = "slider_"+reportID;
            radioDiv.appendChild(tabSlidingWindow);
            popupFormData.forEach(function(data,i){
              var labelRadio = document.createElement("label");
                  labelRadio.className = "customChartPopupTab";
                  labelRadio.onclick = function() {
                    switchttab(this);
                    //radioButtonOnClickEvent(data.name);
                  };

              var radioInput = document.createElement("input");
                  radioInput.setAttribute('type',"radio");
                  radioInput.setAttribute('name',"chartsRadio");
                  radioInput.setAttribute('value',data.name);
                  radioInput.style.display = "none"
                  if(previousChoice != null)
                  {
                    if(typeof previousChoice.name != "undefined" && capitalizeFirstLetter(data.name) === previousChoice.name)
                      {  radioInput.setAttribute('checked',"true");
                         labelRadio.className = "customChartPopupTabActive";

                      }
                  }
                  else if(previousChoice == null)
                  {
                    if(i == 0){
                        radioInput.setAttribute('checked',"true");
                        labelRadio.className = "customChartPopupTabActive";
                        }
                  }
                  $(radioInput).on('click', function(){
                    radioButtonOnClickEvent(data.name);
                  });

                  labelRadio.appendChild(radioInput);
                  var iconSpan = document.createElement("span");
                      iconSpan.className = "fi-chart"+data.name.toLowerCase()+" chartTabIcon";

                  var chartFont = document.createElement("font");
                      chartFont.className = "chartTabFont";
                      chartFont.innerHTML = capitalizeFirstLetter(data.name);
                      //chartFont.style.fontFamily  = "Tahoma,Verdana, Arial";
                      //chartFont.style.color = "black";
                      //chartFont.style.marginLeft = "4px";
                  iconSpan.appendChild(chartFont);
                  labelRadio.appendChild(iconSpan);
                  //labelRadio.appendChild(document.createTextNode(" "+capitalizeFirstLetter(data.name)));

                  radioDiv.appendChild(labelRadio);
            });

            form.appendChild(radioDiv);

            var hrAbove = document.createElement("hr");
                hrAbove.className = "customChartPopupHr";
            form.appendChild(hrAbove);

            popupFormData.forEach(function(data,i){
              var attributeDiv = document.createElement("div");
                  attributeDiv.className = "customChartPopupAttributeContainer";
                  attributeDiv.id = data.name;
                  if(previousChoice != null)
                  {
                    if(typeof previousChoice.name != "undefined" && capitalizeFirstLetter(data.name) === previousChoice.name)
                        attributeDiv.style.display = "block";
                  }
                  else if(previousChoice == null)
                  {
                     if(i == 0)
                        attributeDiv.style.display = "block";
                  }

              data.input.forEach(function(attributes,i){
                var labelDropDown = document.createElement("label");
                    labelDropDown.className = "customChartPopupAttribute";

                var labelTitle = document.createElement("p");
                    labelTitle.className = "customChartPopupDropDownTitle";
                    labelTitle.innerHTML = attributes.name;
                    if(i == 0)
                      labelTitle.style.marginTop = "0px";
                labelDropDown.appendChild(labelTitle);

                var selectList = document.createElement("select");
                    selectList.setAttribute("id", data.name+"_"+attributes.name);
                    var selectID = "#"+data.name+"_"+attributes.name;
                    if(data.name !== "pie" && data.name !== "bar" && i === 1 )
                    {
                        selectList.setAttribute("multiple", "multiple");
                        selectList.setAttribute("class","multiSelectList");
                       $(function () { $('.multiSelectList').multiselect({
                            columns: 1,
                            placeholder: 'Select',
                            search: true,
                            selectAll: true }); });
                    }
                attributes.value.forEach(function(value,optioni){
                  var listOption = document.createElement("option");
                  if(previousChoice!=null && isOptionInpreviousSelect(previousChoice.input[i].value, value))
                      listOption.setAttribute("selected","selected");
                      listOption.setAttribute("value", value);
		              listOption.setAttribute("class","selectOptionStyle");
                      listOption.appendChild(document.createTextNode(value));
                  selectList.appendChild(listOption);
                });

                labelDropDown.appendChild(selectList);

                attributeDiv.appendChild(labelDropDown);
              });

              if(data.name !== "pie" && data.name !== "bar")
              {

              var labelTextBox = document.createElement("label");
                  labelTextBox.className = "customChartPopupAttribute";

              var labelTitle = document.createElement("p");
                  labelTitle.className = "customChartPopupDropDownTitle";
                  labelTitle.innerHTML = "yAxis Label";

                labelTextBox.appendChild(labelTitle);

              var textBox = document.createElement("input");
              textBox.type = "text";
              textBox.setAttribute("name", data.name+"_"+"yaxislabel");
              textBox.setAttribute("id", data.name+"_"+"yaxislabel");
              textBox.setAttribute("class", "customchartFormTextBox");
			  textBox.setAttribute("maxlength", "20");
			  
              if(previousChoice != null)
              {
                if(typeof previousChoice.yaxislabel != "undefined")
                    textBox.setAttribute("value", previousChoice.yaxislabel);
              }
              else
                textBox.setAttribute("placeholder", "Key yAxis name here...");


              labelTextBox.appendChild(textBox);
              attributeDiv.appendChild(labelTextBox);

            }




              form.appendChild(attributeDiv);
            });


            //Adding submit and cancel button with line above

            var submitbuttonsDiv = document.createElement("div");
                submitbuttonsDiv.className = "customChartPopupSubmitButtonContainer";
		submitbuttonsDiv.setAttribute("align","right");
            var submit = document.createElement("input");
                submit.setAttribute('type',"submit");
                submit.setAttribute('name',"Submit");
                submit.setAttribute('value',"Apply");
                submit.setAttribute("class","blueButton");
                submit.style.marginRight = "10px";

            var cancel = document.createElement("input");
                cancel.setAttribute('type',"button");
                cancel.setAttribute('name',"Cancel");
                cancel.setAttribute('value',"Cancel");
                cancel.setAttribute("class","whiteButton");
                $(cancel).on('click', function (e) {
                console.log("on cancel function");
                cencelCustomPopup();

                e.preventDefault();
                });

                var hrBelow = document.createElement("hr");
                hrBelow.className = "customChartPopupHr";
                form.appendChild(hrBelow);

                submitbuttonsDiv.appendChild(submit);
                submitbuttonsDiv.appendChild(cancel);
                form.appendChild(submitbuttonsDiv);


                formDiv.appendChild(form);

                customPopupdiv.appendChild(formDiv);

                setDefaultTab();
}

function isOptionInpreviousSelect(prevSelectValues, currOptionValue){
    if(typeof prevSelectValues == "string")
    {
        if(prevSelectValues === currOptionValue)
            return true;
        else
            return false;
    }
    else if(typeof prevSelectValues == "object"){
        if(prevSelectValues.indexOf(currOptionValue) > -1)
            return true;
        else
            return false;

    }
}

  //Function to get all selected inputs
function getAllSelectedInputsAndConvertChart(popupFormData,reportID,chartID,chartTitle){
  var chartSelected = $("input[type='radio'][name='chartsRadio']:checked").val();
  var selectedChartsAttribute;
  var isrequiredSelected = true;
  popupFormData.forEach(function(data,i){
    if( data.name === chartSelected){
        selectedChartsAttribute = data.input.map(function(attributes,ind){
            var selectID = chartSelected+"_"+attributes.name;
            var select = document.getElementById(selectID);
             var optionselected;
            if(chartSelected !== "Pie" && chartSelected !== "Bar" && ind === 1)
            {
                selectID = "#"+selectID;
                if($(selectID).val().length === 0){
                   isrequiredSelected = false;
                }
                optionselected = $(selectID).val();
                optionselected = optionselected.toString();
            }
            else
                optionselected = select.options[select.selectedIndex].value;
            return {
              name: attributes.name,
              value: optionselected
            };
        });
        chartSelected = capitalizeFirstLetter(chartSelected);
        //console.log(JSON.stringify(selectedChartsAttribute));

        var yaxislabel;
        if(chartSelected !== "Pie" && chartSelected !== "Bar")
        {
            var ylabelID = data.name+"_"+"yaxislabel";
            yaxislabel = document.getElementById(ylabelID).value;

        }
        var selectedChart = {
                                        "name": chartSelected,
                                        "input": selectedChartsAttribute,
                                        "yaxislabel": yaxislabel
                };
			var sessionId = localStorage.getItem("sessionId");
			var logsessionId = localStorage.getItem("logsessionId");
           var postData = {
                       "reportId": reportID,
                       "reportTitle": chartTitle,
                       "c1": selectedChartsAttribute[0].value,
                       "c2": selectedChartsAttribute[1].value,
                       "chartType": chartSelected,
                       "yAxisLabel": yaxislabel,
           			"command":"customizeChartData",
					"sessionId":sessionId,
					"logSessionId":logsessionId
                   };
			var chartTitleTemp =selectedChartsAttribute[1].value+" by "+selectedChartsAttribute[0].value;
           $.ajax({
           				type:"POST",
           				url: "/webacs/reportsAction.do",
           				headers: {'Content-Type': 'application/x-www-form-urlencoded','csrf_token':csrf},
           				data:postData,
           				dataType: 'json',
           				success: function(data){
           				console.log(data);
           				//Remove existing chart
                                       var charsDiv = $.find("#chartContent_"+chartID+",#lineChartContent_"+chartID+",#barChartContent_"+chartID)[0];
                                       $(charsDiv).empty();
                                       //Call draw function for creating chart
                                       switch (chartSelected) {
                                        case "Pie":
                                            $(charsDiv).attr("id","chartContent_"+chartID);
											
											drawPie(chartID, data, selectedChart,chartTitleTemp);
											
                                            break;
                                        case "Line":
                                            $(charsDiv).attr("id","lineChartContent_"+chartID);
											if(selectedChartsAttribute[1].value.indexOf(",") != -1)
											chartTitleTemp="";
                                            drawLine(chartID, data, selectedChart,chartTitleTemp);
											
                                            break;
                                        case "Bar":
                                            $(charsDiv).attr("id","barChartContent_"+chartID);
											if(selectedChartsAttribute[1].value.indexOf(",") != -1)
											chartTitleTemp="";
										     drawBarChart(chartID,data, selectedChart,chartTitleTemp);
											
                                            break;
                                        case "Stackedbar":
                                            $(charsDiv).attr("id","barChartContent_"+chartID);
											if(selectedChartsAttribute[1].value.indexOf(",") != -1)
											chartTitleTemp="";
                                            drawBarChart(chartID, data, selectedChart,chartTitleTemp);
											
                                            break;
                                       }
                           }
                  });
        return false;
    }
    else
      return true;
  });

    return isrequiredSelected;
}

//Function used by customizeChartPopup() method to call ajax and get the data to draw selected chart.
function converttoSelectedChart() {
  //Need to implement.
  //alert("call to ajax");
  customChartPopupRemove();
}

//Function used by customizeChartPopup() method to cancel the form and close popup
function cencelCustomPopup() {
  customChartPopupRemove();
}

//Function to convert string case to camel case.
function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

//Function to display and hide respective chart content
function radioButtonOnClickEvent(name){
    name = "#"+name;
    $("div.customChartPopupAttributeContainer").slideUp();
    //$("div.customChartPopupAttributeContainer").css("display","none");
    $(name).slideDown();
    //$(name).css("display","block");
}




/* Function to draw Time Series Bar Chart */
var randomColors = ["#95CEFF", "#90ed7d", "#f7a35c", "#8085e9", "#f15c80", "#808000", "#00FF00", "#FFD700", "#00FFFF",
                                 "#7FFFD4", "#483D8B", "#800080", "#DDA0DD", "#FF00FF", "#FF1493", "#FFFACD", "#BC8F8F", "#F0FFF0", "#C0C0C0",
                                 "#546e91", "#8bde95", "#d2ab58", "#273c71", "#98bf6e", "#4daa4b", "#98abc5", "#cc1010", "#31383b", "#006391",
                                 "#c2643f", "#b0a474", "#a5a39c", "#a9c2bc", "#22af8c", "#7fcecf", "#987ac6", "#3d3b87", "#b77b1c", "#c9c2b6",
                                 "#807ece", "#8db27c", "#be66a2", "#9ed3c6", "#00644b", "#005064", "#77979f", "#77e079", "#9c73ab", "#1f79a7"
                               ];
var randomColor = function() {
    return randomColors[Math.floor(Math.random()*randomColors.length)];
};

function drawBarChart(id,dataInput, previousChoice,chartTitle){
	var divId="overlayBarDivId"+id;
	var loaderDivId="loaderBarDivId"+id;
	var div='<div id='+divId+' style="width: 100%;height: 100%;background:#000000;position: absolute;top: 0;right: 1rem;opacity: 0.4;pointer-events:none;z-index: 1000;"></div>';
	var loaderDiv='<div id='+loaderDivId+' style="font-size: 4rem;color: #fefefe;position: relative;top:200;z-index: 1001;">Loading ...</div>'
	$("#barChartContent_"+id).append(div);
	$("#barChartContent_"+id).append(loaderDiv);

    setTimeout(function(){
        if(dataInput.stacked){
        drawStackedBarChart(id,dataInput,previousChoice,chartTitle);
        }else{
        drawTimeseriesBarChart(id,dataInput,previousChoice,chartTitle);
        }
		$("#overlayBarDivId"+id).remove();
		$("#loaderBarDivId"+id).remove();

    },5000);
}

function drawTimeseriesBarChart(id,dataInput,previousChoice,chartTitle){


 //This function is only draw Bar chart for one line series.
 //For multiple line series use stacked bar chart.
  var parseDateNew = d3.time.format("%m/%e/%y %H:%M").parse;
    var formatTime = d3.time.format("%b,%d %Y %H:%M:%S");

  //Declaring All neccessary variable
    var windowWidth = $(window).width();
    var blockFinalWidth = (windowWidth - 60-60-28-150)/2;
    var chartMargin = {top: 20, right: 55, bottom: 100, left: 70};
    var chartWidth = blockFinalWidth - chartMargin.left - chartMargin.right;
    var chartHeight = 450  - chartMargin.top  - chartMargin.bottom;
    var chartSeriesData = [];
    var chartSeriesName = [];
    var chartXaxisFixedDataPoints = [];
    var barMargins = [.9,.8,.8,.7,.6,.6,.5,.4,.3,.3,.2,.2];


    var inputDataNonZeroOnly = [];
           	//Removing zero x-axis data points
            dataInput.data.forEach(function(data){
                var tempseries = {};
                tempseries["seriesName"] = data.seriesName;
                var tempseriesData = [];
                data.seriesData.forEach(function(d){
                    if(d.y != 0){
                        var tempseriesDataobj = {};
                        tempseriesDataobj["x"] = d.x;
                        tempseriesDataobj["y"] = d.y;
                        tempseriesData.push(tempseriesDataobj);
                    }
                });
                tempseries["seriesData"] = tempseriesData;
                tempseries["seriesColor"] = data.seriesColor;
                inputDataNonZeroOnly.push(tempseries);
            });
           	console.log(JSON.stringify(inputDataNonZeroOnly));



  //Fetching and converting XaxisFixedDataPoints from string to date
      if( dataInput.xaxisFixedDataPoints === null )
      {
          inputDataNonZeroOnly.forEach(function(data){
                  data.seriesData.forEach(function(d){
                      if (chartXaxisFixedDataPoints.indexOf(d.x) <= -1) {
                          chartXaxisFixedDataPoints.push(d.x);
                      }
                  });
              });
      }
      else
      {
         dataInput.xaxisFixedDataPoints.forEach(function(xaxispoint) {
             chartXaxisFixedDataPoints.push(parseDateNew(xaxispoint));
           });
      }

      //console.log(JSON.stringify(chartXaxisFixedDataPoints));




  //Fetching line series Name
    dataInput.data.forEach(function(d){
      chartSeriesName.push(d.seriesName);
    });

  //Fetching and restructuring line series Data
    if( dataInput.xaxisFixedDataPoints === null )
    {
      chartSeriesData = inputDataNonZeroOnly.map(function(data){
          return {
            name: data.seriesName,
            values: data.seriesData.map(function(d){
              return {name: data.seriesName, X: d.x, value: +d.y };
            })
          };
        });
    }
    else{
    chartSeriesData = dataInput.data.map(function(data){
      return {
        name: data.seriesName,
        values: data.seriesData.map(function(d){
          return {name: data.seriesName, X: parseDateNew(d.x), value: +d.y };
        })
      };
    });
    }

    //console.log(chartSeriesData);

  //Adding Costomize Icon for converting charts.
 var customChartImg = document.createElement("img");
        customChartImg.setAttribute("class", "customChartImg")
        customChartImg.setAttribute("src", "costomChart.png")
        customChartImg.setAttribute("title","Customize Charts")
        customChartImg.setAttribute("width","30px");
        customChartImg.setAttribute("align","left")
        customChartImg.addEventListener('click', eventHandler(dataInput.reportIdentifier,id,dataInput.title,previousChoice));

        document.getElementById("barChartContent_"+id).appendChild(customChartImg);


    d3.select('#barChartContent_'+id).append("br");
    d3.select('#barChartContent_'+id).append("br");

  //Adding Line Chart title
  var tempChartTitle = "";
  if(typeof chartTitle != "undefined" && chartTitle.length>0)
  {
	tempChartTitle = chartTitle;

   }else if(typeof chartTitle == "undefined")
   {
	tempChartTitle = dataInput.title;
   }

	 d3.select('#barChartContent_'+id).append("div")
            .attr("class", "lineChartTitle")
            .html(tempChartTitle);
  //Creating X-scale
    var x ;
    if( dataInput.xaxisFixedDataPoints === null ){
      x = d3.scale.ordinal();
      //x.rangeRoundBands([0, chartWidth],.3);
      if(chartXaxisFixedDataPoints.length <= 11 ){
          x.rangeRoundBands([0, chartWidth], barMargins[chartXaxisFixedDataPoints.length]);
      }
      else
      {
          x.rangeRoundBands([0, chartWidth], .1);
      }

    }
    else{
      x = d3.time.scale().range([0, chartWidth]);
    }


  //Creating  Y-scale
      var y = d3.scale.linear().rangeRound([chartHeight, 0]);

  //Creating X-axis
      var xAxis;
      if( dataInput.xaxisFixedDataPoints === null ){
          xAxis = d3.svg.axis()
                            .scale(x)
                            .orient("bottom")
                            .ticks(5);
      }
      else{
          xAxis = d3.svg.axis()
                    .scale(x)
                    .tickFormat(d3.time.format("%b,%d %Y %H:%M"))
                    .orient("bottom")
                    .ticks(5);
      }

  //Creating Y-axis
      var yAxis = d3.svg.axis()
            .scale(y)
            .orient("left")
            .ticks(5);

  //Creating line
    var line = d3.svg.line()
            .interpolate("cardinal")
            .x(function (d) { return x(d.X); })
            .y(function (d) { return y(d.value); });

  //Creating main svg element
      var svg = d3.select('#barChartContent_'+id).append("svg")
            .attr("class", "lineChart")
            .attr("width",  chartWidth  + chartMargin.left + chartMargin.right)
            .attr("height", chartHeight + chartMargin.top  + chartMargin.bottom)
            .append("g")
            .attr("transform", "translate(" + chartMargin.left + "," + chartMargin.top + ")");

  //Creating Point hover Tooltip div
      var div = d3.select("body").append("div")
         .attr("class", "tooltip")
         .style("opacity", 0);

  //Adding domain to X-scale and Y-scale
      x.domain(chartXaxisFixedDataPoints);
      y.domain([
            0,
            d3.max(chartSeriesData, function (c) {
              return d3.max(c.values, function (d) { return d.value; });
            })
          ]);

  //Adding X-Axis
      svg.append("g")
          .attr("class", "x axis")
          .attr("transform", "translate(0," + chartHeight + ")")
          .call(xAxis)
          .selectAll("text")
          .style("text-anchor", "end")
          .attr("transform", "rotate(-40)" )
          .style("font-size","10.5px")
          .style("font-weight","100");

  //Adding Y-Axis
      svg.append("g")
          .attr("class", "y axis")
          .call(yAxis)
          .style("font-size","10.5px")
          .style("font-weight","100");

  //Adding x-axis label
      svg.append("text")
          .attr("transform", "translate(0," + chartHeight + ")")
          .attr("x", chartWidth/2)
          .attr("y", 80)
          .attr("dy", ".71em")
          .style("text-anchor", "middle")
          .style("font-size","14px")
          .style("font-weight","500")
          .text(dataInput.xaxisLabel);

      svg.append("text")
          .attr("transform", "rotate(-90)")
          .attr("x", -chartHeight/2)
          .attr("y", -50)
          .attr("dy", ".71em")
          .style("text-anchor", "middle")
          .style("font-size","14px")
          .style("font-weight","500")
          .text(dataInput.yaxisLabel);

      //Creating Point hover Tooltip div
      var div = d3.select("body").append("div")
         .attr("class", "tooltip")
         .style("opacity", 0);

     var bars;
    if(dataInput.xaxisFixedDataPoints === null )
    {

    }
    else{

      bars = svg.selectAll(".value")
              .data(chartSeriesData[0].values, function(d) { return d.X; });
    }


      console.log(chartSeriesData);
    if( dataInput.xaxisFixedDataPoints === null ){

      chartSeriesData.forEach(function(data){
          svg.selectAll(".bar")
                      .data(data.values)
                      .enter().append("rect")
                        .attr("class", "bar")
                        .attr("x", function(d) { return x(d.X); })
                        .attr("y", function(d) { return y(d.value); })
                        .attr("width", x.rangeBand())
                        .attr("height", function(d) { return chartHeight - y(d.value); })
                        .on("mouseover", function (d) { showPopover.call(this, d); })
                        .on("mouseout",  function (d) { removePopovers.call(this); })
                        .style({fill: randomColor()})
                        .style("stroke","black");
      });

      }
    else{
        debugger;
        bars.enter()
          .append("g")
          .attr("class", "barRect")
          .append("rect")
          .attr("class", "barRect")
          .attr("width", chartWidth / chartSeriesData[0].values.length)
          .attr("x", function(d) { return x(d.X); })
          .attr("y", chartHeight)
          .attr("height", 0)
          .attr("y", function(d) { return y(d.value); })
          .attr("height", function(d) { return chartHeight - y(d.value);})
          .on("mouseover", function (d) { showPopover.call(this, d); })
          .on("mouseout",  function (d) { removePopovers.call(this); })
          .style({fill: randomColor()})
          .style("stroke","black");
    }



     function removePopovers () {
            $(this).css("stroke","black");
            div.transition()
                  .duration(800)
                  .style("opacity", 0);
          }
          function showPopover (d ) {
            $(this).css("stroke","white")
                   .css("stroke-width","1px");
            div.transition()
                  .duration(1000)
                  .style("opacity", .8);
            if( dataInput.xaxisFixedDataPoints === null ){
               div .html("<div class=\"title\">"+d.name+"</div><div class=\"content\">"+ d3.format(",")(d.value)+"<br/>on<br/>"+d.X +"</div>")
                              .style("left", (d3.event.pageX + 10) + "px")
                              .style("top", (d3.event.pageY - 40) + "px");
            }
            else{
              div .html("<div class=\"title\">"+d.name+"</div><div class=\"content\">"+ d3.format(",")(d.value)+"<br/>on<br/>"+formatTime(d.X) +"</div>")
                  .style("left", (d3.event.pageX + 10) + "px")
                  .style("top", (d3.event.pageY - 40) + "px");
               }
             }



}


/* Function to draw stacked bar chart */
//Adding Line Chart title
  

function drawStackedBarChart(id,dataInput,previousChoice,chartTitle){


  var chartSeriesData = [];
  var chartSeriesName = [];
  var chartSeriesLabel = [];
  var chartSeriesUniqueXpoints = [];
  var barMargins = [.9,.8,.8,.7,.6,.6,.5,.4,.3,.3,.2,.2];

  var parseDateNew = d3.time.format("%m/%e/%y %H:%M").parse;
  var formatTime = d3.time.format("%b,%d %Y %H:%M:%S");

  var inputDataNonZeroOnly = [];
         	//Removing zero x-axis data points
          dataInput.data.forEach(function(data){
              var tempseries = {};
              tempseries["seriesName"] = data.seriesName;
              var tempseriesData = [];
              data.seriesData.forEach(function(d){
                  if(d.y != 0){
                      var tempseriesDataobj = {};
                      tempseriesDataobj["x"] = d.x;
                      tempseriesDataobj["y"] = d.y;
                      tempseriesData.push(tempseriesDataobj);
                  }
              });
              tempseries["seriesData"] = tempseriesData;
              tempseries["seriesColor"] = data.seriesColor;
              inputDataNonZeroOnly.push(tempseries);
          });
         	console.log(JSON.stringify(inputDataNonZeroOnly));

  dataInput.data.forEach(function(d){
    chartSeriesName.push(d.seriesName);
  });
  if(dataInput.xaxisFixedDataPoints === null)
  {
    inputDataNonZeroOnly.forEach(function(data){
        data.seriesData.forEach(function(d){
            if (chartSeriesLabel.indexOf(d.x) <= -1) {
                chartSeriesLabel.push(d.x);
            }
        });
    });
  }
  else
  {
    dataInput.xaxisFixedDataPoints.forEach(function(xaxispoint) {
        chartSeriesLabel.push(parseDateNew(xaxispoint));
      });
    dataInput.data.forEach(function(data){
            data.seriesData.forEach(function(d){
                if (chartSeriesUniqueXpoints.indexOf(d.x) <= -1) {
                    chartSeriesUniqueXpoints.push(d.x);
                }
            });
        });
  }

  //console.log(chartSeriesUniqueXpoints);

  if(dataInput.xaxisFixedDataPoints === null)
  {
    chartSeriesData = chartSeriesLabel.map(function(labelName){
        var y0 = 0;
        return {
          values: inputDataNonZeroOnly.map(function(data){
            var dataYvalue = 0;
            data.seriesData.forEach(function(d){
              if(d.x === labelName ){
                dataYvalue = +d.y;
              }
            });
            return {
              name: data.seriesName,
              label: labelName,
              y0: y0,
              y1: y0 += dataYvalue
            };
          }),
          total: y0
        };
      });
  }
  else{
    //Fetching and restructuring line series Data
      chartSeriesData = chartSeriesUniqueXpoints.map(function(labelName){
              var y0 = 0;
              return {
                values: dataInput.data.map(function(data){
                  var dataYvalue = 0;
                  data.seriesData.forEach(function(d){
                    if(d.x === labelName ){
                      dataYvalue = +d.y;
                    }
                  });
                  return {
                    name: data.seriesName,
                    label: parseDateNew(labelName),
                    y0: y0,
                    y1: y0 += dataYvalue
                  };
                }),
                total: y0
              };
            });
  }

  //console.log(JSON.stringify(chartSeriesData));



 //Adding Costomize Icon for converting charts.


var customChartImg = document.createElement("img");
        customChartImg.setAttribute("class", "customChartImg")
        customChartImg.setAttribute("src", "costomChart.png")
        customChartImg.setAttribute("title","Customize Charts")
        customChartImg.setAttribute("width","30px");
        customChartImg.setAttribute("align","left")
        customChartImg.addEventListener('click', eventHandler(dataInput.reportIdentifier,id,dataInput.title,previousChoice));

        document.getElementById("barChartContent_"+id).appendChild(customChartImg);


  d3.select('#barChartContent_'+id).append("br");
    d3.select('#barChartContent_'+id).append("br");

  //Adding Line Chart title
  var tempChartTitle = "";
  if(typeof chartTitle != "undefined" && chartTitle.length>0)
  {
	tempChartTitle = chartTitle;

   }else if(typeof chartTitle == "undefined")
   {
	tempChartTitle = dataInput.title;
   }

	 d3.select('#barChartContent_'+id).append("div")
            .attr("class", "lineChartTitle")
            .html(tempChartTitle);

  var windowWidth = $(window).width();
  var blockFinalWidth = (windowWidth - 60-60-28-150)/2;
  var margin = {top: 40, right: 55, bottom: 100, left: 70},
      width  = blockFinalWidth - margin.left - margin.right,
      height = 450  - margin.top  - margin.bottom;

  var x;

  if(dataInput.xaxisFixedDataPoints === null)
  {
    x = d3.scale.ordinal();
    if(chartSeriesLabel.length <= 11 ){
          x.rangeRoundBands([0, width], barMargins[chartSeriesLabel.length]);
      }
      else
      {
          x.rangeRoundBands([0, width], .1);
      }
  }
  else
  {
    x = d3.time.scale();
    if(chartSeriesLabel.length <= 11 ){
       x.range([0, width],barMargins[chartSeriesLabel.length]);
    }
    else
    {
       x.range([0, width],.1);
    }
  }

  var y = d3.scale.linear()
      .rangeRound([height, 0]);

  var xAxis;

  if(dataInput.xaxisFixedDataPoints === null)
  {
    xAxis = d3.svg.axis()
          .scale(x)
          .orient("bottom")
          .ticks(5);
  }
  else
  {
    xAxis = d3.svg.axis()
              .scale(x)
              .tickFormat(d3.time.format("%b,%d %Y %H:%M"))
              .orient("bottom")
              .ticks(5);
  }

  var yAxis = d3.svg.axis()
      .scale(y)
      .orient("left")
      .ticks(5);

  var color = d3.scale.ordinal()
      .range(["#95CEFF", "#90ed7d", "#f7a35c", "#8085e9", "#f15c80", "#808000", "#00FF00", "#FFD700", "#00FFFF",
              "#7FFFD4", "#483D8B", "#800080", "#DDA0DD", "#FF00FF", "#FF1493", "#FFFACD", "#BC8F8F", "#F0FFF0", "#C0C0C0",
              "#546e91", "#8bde95", "#d2ab58", "#273c71", "#98bf6e", "#4daa4b", "#98abc5", "#cc1010", "#31383b", "#006391",
              "#c2643f", "#b0a474", "#a5a39c", "#a9c2bc", "#22af8c", "#7fcecf", "#987ac6", "#3d3b87", "#b77b1c", "#c9c2b6",
              "#807ece", "#8db27c", "#be66a2", "#9ed3c6", "#00644b", "#005064", "#77979f", "#77e079", "#9c73ab", "#1f79a7"
            ]);



  var div = d3.select("body").append("div")
       .attr("class", "tooltip")
       .style("opacity", 0);

  var svg = d3.select('#barChartContent_'+id).append("svg")
      .attr("width",  width  + margin.left + margin.right)
      .attr("height", height + margin.top  + margin.bottom)
      .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  color.domain(chartSeriesName);

  x.domain(chartSeriesLabel);

  y.domain([0, d3.max(chartSeriesData, function (d) { return d.total; })]);

  svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis)
        .selectAll("text")
        .style("text-anchor", "end")
        .attr("transform", "rotate(-40)" )
        .style("font-size","11px")
        .style("font-weight","100");

  svg.append("g")
        .attr("class", "y axis")
        .call(yAxis)
        .style("font-size","11px")
        .style("font-weight","100");

  svg.append("text")
        .attr("transform", "translate(0," + height + ")")
        .attr("x", width/2)
        .attr("y", 70)
        .attr("dy", ".71em")
        .style("text-anchor", "middle")
        .style("font-size","14px")
        .style("font-weight","500")
        .text(dataInput.xaxisLabel);

if(dataInput.yaxisLabel.length <= 47){
    svg.append("text")
        .attr("transform", "rotate(-90)")
        .attr("x", -height/2)
        .attr("y", -50)
        .attr("dy", ".71em")
        .style("text-anchor", "middle")
        .style("font-size","14px")
        .style("font-weight","500")
        .text(dataInput.yaxisLabel);
}
else{
	 svg.append("text")
        .attr("transform", "rotate(-90)")
        .attr("x", -height/2)
        .attr("y", -50)
        .attr("dy", ".71em")
	.attr("textLength","300")
        .attr("lengthAdjust","spacingAndGlyphs")
        .style("text-anchor", "middle")
        .style("font-size","14px")
        .style("font-weight","500")
        .text(dataInput.yaxisLabel);
}

    var selection = svg.selectAll(".series")
        .data(chartSeriesData)
        .enter().append("g")
        .attr("class", "series")
        .attr("transform", function (d) { return "translate(" + x(d.values[0].label) + ",0)"; });


    if(dataInput.xaxisFixedDataPoints === null){
    selection.selectAll("rect")
        .data(function (d) { return d.values; })
        .enter()
        .append("rect")
        .attr("class", function (d) { return "stackedbarRect " + "P" +d.name.replace(/[^a-z\d]+/gi, "") + id; })
        .style("fill", function (d) { return color(d.name); })
        .style("stroke", "grey")
        .attr("width", x.rangeBand())
        .attr("y", function (d) { return y(d.y1); })
        .attr("height", function (d) { return y(d.y0) - y(d.y1); })
        .on("mouseover", function (d) { showPopover.call(this, d); })
        .on("mouseout",  function (d) { removePopovers.call(this); });
        }
     else{
       selection.selectAll("rect")
               .data(function (d) { return d.values; })
               .enter()
               .append("rect")
               .attr("class", function (d) { return "stackedbarRect " + "P" +d.name.replace(/[^a-z\d]+/gi, "") + id; })
               .style("fill", function (d) { return color(d.name); })
               .style("stroke", "grey")
               .attr("width", width / chartSeriesData.length)
               .attr("y", function (d) { return y(d.y1); })
               .attr("height", function (d) { return y(d.y0) - y(d.y1); })
               .on("mouseover", function (d) { showPopover.call(this, d); })
               .on("mouseout",  function (d) { removePopovers.call(this); });
       }


    var legend = svg.selectAll(".legend")
        .data(chartSeriesName.slice())
        .enter().append("g")
        .attr("class", "legend")
        .attr("transform", function (d, i) { return "translate(55," + i * 20 + ")"; });

    legend.append("rect")
        .attr("class" , function (d) { return "L"+d.replace(/[^a-z\d]+/gi, "")+id; })
        .attr("x", width - 11)
        .attr("width", 10)
        .attr("height", 10)
        .style("fill", color)
        .style("stroke", color)
        .style('cursor','pointer')
        .on("mouseover", function (d) { legandover.call(this, d); })
        .on("mouseout",  function (d) { legandoverout.call(this,d); });


    legend.append("text")
        .attr("x", width - 15)
        .attr("y", 5)
        .attr("dy", ".35em")
        .style("text-anchor", "end")
        .style('cursor','pointer')
        .style("font-size","11px")
        .text(function (d) { return d; })
        .on("mouseover", function (d) { legandover.call(this, d); })
        .on("mouseout",  function (d) { legandoverout.call(this,d); });

   function removePopovers () {
      $(this).css("stroke", "grey")
             .css("stroke-width", "1px");
      div.transition()
         .duration(800)
         .style("opacity", 0);
    }
    function showPopover (d ) {
      $(this).css("stroke", "grey")
             .css("stroke-width", "2px");

      div.transition()
         .duration(1000)
         .style("opacity", .8);

      if(dataInput.xaxisFixedDataPoints === null){
      div .html("<div class=\"title\">"+d.name+"</div><div class=\"content\">"+dataInput.xaxisLabel+": "+ d.label+"<br/>"+(d.y1 - d.y0) +"</div>")
          .style("left", (d3.event.pageX + 15) + "px")
          .style("top", (d3.event.pageY - 40) + "px");
       }
       else{
             div .html("<div class=\"title\">"+d.name+"</div><div class=\"content\">"+dataInput.xaxisLabel+": "+ formatTime(d.label)+"<br/>"+(d.y1 - d.y0) +"</div>")
                      .style("left", (d3.event.pageX + 15) + "px")
                      .style("top", (d3.event.pageY - 40) + "px");
       }
    }

    function legandover (d) {
      var barRect = ".P"+d.replace(/[^a-z\d]+/gi, "")+id;
      $(barRect).css("stroke", "grey")
                .css("stroke-width", "2px");
    }

    function legandoverout (d) {
      var barRect = ".P"+d.replace(/[^a-z\d]+/gi, "")+id;
      $(barRect).css("stroke", "grey")
                .css("stroke-width", "1px");
    }
}




/* it will make subreport collapsible and expandable*/
function reportDivExpandAndCollapse(subreportid,imgID)
{

	if($(document.getElementById(subreportid)).css('display') == 'none')
	{
		$(document.getElementById(subreportid)).slideDown();
		$(document.getElementById(imgID)).attr("src","hide.ico");
		var downArray = $(document.getElementById(subreportid)).prev();
		$(downArray).css("display","block");
		var reportHeading = $(downArray).prev();
        $(reportHeading).css("margin-bottom","0px");
        removeEmptyHeader();
	}
	else
	{
		$(document.getElementById(subreportid)).slideUp();
		$(document.getElementById(imgID)).attr("src","Show.ico");
		var downArray = $(document.getElementById(subreportid)).prev();
        $(downArray).css("display","none");
        var reportHeading = $(downArray).prev();
        $(reportHeading).css("margin-bottom","10px");
	}
}


function eventHandler(reportID,chartID,chartTitle,previousChoice){
	return function(e) {
    		customizeChartPopup(reportID,chartID,chartTitle,previousChoice,e);
         };
}


csrf=localStorage.getItem("csrf token")
console.log("csrf ",csrf);
/*it will draw dynamic charts*/
var colors = [];
function drawPie(id,data,previousChoice,chartTitle)
{
	var divId="overlayDivId"+id;
	var loaderDivId="loaderDivId"+id;
	var div='<div id='+divId+' style="width: 100%;height: 100%;background:#000000;position: absolute;top: 0;right: 1rem;opacity: 0.4;pointer-events:none;z-index: 1000;"></div>';
	var loaderDiv='<div id='+loaderDivId+' style="font-size: 4rem;color: #fefefe;position: relative;top:200;left:200;z-index: 1001;">Loading ...</div>'
	$("#chartContent_"+id).parent().append(div);
	$("#chartContent_"+id).parent().append(loaderDiv);
	setTimeout(function(){
	var windowWidth = $(window).width();
    var blockFinalWidth = (windowWidth - 60-60-28-150)/2;
	if(typeof chartTitle == "undefined")
	{
		chartTitle = data["title"];
	}
console.log(data);
	var objdata = {
	"header": {
		"title": {
			"text": chartTitle,
			"fontSize": 18,
			"font": "verdana",
			"color": "black"
		},
		"subtitle": {
			"text": " ",
			"color": "#999999",
			"fontSize": 10,
			"font": "verdana"
		},
		"titleSubtitlePadding": 40
	},
	"footer": {
		"text": "",
		"color": "#999999",
		"fontSize": 11,
		"font": "open sans",
		"location": "bottom-center"
	},
	"size": {
		"canvasHeight": 350,
		"canvasWidth": blockFinalWidth,
		"pieOuterRadius": "100%"
	},
	"data": {


	},
	"labels": {
		"outer": {
			"pieDistance": 20
		},
		"inner": {
			"format": "value"
		},
		"mainLabel": {
			"font": "verdana"
		},
		"percentage": {

			"font": "verdana",
			"decimalPlaces": 0
		},
		"value": {

			"font": "verdana"
		},
		"lines": {
			"enabled": true,
			"style": "straight"


		},
		"truncation": {
			"enabled": true,
			"truncateLength": 120
		}
	},
	"tooltips": {
		"enabled": true,
		"type": "placeholder",
		"string": "{label}: {value}, {percentage}%",
		"styles": {
			"backgroundColor": "rgba(249, 249, 249, .85)",
			"color": "black"
		}
	},
	"effects": {

	"pullOutSegmentOnClick": {
			"effect": "bounce",
			"speed": 200,
			"size": 15
		},
		"highlightSegmentOnMouseover": true,
		"highlightLuminosity": -0.2

	}
}

    //Adding Costomize Icon for converting charts.
        var customChartImg = document.createElement("img");
        customChartImg.setAttribute("class", "customChartImg")
        customChartImg.setAttribute("src", "costomChart.png")
        customChartImg.setAttribute("title","Customize Charts")
        customChartImg.setAttribute("width","30px");
        customChartImg.setAttribute("align","left")
	customChartImg.addEventListener('click', eventHandler(data.reportIdentifier,id,data.title,previousChoice));

        document.getElementById("chartContent_"+id).appendChild(customChartImg);

	var element = document.createElement("div");
	element.setAttribute("id", "charts_"+id);
	element.setAttribute("class", "chartscss");
	document.getElementById("chartContent_"+id).appendChild(element);
	var datas = [];
	var tempdata = data["data"];
	var datavalue = false;

	function compare(a,b) {
  if (a.value > b.value)
    return -1;
  if (a.value < b.value)
    return 1;
  return 0;
}
debugger;
var tempdata = tempdata.sort(compare);
var otherdata = [];
var dataCount = 0;
	for(var z=0;z<tempdata.length;z++)
	{
	    if(tempdata[z]["value"] != 0){
		if(dataCount<=15)
		{
			datas.push({"label":tempdata[z]["label"],"value":tempdata[z]["value"]})
			dataCount++;
		}
		else if(dataCount > 15)
		{

			if(datavalue == false)
			{
				datas.push({"label":"Others","value":tempdata[z]["value"]});
				otherdata.push({"label":tempdata[z]["label"],"value":tempdata[z]["value"]});
				datavalue = true;
			}else
			{
				datas[16].value = datas[16].value+tempdata[z]["value"];
				otherdata.push({"label":tempdata[z]["label"],"value":tempdata[z]["value"]});
			}
			dataCount++;
		}
		}
	}

    if(datas.length > 0){

	objdata["data"] ={"content": datas};

	var pie = new d3pie("charts_"+id,objdata);



	colors =  [
				"#95CEFF", "#434348", "#90ed7d", "#f7a35c", "#8085e9", "#f15c80", "#808000", "#00FF00", "#FFD700", "#00FFFF",
				"#7FFFD4", "#483D8B", "#800080", "#DDA0DD", "#FF00FF", "#FF1493", "#FFFACD", "#BC8F8F", "#F0FFF0", "#C0C0C0",
				"#546e91", "#8bde95", "#d2ab58", "#273c71", "#98bf6e", "#4daa4b", "#98abc5", "#cc1010", "#31383b", "#006391",
				"#c2643f", "#b0a474", "#a5a39c", "#a9c2bc", "#22af8c", "#7fcecf", "#987ac6", "#3d3b87", "#b77b1c", "#c9c2b6",
				"#807ece", "#8db27c", "#be66a2", "#9ed3c6", "#00644b", "#005064", "#77979f", "#77e079", "#9c73ab", "#1f79a7"
			]



	pie.svg[0][0].style.height=objdata["size"]["canvasHeight"]+100;
	var legval = 0;
	var legend = pie.svg.append("svg")
    .attr("class", "legend")
    .selectAll("g")
    .data(datas)
    .enter().append("g")
	.attr("class",'d3legend')
    .attr("transform", function(d, i) {
	legval = legval + 20;
	value = 300 + legval;
	pie.svg[0][0].style.height=parseInt(pie.svg[0][0].style.height,10)+15;
	return "translate(10,"+value+")"; });


	legend.append("text")
    .attr("x", 24)
    .attr("y", 9)
    .attr("dy", ".35em")
    .text(function(d) { return d.label; });

	legend.append("rect")
    .attr("width", 18)
    .attr("height", 18)
    .style("fill", function(d, i) { return colors[i]; });



	if(datas.length > 15)
	{
		var table = d3.select("#charts_"+id).append("table")
					.attr("style",'position:absolute;right:5%;top:70%;width:50%')

		var	tbody = table.append('tbody');
		var thead = table.append('thead');


		var columns = ['Label','Value'];
		var othercolumns = ['Others'];
		var tempcolumns = ['label','value']

		thead.append('tr')
			.selectAll('th')
			.data(othercolumns).enter()
			.append('th')
			.attr('colspan','2')
			.attr("style",'text-align:center;background: rgb(50, 131, 197); color: white; font-size: 18px;padding:5px')
			.text(function(d) { return d });

		thead.append('tr')
			.selectAll('th')
			.data(columns).enter()
			.append('th')
			.attr('style','border-radius: 0px;padding:5px')
			.text(function(d) { return d });

			// create a row for each object in the data
		var rows = tbody.selectAll('tr')
		  .data(otherdata)
		  .enter()
		  .append('tr');

		// create a cell in each row for each column
		var cells = rows.selectAll('td')
		  .data(function (row) {
		    return tempcolumns.map(function (column) {
		      return {column: column, value: row[column]};
		    });
		  })
		  .enter()
		  .append('td')
		    .text(function (d) { return d.value; });

	}

	}

	else{
	    var title = document.createElement("div");
	        title.setAttribute("class","noDataChartTitle");
	        title.innerHTML = data["title"];

	    var msg = document.createElement("div");
            msg.setAttribute("class","noDataChartMsg");
            msg.innerHTML = "No non-zero data available.";

	    element.appendChild(title);
        element.appendChild(msg);



	}



$("#overlayDivId"+id).remove();
$("#loaderDivId"+id).remove();

},5000);
	}



/*it will draw line */
function drawLine(id,dataInput,chartTitle)
{
	
setTimeout(function(){
   var color = d3.scale.ordinal()
               .range(["#95CEFF", "#90ed7d", "#f7a35c", "#8085e9", "#f15c80", "#808000", "#00FF00", "#FFD700", "#00FFFF",
               		"#7FFFD4", "#483D8B", "#800080", "#DDA0DD", "#FF00FF", "#FF1493", "#FFFACD", "#BC8F8F", "#F0FFF0", "#C0C0C0",
       				"#546e91", "#8bde95", "#d2ab58", "#273c71", "#98bf6e", "#4daa4b", "#98abc5", "#cc1010", "#31383b", "#006391",
       				"#c2643f", "#b0a474", "#a5a39c", "#a9c2bc", "#22af8c", "#7fcecf", "#987ac6", "#3d3b87", "#b77b1c", "#c9c2b6",
       				"#807ece", "#8db27c", "#be66a2", "#9ed3c6", "#00644b", "#005064", "#77979f", "#77e079", "#9c73ab", "#1f79a7"]);

       	var parseDateNew = d3.time.format("%m/%e/%y %H:%M").parse;
       	var formatTime = d3.time.format("%b,%d %Y %H:%M:%S");

       //Declaring All neccessary variable
           var windowWidth = $(window).width();
           var blockFinalWidth = (windowWidth - 60-60-28-150)/2;

       	var chartMargin = {top: 20, right: 55, bottom: 100, left: 70};
       	var chartWidth = blockFinalWidth - chartMargin.left - chartMargin.right;
       	var chartHeight = 450  - chartMargin.top  - chartMargin.bottom;
       	var chartSeriesData = [];
       	var chartSeriesName = [];
       	var chartXaxisFixedDataPoints = [];

        var inputDataNonZeroOnly = [];
       	//Removing zero x-axis data points
        dataInput.data.forEach(function(data){
            var tempseries = {};
            tempseries["seriesName"] = data.seriesName;
            var tempseriesData = [];
            data.seriesData.forEach(function(d){
                if(d.y != 0){
                    var tempseriesDataobj = {};
                    tempseriesDataobj["x"] = d.x;
                    tempseriesDataobj["y"] = d.y;
                    tempseriesData.push(tempseriesDataobj);
                }
            });
            tempseries["seriesData"] = tempseriesData;
            tempseries["seriesColor"] = data.seriesColor;
            inputDataNonZeroOnly.push(tempseries);
        });
       	console.log(JSON.stringify(inputDataNonZeroOnly));


       //Fetching and converting XaxisFixedDataPoints from string to date
       if(dataInput.xaxisFixedDataPoints === null)
       {
           inputDataNonZeroOnly.forEach(function(data){
               data.seriesData.forEach(function(d){
                   if(chartXaxisFixedDataPoints.indexOf(d.x) <= -1)
                       chartXaxisFixedDataPoints.push(d.x);
               });
           });
       }
       else{
       	dataInput.xaxisFixedDataPoints.forEach(function(xaxispoint) {
       		chartXaxisFixedDataPoints.push(parseDateNew(xaxispoint));
       	});
       }



       //Fetching line series Name
       	dataInput.data.forEach(function(d){
       		chartSeriesName.push(d.seriesName);
       	});



       //Fetching and restructuring line series Data
       if(dataInput.xaxisFixedDataPoints === null){
           chartSeriesData = inputDataNonZeroOnly.map(function(data){
               		return {
               			name: data.seriesName,
               			values: data.seriesData.map(function(d){
               		            return {name: data.seriesName, X: d.x, value: +d.y };
               			})
               		};
               	});
       }else{
       	chartSeriesData = dataInput.data.map(function(data){
       		return {
       			name: data.seriesName,
       			values: data.seriesData.map(function(d){
       				return {name: data.seriesName, X: parseDateNew(d.x), value: +d.y };
       			})
       		};
       	});
       	}

       	//console.log(JSON.stringify(chartSeriesData));

       //Setting color Domain
       	color.domain(chartSeriesName);


       

       

         d3.select('#lineChartContent_'+id).append("br");
           d3.select('#lineChartContent_'+id).append("br");

       //Adding Line Chart title
	    var tempChartTitle = "";
  if(typeof chartTitle != "undefined" && chartTitle.length>0)
  {
	tempChartTitle = chartTitle;

   }else if(typeof chartTitle == "undefined")
   {
	tempChartTitle = dataInput.title;
   }

	 d3.select('#lineChartContent_'+id).append("div")
            .attr("class", "lineChartTitle")
            .html(tempChartTitle);
       //Creating X-scale
       var x;
          if(dataInput.xaxisFixedDataPoints === null){
               x = d3.scale.ordinal().rangeRoundBands([0, chartWidth],1);
          }
          else{
       	    x = d3.time.scale().range([0, chartWidth]);
       	}

       //Creating  Y-scale
           var y = d3.scale.linear().rangeRound([chartHeight, 0]);

       //Creating X-axis
           var xAxis;
           if(dataInput.xaxisFixedDataPoints === null){
               xAxis = d3.svg.axis()
                                 .scale(x)
                                 .orient("bottom")
                                 .ticks(5);
            }
            else{
               xAxis = d3.svg.axis()
                                  .scale(x)
                        		  .tickFormat(d3.time.format("%b,%d %Y %H:%M"))
                                  .orient("bottom")
                                  .ticks(5);
            }


       //Creating Y-axis
           var yAxis = d3.svg.axis()
                 .scale(y)
                 .orient("left")
                 .ticks(5);

        var line;

       //Creating line
       if(dataInput.xaxisFixedDataPoints === null){
           line = d3.svg.line()
                         .interpolate("cardinal")
                         .x(function (d) { return x(d.X); })
                         .y(function (d) { return y(d.value); });
       }
       else{
           line = d3.svg.line()
                         .interpolate("cardinal")
                         .x(function (d) { return x(d.X); })
                         .y(function (d) { return y(d.value); });
       }


       //Creating main svg element
           var svg = d3.select('#lineChartContent_'+id).append("svg")
             	  .attr("class", "lineChart")
                 .attr("width",  chartWidth  + chartMargin.left + chartMargin.right)
                 .attr("height", chartHeight + chartMargin.top  + chartMargin.bottom)
                 .append("g")
                 .attr("transform", "translate(" + chartMargin.left + "," + chartMargin.top + ")");

       //Creating Point hover Tooltip div
           var div = d3.select("body").append("div")
              .attr("class", "tooltip")
              .style("opacity", 0);
         console.log(chartXaxisFixedDataPoints);
       //Adding domain to X-scale and Y-scale
           x.domain(chartXaxisFixedDataPoints);
          	y.domain([
                 d3.min(chartSeriesData, function (c) {
                   return d3.min(c.values, function (d) { return d.value; });
                 }),
                 d3.max(chartSeriesData, function (c) {
                   return d3.max(c.values, function (d) { return d.value; });
                 })
               ]);

       //Adding X-Axis
           svg.append("g")
               .attr("class", "x axis")
               .attr("transform", "translate(0," + chartHeight + ")")
               .call(xAxis)
               .selectAll("text")
               .style("text-anchor", "end")
               .attr("transform", "rotate(-40)" )
               .style("font-size","10.5px")
               .style("font-weight","100");

       //Adding Y-Axis
           svg.append("g")
               .attr("class", "y axis")
               .call(yAxis)
               .style("font-size","10.5px")
               .style("font-weight","100");

       //Adding x-axis label
           svg.append("text")
               .attr("transform", "translate(0," + chartHeight + ")")
               .attr("x", chartWidth/2)
               .attr("y", 80)
               .attr("dy", ".71em")
               .style("text-anchor", "middle")
               .style("font-size","14px")
               .style("font-weight","500")
               .text(dataInput.xaxisLabel);

if(dataInput.yaxisLabel.length <= 47){
	svg.append("text")
               .attr("transform", "rotate(-90)")
               .attr("x", -chartHeight/2)
               .attr("y", -70)
               .attr("dy", ".71em")
               .style("text-anchor", "middle")
               .style("font-size","14px")
               .style("font-weight","500")
               .text(dataInput.yaxisLabel);
}
else{
           svg.append("text")
               .attr("transform", "rotate(-90)")
               .attr("x", -chartHeight/2)
               .attr("y", -70)
               .attr("dy", ".71em")
	       .attr("class","yAxisLabel")
	       .attr("textLength","300")
	       .attr("lengthAdjust","spacingAndGlyphs")
               .style("text-anchor", "middle")
               .style("font-size","14px")
               .style("font-weight","500")
               .text(dataInput.yaxisLabel);
}
       //Adding Line
           var series = svg.selectAll(".series")
               .data(chartSeriesData)
               .enter().append("g")
               .attr("class", "series");

           series.append("path")
               .attr("class", "line")
               .attr("id",function (d) { return d.name.replace(/[^a-z\d]+/gi, "") + id ; })
               .attr("d", function (d) { return line(d.values); })
               .style("stroke", function (d) { return color(d.name); })
               .style("stroke-width", "1px")
               .style("fill", "none");

       //Creating circle for point
           series.selectAll(".point")
               .data(function (d) { return d.values; })
               .enter().append("circle")
               .attr("class", function (d) { return "point " + "P" +d.name.replace(/[^a-z\d]+/gi, "") + id; })
               .attr("cx", function (d) { return x(d.X); })
               .attr("cy", function (d) { return y(d.value); })
               .attr("r", "2px")
               .style("stroke", function (d) { return color(d.name); })
               .style("stroke-width", "1px")
               .style("fill-opacity","0.5")
               .style("fill", function (d) { return color(d.name); })
               .on("mouseover", function (d) { hoverPointEnimationShow.call(this,d);    showPopover.call(this, d );  })
               .on("mouseout",  function (d) { removePopovers(); hoverPointEnimationRemove.call(this,d); })

       // Legend code started
           var legend = svg.selectAll(".legend")
               .data(chartSeriesName.slice())
               .enter().append("g")
               .attr("class", "legend")
               .attr("transform", function (d, i) { return "translate(55," + i * 20 + ")"; });

           legend.append("rect")
               .attr("class" , function (d) { return "L"+d.replace(/[^a-z\d]+/gi, "")+id; })
               .attr("x", chartWidth - 11)
               .attr("width", 10)
               .attr("height", 10)
               .style("fill", color)
               .style("stroke", color)
               .style('cursor','pointer')
               .on("mouseover", function (d) { lineHighlightTrue.call(this, d); })
               .on("mouseout",  function (d) { lineHighlightFalse.call(this, d); })
               .on("click",  function (d) { legandMouseClick.call(this, d , color(d)); })

           legend.append("text")
               .attr("x", chartWidth - 15)
               .attr("y", 5)
               .attr("dy", ".35em")
               .style("text-anchor", "end")
               .style('cursor','pointer')
               .text(function (d) { return d; })
               .on("mouseover", function (d) { lineHighlightTrue.call(this, d); })
               .on("mouseout",  function (d) { lineHighlightFalse.call(this, d); })
               .on("click",  function (d) { legandMouseClick.call(this, d , color(d)); })

       // Legend code Ends


           function removePopovers () {
                 div.transition()
                       .duration(800)
                       .style("opacity", 0);
               }
           function showPopover (d ) {
                 div.transition()
                       .duration(1000)
                       .style("opacity", .8);
                 if(dataInput.xaxisFixedDataPoints === null)
                 {
                   div.html("<div class=\"title\">"+d.name+"</div><div class=\"content\">"+ d3.format(",")(d.value)+"<br/>on<br/>"+d.X +"</div>")
                                       .style("left", (d3.event.pageX + 20) + "px")
                                       .style("top", (d3.event.pageY - 40) + "px");
                 }
                 else
                 {
                   div.html("<div class=\"title\">"+d.name+"</div><div class=\"content\">"+ d3.format(",")(d.value)+"<br/>on<br/>"+formatTime(d.X) +"</div>")
                                       .style("left", (d3.event.pageX + 20) + "px")
                                       .style("top", (d3.event.pageY - 40) + "px");
                 }

                  }



           function hoverPointEnimationShow(d){

                 $(this).attr("r", "5px");
                 $(this).css("stroke-width","15px");
                 $(this).css("stroke-opacity","0.3");
                 $(this).css("fill-opacity","0.9");
                 var lineID = "#"+d.name.replace(/[^a-z\d]+/gi, "")+id;
                 $(lineID).css("stroke-width","2px");
               }

           function hoverPointEnimationRemove(d){
                 $(this).css("stroke-width","1px");
                 $(this).attr("r", "2px");
                 $(this).css("stroke-opacity","1");
                 $(this).css("fill-opacity","0.5");
                 var lineID = "#"+d.name.replace(/[^a-z\d]+/gi, "")+id;
                 $(lineID).css("stroke-width","1px");

               }

           function lineHighlightTrue(d){

                 var lineID = "#"+d.replace(/[^a-z\d]+/gi, "")+id;
                 $(lineID).css("stroke-width","5px");
               }
           function lineHighlightFalse(d){
                 var lineID = "#"+d.replace(/[^a-z\d]+/gi, "")+id;
                 $(lineID).css("stroke-width","1px");
               }

           function legandMouseClick(d , color){
                 var lineID = "#"+d.replace(/[^a-z\d]+/gi, "")+id;
                 var legandID = ".L"+d.replace(/[^a-z\d]+/gi, "")+id;
                 var points = ".P"+d.replace(/[^a-z\d]+/gi, "")+id;
                 if( $(lineID).css('display') == 'none')
                 {
                  	  $(lineID).css("display","block");
                     $(legandID).css("fill",color);
                     $(points).css("display","block");
                 }
                 else
                 {
                     $(lineID).css("display","none");
                     $(legandID).css("fill","#F2F3F4");
                     $(points).css("display","none");
                 }
               }
			   $("#overlayDivId").remove();
			   $("#loaderDivId").remove();
       },5000);
	
}

function wrap(text, width) {
  text.each(function() {
    var text = d3.select(this),
        words = text.text().split(/\s+/).reverse(),
        word,
        line = [],
        lineNumber = 0,
        lineHeight = 1.1, // ems
        y = text.attr("y"),
        dy = parseFloat(text.attr("dy")),
        tspan = text.text(null).append("tspan").attr("x", 0).attr("y", y).attr("dy", dy + "em");
    while (word = words.pop()) {
      line.push(word);
      tspan.text(line.join(" "));
      if (tspan.node().getComputedTextLength() > width) {
        line.pop();
        tspan.text(line.join(" "));
        line = [word];
        tspan = text.append("tspan").attr("x", 0).attr("y", y).attr("dy", ++lineNumber * lineHeight + dy + "em").text(word);
      }
    }
  });
}


function cssImport(filename)
{
	var fileref = document.createElement("link")
	fileref.setAttribute("rel", "stylesheet")
	fileref.setAttribute("type", "text/css")
	fileref.setAttribute("href", filename)

	if (typeof fileref != "undefined")
	document.getElementsByTagName("head")[0].appendChild(fileref)

}

/*it will do responsive design*/
function responsiveDesign()
{



	setTimeout(function(){
	var dom1Array = document.getElementsByClassName("tableContent");
	var dom2 = document.getElementsByClassName("reportHeaderLine1");
	var dom3 = document.getElementsByClassName("reportHeaderLine2");
	var dom4 = document.getElementsByClassName("reportHeaderLine3");
	var dom5 = document.getElementsByClassName("reportHeaderLine4");
	var dom6 = document.getElementsByClassName("reportHeaderLine5");
	var dom7 = document.getElementsByClassName("reportElementDisplayName");
	var dom8 = document.getElementsByClassName("reportElementTitle");
	window.maxcolumwidth = 850;
	for(var j=0;j<dom1Array.length;j++)
	{
		dom1 = dom1Array[j];


		if(dom1.scrollWidth-100>=window.maxcolumwidth)
		{
			window.maxcolumwidth = dom1.scrollWidth-500;
			dom1 = document.getElementsByClassName("tableContent");
			for(var i=0;i<dom1.length;i++)
			{
				dom1[i].style.marginLeft="0px";
			}

			for(var i=0;i<dom2.length;i++)
			{
				dom2[i].style.marginLeft="0px";
			}
			for(var i=0;i<dom3.length;i++)
			{
				dom3[i].style.marginLeft="0px";
			}

			for(var i=0;i<dom4.length;i++)
			{
				dom4[i].style.marginLeft="0px";
			}

			for(var i=0;i<dom5.length;i++)
			{
				dom5[i].style.marginLeft="0px";
			}

			for(var i=0;i<dom6.length;i++)
			{
				dom6[i].style.marginLeft="0px";
			}

		}
	}

	/*demo purpose added */
	if( typeof localStorage.getItem("Template") != "undefined" && localStorage.getItem("Template") == 2)
	{



		var divchartcss = document.getElementsByClassName('chartscss');
		for( var i =0;i<divchartcss.length;i++)
		{

			divchartcss[i].style.marginLeft='-15%';

		}







	}
	else
	{


		var divchartcss = document.getElementsByClassName('chartscss');
		for( var i =0;i<divchartcss.length;i++)
		{
			divchartcss[i].style.marginLeft='-5%';

		}


	}

	 }, 10);


dynamicColumn();
noDataFound();
removeEmptyHeader();
setDefaultTab();

}

/* function to remove other header div if empty */
function removeEmptyHeader(){
  var allSubReportElement = document.getElementsByClassName("otherHeaderLine");
  var i;
  for(i = 0; i < allSubReportElement.length; i++)
  {
    if($(allSubReportElement[i]).children('div').length == 0)
    {
      $(allSubReportElement[i]).css("display","none");
      var parentdiv = allSubReportElement[i].parentNode;
      var prevDiv = $(parentdiv).prev();
      $(prevDiv).css("display","none");
    }

  }
}

/* function to create dynamic adjustable report */

function dynamicColumn(){
    var allReportElement = document.getElementsByClassName("reportBlock");
                    var i;
                    var windowWidth = $(window).width(),
                    windowHeight = $(window).height();
                    console.log(windowWidth+" and "+windowHeight);
                    var blockFinalWidth = windowWidth - 60-60-28-50;
                    for (i = 0; i < allReportElement.length; i++) {
                                    var allSubReportBlock=$(allReportElement[i]).children(".SimpleReportBlock");
                                    var k;
                                    for(k = 0; k < allSubReportBlock.length; k++)
                                    {
                    var allsimpleSubReport = $(allSubReportBlock[k]).children(".simpleSubReport");
                    var j;
                    for (j = 0; j < allsimpleSubReport.length; j++) {
                                                    var blockWidth = $(allsimpleSubReport[j]).outerWidth();
                                                    var blockHeight = $(allsimpleSubReport[j]).height();
                                                    //console.log(blockWidth+" and "+blockHeight);
                                    if(j==0 || j%2==0)
                                    {
                                                    allsimpleSubReport[j].style.marginLeft="60px";
                                                                    allsimpleSubReport[j].style.width=(blockFinalWidth/2)+"px";
                                                    if(j == (allsimpleSubReport.length)-1)
                                                                    {
                                                                                    allsimpleSubReport[j].style.marginLeft="60px";

                                                                                    allsimpleSubReport[j].style.width=(blockFinalWidth+28)+"px";
                                                                                    allsimpleSubReport[j].style.marginBottom="28px";
                                                    }
                                    }
                                    else{
                                                    allsimpleSubReport[j].style.marginLeft="28px";
                                                                    allsimpleSubReport[j].style.width=(blockFinalWidth/2)+"px";
                                    }
                                    if(j%2!=0 && j == (allsimpleSubReport.length)-1)
                                    {
                                                    allsimpleSubReport[j].style.marginBottom="28px";
                                    }

                                    if(j==0 || j==1)
                                                    allsimpleSubReport[j].style.marginTop="18px";
                                    else
                                                    allsimpleSubReport[j].style.marginTop="28px";

                    }
        }
                    }
}


/* function to check for data...if no data exist then print no data found */

function noDataFound(){
    var allSubReportElement = document.getElementsByClassName("SimpleReportBlock");
        var i;
        for(i = 0; i < allSubReportElement.length; i++)
        {
            if($(allSubReportElement[i]).children('div').length == 0)
            {

            	var newDivforEmptyReport = document.createElement('div');
            	newDivforEmptyReport.className = 'container noRecordFound';

            	newDivforEmptyReport.textContent = 'No Data Found.';

            	allSubReportElement[i].appendChild(newDivforEmptyReport);
            }
        }
}

function pagination(c, m) {
    var current = c,
        last = m,
        delta = 2,
        left = current - delta,
        right = current + delta + 1,
        range = [],
        rangeWithDots = [],
        l;

    for (var i = 1; i <= last; i++) {
        if (i == 1 || i == last || i >= left && i < right) {
            range.push(i);
        }
    }

for (var k = 0; k < range.length; k++) {
	i=range[k];
	if (l) {
            if (i - l === 2) {
                rangeWithDots.push(l + 1);
            } else if (i - l !== 1) {
                rangeWithDots.push('...');
            }
        }
        rangeWithDots.push(i);
        l = i;
}

    return rangeWithDots;
}

function getselectedli(id)
{


	var nums = document.getElementById(id);
	var listItem = nums.getElementsByTagName("li");
	var newNums = [];
	var selectedItem = 0;
	for (var i=0; i < listItem.length; i++) {
		if(listItem[i].childNodes[0].getAttribute("class") ==  "active")
		{
			selectedItem = listItem[i].childNodes[0].innerHTML;
			break;
		}


	}
	return selectedItem;
}




function drawPaginationDiv(selectedPage,id,position,count)
{

if(typeof count == "undefined")
{
	count =10;
}
var pagistring = pagination(selectedPage,count);
var paginationtag='<ul class="paginationUL" id=pagination_'+position+'>';
window.currentpage=1;
paginationtag+=	'<li><a class="disable" id=tablePagination_'+position+'_prev><img src="prev-disable.ico" class="paginationImg">Prev</a></li>';
var incrementdiv =0;

for(var i=0;i<pagistring.length;i++)
{


	if(pagistring[i]==selectedPage)
	{
		paginationtag+=	' <li><a class="active">'+pagistring[i]+'</a></li>';
	}else if(pagistring[i] == "...")
	{
		paginationtag+='<li><a class="tendtoLast">...</a></li>';
	}else
	{
		paginationtag+='<li><a>'+pagistring[i]+'</a></li>';
	}


}
paginationtag+=	'<li><a id=tablePagination_'+position+'_next>Next<img src="next-enable.ico" class="paginationImg"></a></li>';
paginationtag+='</ul>';
id.innerHTML=paginationtag;
if(selectedPage == count)
{
	document.getElementById("tablePagination_"+position+"_next").setAttribute("class","disable")
}else
{
	document.getElementById("tablePagination_"+position+"_next").setAttribute("class","")
}

if(selectedPage == 1)
{
	document.getElementById("tablePagination_"+position+"_prev").setAttribute("class","disable")
}else
{
	document.getElementById("tablePagination_"+position+"_prev").setAttribute("class","")
}
var ul = document.getElementById('pagination_'+position);  // Parent
ul.addEventListener('click', function(e) {
drawNextSetPage(e);
});
}


function drawNextSetPage(e)
{
	if(e.target.getAttribute("class")=="paginationImg"){
		return true;
	}
if(e.target.childNodes[0].nodeValue != "...")
{

	var PreviousSelected = parseInt(getselectedli(e.target.parentElement.parentElement.id));
	var position=e.target.parentElement.parentElement.id.split("_")[1]+"_"+e.target.parentElement.parentElement.id.split("_")[2];
	var node = document.getElementById("tableContent_"+position).children[0];
	var currentpage = 0;
	var prevbutton = ""
	if(typeof e.target.childNodes[1] !="undefined")
	{
		prevbutton = e.target.childNodes[1].nodeValue;
	}
	if(parseInt(e.target.childNodes[0].nodeValue) != PreviousSelected && e.target.childNodes[0].nodeValue != "Next" && prevbutton != "Prev")
	{
		currentpage = parseInt(e.target.childNodes[0].nodeValue);
		if(!isNaN(currentpage ))
		{
			drawPaginationDiv(parseInt(e.target.childNodes[0].nodeValue),node,position,parseInt(getCount("pagination_"+position)))
			callajax(currentpage,position);
		}
	}else if(prevbutton == "Prev" && PreviousSelected != 1)
	{
		currentpage = PreviousSelected-1;
		drawPaginationDiv(PreviousSelected-1,node,position,parseInt(getCount("pagination_"+position)))
		callajax(currentpage,position);

	}else if(e.target.childNodes[0].nodeValue == "Next" && PreviousSelected != getCount("pagination_"+position))
	{

		drawPaginationDiv(PreviousSelected+1,node,position,parseInt(getCount("pagination_"+position)))
		var nums = document.getElementById("pagination_"+position);
	var listItem = nums.getElementsByTagName("li");
		if(PreviousSelected+1 == listItem[listItem.length-2].childNodes[0].innerHTML)
		document.getElementById("tablePagination_"+position+"_next").setAttribute("class","disable")
		document.getElementById("tablePagination_"+position+"_prev").setAttribute("class","")
		currentpage = PreviousSelected+1;
		callajax(currentpage,position);

	}

}
}

function getCount(id)
{
	var nums = document.getElementById(id);
	var listItem = nums.getElementsByTagName("li");
	return listItem[listItem.length-2].childNodes[0].innerHTML;

}



/* it will draw table data dynamically*/
function drawTable(position,data)
{


	var d1 = document.getElementById("tableContent_"+position).children[2];
	var tablehtmlstring = "";
	var pixels = 0;

	var columnwidth=[];
	if(Object.keys(data).length > 0  && data["columnNames"].length >0)
	{


		$(".reportElementDisplayName").css("display","block")
		

		if(data["columnHeaderWidths"] != null )
		{
			columnwidth = data["columnHeaderWidths"];
		}

		if(data["columnHeaderWidths"] == null && data["columnWidths"] != null)
		{
			columnwidth = data["columnWidths"];
		}

		var columnNames = data["columnNames"];
		for(var i=0;i<columnNames.length;i++)
		{
			pixels = pixels+(typeof columnwidth[i] !="undefined" ? columnwidth[i] : 300);
			var tabwidth = (typeof columnwidth[i] !="undefined" ? columnwidth[i] : 300);
			tablehtmlstring += "<th width="+tabwidth+"px>" +columnNames[i]+"</th>";


		}
		tablehtmlstring = "<div class=\"wrap\" ><table class=\"head\" width="+pixels+"px><thead><tr>"+tablehtmlstring;
		tablehtmlstring +="</tr></thead>";


		var datas = data["rows"];
		tablehtmlstring+=drawtableBody(datas);
		tablehtmlstring+="</table></div>";
		d1.innerHTML += tablehtmlstring;
	}
		var count =data["totalCount"];
		console.log("count " +count);
		if(count>1)
		{
			drawPaginationDiv(1,document.getElementById("tableContent_"+position).children[0],position,count);
		}


}

function makeid()
{
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for( var i=0; i < 5; i++ )
        text += possible.charAt(Math.floor(Math.random() * possible.length));

    return text;
}

function callajax(pageno,position)
{
	var elmtTable = document.getElementById("tableContent_"+position).children[2].childNodes[1].childNodes[0];
	var tableRows = elmtTable.getElementsByTagName('tr');
	var rowCount = tableRows.length;

	var row = [];
	var datas = [];
	for (var x=rowCount-1; x>0; x--) {
		row = [];
		var tablerow = tableRows[x].cells
		for(var i=0;i<tablerow.length;i++)
		{

			if(tableRows[x].cells[i].innerHTML.indexOf(".") != -1)
			{
				row.push(tableRows[x].cells[i].innerHTML);
			}else if(!isNaN(tableRows[x].cells[i].innerHTML))
			{
				row.push(parseInt(tableRows[x].cells[i].innerHTML)+x);
			}else
			{
				row.push(tableRows[x].cells[i].innerHTML+makeid());
			}

		}

	datas.push(row);
	  elmtTable.deleteRow(x);
	}
	var currentTableHeader=$("#"+"tableContent_"+position).find(".reportElementDisplayName").text().trim();
	console.log("currentTableHeader " +currentTableHeader);
	var div='<div id="overlayDivId" style="width: 100%;height: 500px;background:#000000;position: absolute;top: 0;right: 1rem;opacity: 0.4;pointer-events:none;z-index: 1000;"></div>';
	var loaderDiv='<div id="loaderDivId" style="font-size: 4rem;color: #fefefe;position: relative;top: -35%;left: 44rem;z-index: 1001;">Loading ...</div>'
	$("#"+"tableContent_"+position).append(div);
	$("#"+"tableContent_"+position).append(loaderDiv);
	var sessionId = localStorage.getItem("sessionId");
	var logsessionId = localStorage.getItem("logsessionId");
	document.getElementById("tablePagination_"+position).style.display="none";
	var postParameters= {
				'reportTitle': currentTableHeader,
				'pageNumber': pageno,
				'command':'pagination',
				'sessionId':sessionId,
				"logSessionId":logsessionId
				}
				$.ajax({
				type:"POST",
				url: "/webacs/reportsAction.do",
				headers: {'Content-Type': 'application/x-www-form-urlencoded','csrf_token':csrf},
				data:postParameters,
				dataType: 'json',
				success: function(response){
				console.log(response);
				manageData(response);
				$("#overlayDivId").remove();
				$("#loaderDivId").remove();
				}
       });
	   function manageData(response){
			document.getElementById("tablePagination_"+position).style.display="block";
	   elmtTable.childNodes[1].innerHTML = drawtableBody(response["rows"],position);
	   }

}

function drawtableBody(datas,position)
{
var tableBodyHTML = "";

for(var i=0;i<datas.length;i++)
{
	var rows=datas[i];
	tableBodyHTML+="<tr>";
	for(var j=0;j<rows.length;j++)
	{
		tableBodyHTML+="<td>"+rows[j]+"</td>";
	}

	tableBodyHTML+="</tr>";
	if(i==9)
	break;

}

return 	tableBodyHTML;

}

