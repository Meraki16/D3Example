/*************************************** GRAPH *********************************************/


/**** load all data ****/
var allTempData;
var stabilisedData;

// get historic + hot house earth temperatures data
d3.csv("data/temperatureData.csv", function(error, data) {
    if (error) throw error;
    console.log(data);
    data.forEach(function(d) {
        d.Year = d.Year;
        d.Annomaly = +d.Annomaly;
    });

    allTempData = data;
});

// get stabilised earth temperatures data
d3.csv("data/stabilisedData.csv", function(error, data) {
    if (error) throw error;
    console.log(data);
    data.forEach(function(d) {
        d.Year = d.Year;
        d.Annomaly = +d.Annomaly;
    });
    stabilisedData = data;
});


/***** set axis for graph of historic + hot house data ****/
var margin = {
        top: 60,
        right: 20,
        bottom: 30,
        left: 50
    },
    width = 400 - margin.left - margin.right,
    height = 365 - margin.top - margin.bottom;

var x = d3.scale.linear()
    .range([0, width]);

var y = d3.scale.linear()
    .range([height, 0]);

var xAxis = d3.svg.axis()
    .scale(x)
    .tickValues([1880, 2018, 2100])
    .tickFormat(d3.format("d"))
    .orient("bottom");

var yAxis = d3.svg.axis()
    .scale(y)
    .tickValues([0, 1, 3, 5])
    .orient("left");

var line = d3.svg.line()
    .x(function(d) {
        return x(d.Year);
    })
    .y(function(d) {
        return y(d.Annomaly);
    });

// creates fixed values on the axis
x.domain([1880, 2150]).nice();
y.domain([0, 9]).nice();


/****** sets graph of historic + hot house data *****/
var graph = d3.select("#graph").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

graph.append("g")
    .attr("class", "x axis")
    .attr("transform", "translate(0," + height + ")")
    .call(xAxis);

graph.append("g")
    .attr("class", "y axis")
    .call(yAxis)
    .append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", 6)
    .attr("dy", ".71em")
    .style("text-anchor", "end")
    .text("temperature");

function drawSection(data, line, id) {
    graph.append("path")
        .datum(data)
        .attr("class", "line")
        .attr("d", line)
        .attr("id", id)
        .call(transition);
}

function transition(path) {
    var totalLength = path.node().getTotalLength();

    path.attr("stroke-dasharray", totalLength + " " + totalLength)
        .attr("stroke-dashoffset", totalLength)
        .transition()
        .duration(3000)
        .ease("linear")
        .attr("stroke-dashoffset", 0)
        .each("end", restartScroll);
}


/********* sets graph for stabilised data + historic ***********/


/************* Graph animations functions **************/

function animateGraphSection1() {
    var start_index = 0;
    var end_index = 145;
    var section = allTempData.slice(start_index, end_index);
    d3.select("#section2").remove();
    d3.select("#section1").remove();
    drawSection(section, line, "section1");
};

function animateGraphSection2() {
    var start_index = 144;
    var end_index = 200;
    var section = allTempData.slice(start_index, end_index);

    d3.select("#section3").remove();
    d3.select("#section2").remove();
    drawSection(section, line, "section2");
};

function animateGraphSection3() {
    var start_index = 199;
    var end_index = 234;
    var section = allTempData.slice(start_index, end_index);

    d3.select("#section4").remove();
    d3.select("#section3").remove();
    drawSection(section, line, "section3");
};

function animateGraphSection4() {
    var start_index = 233;
    var end_index = 272;
    var section = allTempData.slice(start_index, end_index);

    d3.select("#section4").remove();
    drawSection(section, line, "section4");
};

function animateGraphConclusion() {

    $("#graph").css('z-index', '999');
}

/****************** Text animations ******************** */

function animateText1() {
    $("#text1").animate({
        bottom: 200
    });
};

function animateText2() {
    $("#text2").animate({
        bottom: 500
    });
};


/***************************************** SCROLLIFY ***********************************************/


$.scrollify({
    section: ".panel",
    scrollbars: false,
    before: function(i, panels) {
        var ref = panels[i].attr("data-section-name");
        $(".pagination .active").removeClass("active");
        $(".pagination").find("a[href=\"#" + ref + "\"]").addClass("active");

        /* the following lines will hide the navigation dots when the first or last page is active. Otherwise, they are made visible*/
        var curSection = $.scrollify.current();
        var curSecName = $($(curSection).get(0)).attr("data-section-name")

        if (curSecName == "home" || curSecName == "end") {
            $(".pagination").css({ "visibility": "hidden" });
        } else {
            $(".pagination").css({ "visibility": "visible" });
        }
    },
    afterRender: function() {
        var pagination = "<ul class=\"pagination\">";
        var activeClass = "";
        $(".panel").each(function(i) {
            activeClass = "";
            if (i === 0) {
                activeClass = "active";
            }

            /*create for each page a navigation dot except for the first and last page*/
            if ($(this).attr("data-section-name") != "home" && $(this).attr("data-section-name") != "end") {
                pagination += "<li><a class=\"" +
                    activeClass +
                    "\" href=\"#" +
                    $(this).attr("data-section-name") +
                    "\"><span class=\"hover-text\">" +
                    $(this).attr("data-section-name").charAt(0).toUpperCase() +
                    $(this).attr("data-section-name").slice(1) +
                    "</span></a></li>";
            }
        });

        pagination += "</ul>";
        $(".panel1").append(pagination);

        /*
			Tip: The two click events below are the same:
			$(".pagination a").on("click",function() {
			  $.scrollify.move($(this).attr("href"));
			});
	  
			*/
        $(".pagination a").on("click", $.scrollify.move);
    },
    after: function(i, panels) {
        var section, start_index, end_index;
        if (i == 1) {

            stopScroll();

            // animateText1();
            animateGraphSection1();

        } else if (i == 2) {

            stopScroll();

            // animateText2();
            animateGraphSection2();

        } else if (i == 3) {

            stopScroll();

            animateGraphSection3();

        } else if (i == 4) {

            stopScroll();

            animateGraphSection4();

        } else if (i == 5) {

            animateGraphConclusion();
        }
    },
});

$(".scroll, .scroll-btn").click(function(e) {
    e.preventDefault();
    $.scrollify.next();
});

/* when document is loaded, hide the navigation dots */
$(document).ready(function() {
    $(".pagination").css({ "visibility": "hidden" });
});


function restartScroll() {
    $('.pagination').show();
    $.scrollify.enable();
}

function stopScroll() {
    $('.pagination').hide();
    $.scrollify.disable();
}



/*
 * jQuery Scrollify
 * Version 1.0.19
 *
 * Requires:
 * - jQuery 1.7 or higher
 *
 * https://github.com/lukehaas/Scrollify
 *
 * Copyright 2016, Luke Haas
 * Permission is hereby granted, free of charge, to any person obtaining a copy of
 * this software and associated documentation files (the "Software"), to deal in
 * the Software without restriction, including without limitation the rights to
 * use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of
 * the Software, and to permit persons to whom the Software is furnished to do so,
 * subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS
 * FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR
 * COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER
 * IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
 * CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 
 */