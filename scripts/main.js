/************************** MAP ****************************/

var width = 1024,
    height = 1000;
var projection = d3.geoKavrayskiy7()
    .scale(170);
var path = d3.geoPath(projection);
var graticule = d3.geoGraticule();
var svg = d3.select("#map").append("svg")
    .attr("width", width)
    .attr("height", height);
svg.append("defs").append("path")
    .datum({ type: "Sphere" })
    .attr("id", "sphere")
    .attr("d", path);
svg.append("use")
    .attr("class", "stroke")
    .attr("xlink:href", "#sphere");
svg.append("use")
    .attr("class", "fill")
    .attr("xlink:href", "#sphere");
svg.append("path")
    .datum(graticule)
    .attr("class", "graticule")
    .attr("d", path);
d3.json("data/world-110m.json").then(function(world) {
    console.log(world);
    svg.insert("path", ".graticule")
        .datum(topojson.feature(world, world.objects.land))
        .attr("class", "land")
        .attr("d", path);
});

/*************************************** MAIN GRAPH *********************************************/

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

var mainGraph = d3.select("#main-graph").append("svg")
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


        mainGraph.append("g")
            .attr("class", "x axis")
            .attr("transform", "translate(0," + height + ")")
            .call(xAxis);

        mainGraph.append("g")
            .attr("class", "y axis")
            .call(yAxis)
            .append("text")
            // .attr("transform", "rotate(-90)")
            // .attr("y", 10)
            .attr("dy", "1em")
            .attr("dx", "-0.5em")
            .style("text-anchor", "end")
            .text("°C");

    })
    .catch(function(error) {
        throw error;
    })


function mainGraphTransition(path) {
    var totalLength = path.node().getTotalLength();

    path.attr("stroke-dasharray", totalLength + " " + totalLength)
        .attr("stroke-dashoffset", totalLength)
        .transition()
        .duration(4000)
        .ease(d3.easeLinear)
        .attr("stroke-dashoffset", 0)
        .on("end", animationCallback);
}


function drawSectionMainGraph(data, line, id) {
    mainGraph.append("path")
        .data([data])
        .attr("class", "line")
        .attr("d", line)
        .attr("id", id)
        .call(mainGraphTransition);
}

/*********************** FINAL GRAPH ********************* */


var marginFinalGraph = {
        top: 20,
        right: 20,
        bottom: 30,
        left: 50
    },
    widthFinalGraph = 750 - marginFinalGraph.left - marginFinalGraph.right,
    heightFinalGraph = 360 - marginFinalGraph.top - marginFinalGraph.bottom;

var xFinalGraph = d3.scaleLinear().range([0, widthFinalGraph]);

var yFinalGraph = d3.scaleLinear().range([heightFinalGraph, 0]);

var xAxisFinalGraph = d3.axisBottom(xFinalGraph)
    .tickValues([1880, 2018, 2100])
    .tickFormat(d3.format("d"));

var yAxisFinalGraph = d3.axisLeft(yFinalGraph)
    .tickValues([0, 1, 3, 5]);

var lineFinalGraph = d3.line()
    .x(function(d) {
        return xFinalGraph(d.Year);
    })
    .y(function(d) {
        return yFinalGraph(d.Annomaly);
    });

var finalGraph = d3.select("#finalGraph").append("svg")
    .attr("width", widthFinalGraph + marginFinalGraph.left + marginFinalGraph.right)
    .attr("height", heightFinalGraph + marginFinalGraph.top + marginFinalGraph.bottom)
    .append("g")
    .attr("transform", "translate(" + marginFinalGraph.left + "," + marginFinalGraph.top + ")");

var stabilisedData;

d3.csv('data/stabilisedData.csv')
    .then(function(data) {
        console.log(data);

        data.forEach(function(d) {
            d.Year = d.Year;
            d.Annomaly = +d.Annomaly;
        });

        stabilisedData = data;

        // creates fixed values on the axis
        xFinalGraph.domain([1880, 2150]).nice();
        yFinalGraph.domain([0, 9]).nice();

        finalGraph.append("g")
            .attr("class", "x axis")
            .attr("transform", "translate(0," + heightFinalGraph + ")")
            .call(xAxisFinalGraph);

        finalGraph.append("g")
            .attr("class", "y axis")
            .call(yAxisFinalGraph)
            .append("text")
            // .attr("transform", "rotate(-90)")
            // .attr("y", 10)
            .attr("dy", "1em")
            .attr("dx", "-0.5em")
            .style("text-anchor", "end")
            .text("°C");

        finalGraph.append("path")
            .data([allData])
            .attr("class", "line")
            .attr("d", lineFinalGraph)

        // finalGraph.append("path")
        //     .data([stabilisedData])
        //     .attr("class", "line")
        //     .attr("d", lineFinalGraph)

    })
    .catch(function(error) {
        throw error;
    })


function finalGraphTransition(path) {
    var totalLength = path.node().getTotalLength();

    path.attr("stroke-dasharray", totalLength + " " + totalLength)
        .attr("stroke-dashoffset", totalLength)
        .transition()
        .duration(4000)
        .ease(d3.easeLinear)
        .attr("stroke-dashoffset", 0);
    // .on("end", finalAnimationCallback);
}

function drawSectionFinalGraph(data, line, id) {
    finalGraph.append("path")
        .data([data])
        .attr("class", "line")
        .attr("d", line)
        .attr("fill", "green")
        .attr("id", id)
        .call(finalGraphTransition);
}


/************* Graph animations functions **************/

var nodedata = []; // store nodes information
var jsonlinks = [];

function mainGraphAnimationSection1() {
    var start_index = 0;
    var end_index = 145;
    var section = allData.slice(start_index, end_index);
    if (d3.selectAll(".group-1")._groups[0].length > 0) { d3.selectAll(".group-1").remove(); }
    if (d3.selectAll(".group-2")._groups[0].length > 0) { d3.selectAll(".group-2").remove(); }
    if (d3.selectAll(".group-3")._groups[0].length > 0) { d3.selectAll(".group-3").remove(); }
    d3.select("#section2").remove();
    d3.select("#section1").remove();
    nodedata = [];
    jsonlinks = [];
    drawSectionMainGraph(section, line, "section1");
};

function mainGraphAnimationSection2() {
    var start_index = 144;
    var end_index = 200;
    var section = allData.slice(start_index, end_index);

    //code for map
    if (d3.selectAll(".group-2")._groups[0].length > 0) {
        d3.selectAll(".group-2").remove();
        nodedata.forEach(function(d, i) {
            if (d.tempStart == 3 && d.tempEnd == 5) {
                nodedata.splice(i, 10);
            }
        });
        jsonlinks.forEach(function(d, i) {
            if (d.temp == "3-5") {
                // jsonlinks.pop(d);
                jsonlinks.splice(i, 10);
            }
        });
    }
    if (d3.selectAll(".group-1")._groups[0].length > 0) { d3.selectAll(".group-1").remove(); }
    if (d3.selectAll(".group-3")._groups[0].length > 0) { d3.selectAll(".group-3").remove(); }
    d3.json("data/GraphData.json").then(function(json) {
        json.nodes.forEach(function(d, i) {
            if (d.tempStart == 1 && d.tempEnd == 3) {
                if (nodedata.some(e => e.name == d.name)) {
                    console.log("Yes it contains");
                } else {
                    nodedata.push(d);
                }
            }
        });
        json.links.forEach(function(d, i) {
            if (d.temp == "1-3") {
                if (jsonlinks.some(e => e.source == d.source && e.target == d.target)) {
                    console.log("Yes it contains target");
                } else {
                    jsonlinks.push(d);
                }
            }
        });
        var node = svg.selectAll(".node")
            .data(nodedata)
            .enter().append("g")
            .attr("class", function(d) {
                if (d.tempStart == 1 && d.tempEnd == 3) {
                    return "group-1"
                } else {
                    if (d.tempStart == 3 && d.tempEnd == 5) {
                        return "group-2"
                    } else {
                        return "group-3"
                    }
                }
            })
        node.append("path")
            .data(jsonlinks)
            .attr("class", "link-group-1")
            .style("fill", "none")
            .attr("pointer-events", "visibleStroke")
            .style("stroke-width", 3)
            .attr("d", function(d) { // position of links depends on this
                //console.log(d);
                var dx = nodedata[d.target].x - nodedata[d.source].x,
                    dy = nodedata[d.target].y - nodedata[d.source].y,
                    dr = Math.sqrt(dx * dx + dy * dy);

                return "M" + projection([nodedata[d.source].x, nodedata[d.source].y])[0] + "," + projection([nodedata[d.source].x, nodedata[d.source].y])[1] + "A" + dr + "," + dr + " 0 0,1 " + projection([nodedata[d.target].x, nodedata[d.target].y])[0] + "," + projection([nodedata[d.target].x, nodedata[d.target].y])[1];
            });

        node.append("ellipse")
            .attr("rx", "60")
            .attr("ry", "16")
            .attr('cx', function(d) {
                return projection([d.x, d.y])[0];
            })
            .attr('cy', function(d) {
                return projection([d.x, d.y])[1];
            })
            .style("fill-opacity", 0.6)

        node.append("text")
            .attr("text-anchor", "middle")
            .attr("dy", ".3em")
            .attr("dx", function(d) {
                return projection([d.x, d.y])[0]; // for position of text using projection to convert lat & long
            })
            .attr("dy", function(d) {
                return projection([d.x, d.y])[1];
            })
            .text(function(d) {
                return d.name
            });
    });

    d3.select("#section3").remove();
    d3.select("#section2").remove();
    drawSectionMainGraph(section, line, "section2");
};

function mainGraphAnimationSection3() {
    var start_index = 199;
    var end_index = 234;
    var section = allData.slice(start_index, end_index);


    // code for map
    if (d3.selectAll(".group-3")._groups[0].length > 0) {
        d3.selectAll(".group-3").remove();
        nodedata.forEach(function(d, i) {
            if (d.tempStart == 5 && d.tempEnd == 99) {
                nodedata.splice(i, 4);
            }
        });
        jsonlinks.forEach(function(d, i) {
            if (d.temp == "5-99") {
                // jsonlinks.pop(d);
                jsonlinks.splice(i, 4);
            }
        });
    }
    if (d3.selectAll(".group-2")._groups[0].length > 0) { d3.selectAll(".group-2").remove(); }
    if (d3.selectAll(".group-1")._groups[0].length > 0) { d3.selectAll(".group-1").remove(); }
    d3.json("data/GraphData.json").then(function(json) {
        json.nodes.forEach(function(d, i) {
            if (d.tempStart == 3 && d.tempEnd == 5) {
                if (nodedata.some(e => e.name == d.name)) {
                    console.log("Yes it contains");
                } else {
                    nodedata.push(d);
                }
            }
        });
        json.links.forEach(function(d, i) {
            if (d.temp == "3-5") {
                if (jsonlinks.some(e => e.source == d.source && e.target == d.target)) {
                    console.log("Yes it contains target");
                } else {
                    jsonlinks.push(d);
                }
            }
        });
        var node = svg.selectAll(".node")
            .data(nodedata)
            .enter().append("g")
            .attr("class", function(d) {
                if (d.tempStart == 1 && d.tempEnd == 3) {
                    return "group-1"
                } else {
                    if (d.tempStart == 3 && d.tempEnd == 5) {
                        return "group-2"
                    } else {
                        return "group-3"
                    }
                }
            })
        node.append("path")
            .data(jsonlinks)
            .attr("class", "link-group-2")
            .style("fill", "none")
            .attr("pointer-events", "visibleStroke")
            .style("stroke-width", 3)
            .attr("d", function(d) { // position of links depends on this
                //console.log(d);
                var dx = nodedata[d.target].x - nodedata[d.source].x,
                    dy = nodedata[d.target].y - nodedata[d.source].y,
                    dr = Math.sqrt(dx * dx + dy * dy);

                return "M" + projection([nodedata[d.source].x, nodedata[d.source].y])[0] + "," + projection([nodedata[d.source].x, nodedata[d.source].y])[1] + "A" + dr + "," + dr + " 0 0,1 " + projection([nodedata[d.target].x, nodedata[d.target].y])[0] + "," + projection([nodedata[d.target].x, nodedata[d.target].y])[1];
            });

        node.append("ellipse")
            .attr("rx", "60")
            .attr("ry", "16")
            .attr('cx', function(d) {
                return projection([d.x, d.y])[0];
            })
            .attr('cy', function(d) {
                return projection([d.x, d.y])[1];
            })
            .style("fill-opacity", 0.6)

        node.append("text")
            .attr("text-anchor", "middle")
            .attr("dy", ".3em")
            .attr("dx", function(d) {
                return projection([d.x, d.y])[0]; // for position of text using projection to convert lat & long
            })
            .attr("dy", function(d) {
                return projection([d.x, d.y])[1];
            })
            .text(function(d) {
                return d.name
            });
    });

    d3.select("#section4").remove();
    d3.select("#section3").remove();
    drawSectionMainGraph(section, line, "section3");
};

function mainGraphAnimationSection4() {
    var start_index = 233;
    var end_index = 272;
    var section = allData.slice(start_index, end_index);
    // code for map
    d3.json("data/GraphData.json").then(function(json) {
        json.nodes.forEach(function(d, i) {
            if (d.tempStart == 5 && d.tempEnd == 99) {
                nodedata.push(d);
            }
        });
        json.links.forEach(function(d, i) {
            if (d.temp == "5-99") {
                jsonlinks.push(d);
            }
        });
        var node = svg.selectAll(".node")
            .data(nodedata)
            .enter().append("g")
            .attr("class", function(d) {
                if (d.tempStart == 1 && d.tempEnd == 3) {
                    return "group-1"
                } else {
                    if (d.tempStart == 3 && d.tempEnd == 5) {
                        return "group-2"
                    } else {
                        return "group-3"
                    }
                }
            })
        node.append("path")
            .data(jsonlinks)
            .attr("class", "link-group-2")
            .style("fill", "none")
            .attr("pointer-events", "visibleStroke")
            .style("stroke-width", 3)
            .attr("d", function(d) { // position of links depends on this
                //console.log(d);
                var dx = nodedata[d.target].x - nodedata[d.source].x,
                    dy = nodedata[d.target].y - nodedata[d.source].y,
                    dr = Math.sqrt(dx * dx + dy * dy);

                return "M" + projection([nodedata[d.source].x, nodedata[d.source].y])[0] + "," + projection([nodedata[d.source].x, nodedata[d.source].y])[1] + "A" + dr + "," + dr + " 0 0,1 " + projection([nodedata[d.target].x, nodedata[d.target].y])[0] + "," + projection([nodedata[d.target].x, nodedata[d.target].y])[1];
            });

        node.append("ellipse")
            .attr("rx", "60")
            .attr("ry", "16")
            .attr('cx', function(d) {
                return projection([d.x, d.y])[0];
            })
            .attr('cy', function(d) {
                return projection([d.x, d.y])[1];
            })
            .style("fill-opacity", 0.6)
        node.append("text")
            .attr("text-anchor", "middle")
            .attr("dy", ".3em")
            .attr("dx", function(d) {
                return projection([d.x, d.y])[0]; // for position of text using projection to convert lat & long
            })
            .attr("dy", function(d) {
                return projection([d.x, d.y])[1];
            })
            .text(function(d) {
                return d.name
            });
    });
    d3.select("#section4").remove();
    drawSectionMainGraph(section, line, "section4");
};

function animateFinalGraph() {
    d3.select("#stabilised").remove();
    d3.select("#tipping-pt").remove();
    drawSectionFinalGraph(stabilisedData, lineFinalGraph, "stabilised");

    finalGraph.append("circle")
        .attr("id", "tipping-pt")
        .attr("class", "tipping-point")
        .attr("cx", function(d) { return xFinalGraph(2024) })
        .attr("cy", function(d) { return yFinalGraph(1.21) })
        .attr("r", 15)
        .attr("fill", "none")
        .attr("stroke", "red")
        .attr("stroke-width", "2.5px")
        .attr("stroke-opacity", 0)
        .transition()
        .duration(2000)
        .ease(d3.easeLinear)
        .style("stroke-opacity", 1);
    // .on("end", animationCallback);

    $(".conclusion-text-1").animate({
        opacity: 1,
    }, 2000, function() {
        // Animation complete.
    });

    $(".conclusion-text-2").delay(2500).animate({
        opacity: 1,
    }, 4000, function() {
        // Animation complete.
    });
}

function removeAllGraphSections() {
    d3.select("#section1").remove();
    d3.select("#section2").remove();
    d3.select("#section3").remove();
    d3.select("#section4").remove();
    d3.select("#stabilised").remove();
    d3.select("#tipping-pt").remove();
}






/*************************************** ANIMATION FUNCTIONS *********************************/


function section1Animation() {
    animationStart();
    mainGraphAnimationSection1();
}

function section2Animation() {
    animationStart();
    mainGraphAnimationSection2();
}

function section3Animation() {
    animationStart();
    mainGraphAnimationSection3();
}

function section4Animation() {
    animationStart();
    mainGraphAnimationSection4();
}

function resetAllAnimations() {
    removeAllGraphSections();
    //reset processes
    //reset connections
}



/***************************************** SCROLLIFY ***********************************************/


$.scrollify({
    section: ".panel",
    scrollbars: false,
    // easing: 'linear',
    // overflowScroll: true,
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
                    "\"></a></li>";
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
        // $(".pagination a").on("click", $.scrollify.move);
    },
    after: function(i, panels) {
        var section, start_index, end_index;
        if (i == 1) {
            section1Animation();
        } else if (i == 2) {
            section2Animation();
        } else if (i == 3) {
            section3Animation();
        } else if (i == 4) {
            section4Animation();
        } else if (i == 5) {
            $(".scroll").hide();
            $.scrollify.disable();
            animateFinalGraph();
        }
    },
});

$(".scroll, .scroll-btn").click(function(e) {
    e.preventDefault();
    $.scrollify.next();
});



/* when document is loaded and current page is start or end, hide the navigation dots */
$(document).ready(function() {
    var curSection = $.scrollify.current();
    var curSecName = $($(curSection).get(0)).attr("data-section-name")

    if (curSecName == "home" || curSecName == "end") {
        $(".pagination").css({ "visibility": "hidden" });
    }
});

function animationStart() {
    $('.pagination').hide();
    $('.scroll').hide();
    $.scrollify.disable();
    startTimer();
}

function animationCallback() {
    $('.pagination').show();
    $('.scroll').show();
    $.scrollify.enable();
    $("#timer").empty();
    $("#timer").append('<div id="my-timer" class="svg-pie"></div>');
}

function finalAnimationCallback() {
    $.scrollify.enable();
}

function startTimer() {
    $('#my-timer').svgPie({

        // easing
        easing: 'linear',

        // dimension
        dimension: 20,

        // percentage
        percentage: 100,

        // animation speed
        duration: 4000,

        // callbacks
        onStart: function() {},
        onComplete: function() {}

    });
}

function restartApp() {
    $.scrollify.enable();
    resetAllAnimations();
    $.scrollify.move("#home");
    $('.scroll').show();
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