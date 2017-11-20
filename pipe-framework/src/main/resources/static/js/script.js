window.onresize = onResizeTask;

function onResizeTask(){
    var tables = document.getElementsByTagName("table");
    for(var i=0;i<tables.length;++i){
        var width = ((tables[i].parentNode.offsetWidth)/100)*98;
        tables[i].style.width = width;
        tables[i].childNodes[0].style.width = width;
        tables[i].childNodes[1].style.width = width;
        
        var theadTr = tables[i].childNodes[0].childNodes[0];
            theadTr.style.width = width;
            var th = theadTr.childNodes;
            for(var j=0;j<th.length;++j)
                th[j].style.width = width/th.length;
        var tbodyTr = tables[i].childNodes[1].childNodes;
        for(var j=0;j<tbodyTr.length;++j){
            tbodyTr[j].style.width = width;
            var td = tbodyTr[j].childNodes;
            for(var k=0;k<td.length;++k)
                 td[k].style.width = width/td.length;
        }
    }
    
    /*var trTags = document.getElementsByTagName("tr");
    for(var i=0;i<trTags.length;++i){
        var th = trTags[i].childNodes;
        var width = trTags[i].offsetWidth/th.length;
        for(var j=0;j<th.length;++j){
            th[j].style.width = width;
        }
    }*/
}

//Function to filter the charts-table div.
function filterReportsContent(ele){
    var filter=ele.value.toUpperCase();
    var reportContents=document.getElementsByClassName("charts-table-block");
    var title;
    for (i = 0; i < reportContents.length; i++) {
        title=reportContents[i].children[0].children[0];
        if (title.innerHTML.toUpperCase().indexOf(filter) > -1) {
            reportContents[i].style.display = "inline-block";
        } else {
            reportContents[i].style.display = "none";
        }
    }
}

//FUnction to minimize div
function minimizeDiv(ele){
    var eleToMin = ele.parentNode.parentNode.parentNode;
    var sourcepos = $(eleToMin).position();
    
    var replacement = document.createElement("div");
        replacement.setAttribute("class","chart-table-div-replacement");
        replacement.setAttribute("id",ele.parentNode.parentNode.nextElementSibling.id);
        replacement.innerHTML = ele.parentNode.previousElementSibling.innerHTML;
        replacement.style.top = sourcepos.top;
        replacement.style.left = sourcepos.left;
    $(eleToMin).slideUp(200);
    //document.getElementsByClassName(".footer").appendChild(replacement);
    document.body.appendChild(replacement);
    var destpos = $('.footer').position();
    var left=(($(".chart-table-div-replacement").length-1)*100)+destpos.left;
    $(replacement).animate({ 'top': (destpos.top - 20) + 'px', 'left': left + 'px'}, 700, function(){
        //end of animation.. if you want to add some code here
    });
}

//Function to maximize charts in popup.
function dashletMaxOfTableChart(ele,data,functionToCall){
    //Creating popup background
    var popupDiv = document.createElement("div");
        popupDiv.setAttribute("class","popup-div");
        $(popupDiv).css({'width':$(window).width(),'height':$(document).height()}); 
    
    //Creating popup container
    var popupChartContainer = document.createElement("div");
        popupChartContainer.setAttribute("class","popup-chart-container");
    var winHeight = $(window).height();
    var winWidth = $(window).width();
    $(popupChartContainer).css({'width':winWidth-100,'height':winHeight-100}); 
    $(popupChartContainer).css('top',  -winHeight);   
    $(popupChartContainer).css('left', (winWidth/2)-(winWidth-100)/2); 
    popupDiv.appendChild(popupChartContainer);
    
    var titleDiv = document.createElement("div");
        titleDiv.setAttribute("class","charts-table-title");
        var title = document.createElement("font");
            title.setAttribute("class","charts-table-title-font");
        titleDiv.appendChild(title);
        var closeButton = document.createElement("div");
            closeButton.setAttribute("class","charts-table-tools");
            var close = document.createElement("span");
                close.setAttribute("class","fi-delete");
                $(close).click(function(){
                    closePopup(popupDiv);
                });
            closeButton.appendChild(close);
        titleDiv.appendChild(closeButton);
    popupChartContainer.appendChild(titleDiv);
    
    var chartContainer = document.createElement("div");
        chartContainer.setAttribute("class","charts-table-content");
        chartContainer.setAttribute("id","dashletMax");
    popupChartContainer.appendChild(chartContainer);
    //Adding to body
    document.body.appendChild(popupDiv);
    $("body").css("overflow-y","hidden");
    
    $(popupDiv).animate({opacity: '1'},500,function(){});
    
    $(popupChartContainer).animate({
            opacity: '1',
            //height: winHeight-100,
            //width: winWidth-100,
            //left: (winWidth/2)-(winWidth-100)/2,
            top: (winHeight/2)-(winHeight-100)/2
    },500,function(){
    });
    
    var topPadding = ($(titleDiv).height() - $(close).height())/2;
    closeButton.style.paddingTop = topPadding+"px";
    closeButton.style.paddingRight = "20px";
    title.style.paddingTop = topPadding+"px";
    
    //Creating chart
        window[functionToCall]("dashletMax",data);
    
    
    $(popupDiv).click(function(e){
        if(e.target==popupDiv)
            closePopup(popupDiv);
    });
}

function closePopup(popupDiv){
    $("body").css("overflow-y","scroll");
    $(popupDiv.children[0]).animate({
            opacity: '0',
            left: $(window).width()
            //top: $(window).height()
    },700,function(){
        
        
    });
    $(popupDiv).animate({opacity: '0'},900,function(){popupDiv.remove();});
    
}

function setOnclickMaxFun(id,data,functionToCall){
    var ele = $("#"+id)[0];
    var allChild = ele.previousElementSibling.lastElementChild.children;
    for(var i=0;i<allChild.length;++i){
        if(allChild[i].className.indexOf("dashletMax") != -1){
            ele = allChild[i];
            break;
        }
    }
    ele.onclick = function(){ dashletMaxOfTableChart(ele,data,functionToCall);};
}

function getKeysFromJsonPayLoad(payLoad){
    if (typeof Object.keys !== "function") {
        (function() {
                var hasOwn = Object.prototype.hasOwnProperty;
                Object.keys = Object_keys;
                function Object_keys(payLoad) {
                    var keys = [], name;
                    for (name in payLoad) {
                        if (hasOwn.call(payLoad, name)) {
                            keys.push(name);
                        }
                    }
                    return keys;
                }
            })();
    }
    return Object.keys(payLoad);
}

function getValuesFromJsonPayLoad(payLoad){
    if (typeof Object.values !== "function") {
        (function() {
                var hasOwn = Object.prototype.hasOwnProperty;
                Object.values = Object_values;
                function Object_values(payLoad) {
                    var values = [], name;
                    for (name in payLoad) {
                        if (hasOwn.call(payLoad, name)) {
                            values.push(payLoad[name]);
                        }
                    }
                    return values;
                }
            })();
    }
    return Object.values(payLoad);
}