/*************************************** GRAPH *********************************************/

var margin = {
        top: 60,
        right: 20,
        bottom: 30,
        left: 50
    },
    width = 400 - margin.left - margin.right,
    height = 365 - margin.top - margin.bottom;

var x = d3.scaleLinear().range([0, width]);

var y = d3.scaleLinear().range([height, 0]);

var xAxis = d3.axisBottom(x)
    .tickValues([1880, 2018, 2100])
    .tickFormat(d3.format("d"));

var yAxis = d3.axisLeft(y)
    .tickValues([0, 1, 3, 5]);

var line = d3.line()
    .x(function(d) {
        return x(d.Year);
    })
    .y(function(d) {
        return y(d.Annomaly);
    });

var svg = d3.select("#graph").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

var allData;

d3.csv('data/temperatureData.csv')
    .then(function(data) {
        console.log(data);

        data.forEach(function(d) {
            d.Year = d.Year;
            d.Annomaly = +d.Annomaly;
        });

        allData = data;

        // creates fixed values on the axis
        x.domain([1880, 2150]).nice();
        y.domain([0, 9]).nice();


        svg.append("g")
            .attr("class", "x axis")
            .attr("transform", "translate(0," + height + ")")
            .call(xAxis);

        svg.append("g")
            .attr("class", "y axis")
            .call(yAxis)
            .append("text")
            .attr("transform", "rotate(-90)")
            .attr("y", 6)
            .attr("dy", ".71em")
            .style("text-anchor", "end")
            .text("temperature");

        // svg.append("path")
        //     .data([data])
        //     .attr("class", "line")
        //     .attr("d", line);
        // .call(transition);
    })
    .catch(function(error) {
        throw error;
    })

var t = d3.transition()
    .duration(750)
    .ease(d3.easeLinear);

function drawSection(data, line, id) {
    svg.append("path")
        .data([data])
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
        .duration(2000)
        .ease(d3.easeLinear)
        .attr("stroke-dashoffset", 0)
        .on("end", restartScroll);

    // path.transition()
    //     .duration(2000)
    //     .attrTween("stroke-dasharray", tweenDash);
}

// function tweenDash() {
//     var l = this.getTotalLength(),
//         i = d3.interpolateString("0," + l, l + "," + l);
//     return function(t) {
//         return i(t);
//     };
// }


/************* Graph animations functions **************/

function animateGraphSection1() {
    var start_index = 0;
    var end_index = 145;
    var section = allData.slice(start_index, end_index);
    d3.select("#section2").remove();
    d3.select("#section1").remove();
    drawSection(section, line, "section1");
};

function animateGraphSection2() {
    var start_index = 144;
    var end_index = 200;
    var section = allData.slice(start_index, end_index);

    d3.select("#section3").remove();
    d3.select("#section2").remove();
    drawSection(section, line, "section2");
};

function animateGraphSection3() {
    var start_index = 199;
    var end_index = 234;
    var section = allData.slice(start_index, end_index);

    d3.select("#section4").remove();
    d3.select("#section3").remove();
    drawSection(section, line, "section3");
};

function animateGraphSection4() {
    var start_index = 233;
    var end_index = 272;
    var section = allData.slice(start_index, end_index);

    d3.select("#section4").remove();
    drawSection(section, line, "section4");
};


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