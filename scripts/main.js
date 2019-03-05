/***************************************GRAPH*********************************************/

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

var svg = d3.select("#graph").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

d3.csv("data/temperatureData.csv", function(error, data) {
    if (error) throw error;
    console.log(data);

    data.forEach(function(d) {
        d.Year = d.Year;
        d.Annomaly = +d.Annomaly;
    });


    // creates axis accordingly to the min and max values of the data
    // x.domain(d3.extent(data, function(d) {
    //     return d.Year;
    // }));
    // y.domain(d3.extent(data, function(d) {
    //     return d.Annomaly;
    // }));

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
    //     .datum(data)
    //     .attr("class", "line")
    //     .attr("d", line)
    //     .call(transition);

    d3.select("body")
        .on("keydown", function() {
            var section;
            if (d3.event.keyCode == 49) {
                //1 key press
                start_index = 0;
                end_index = 272;
                section = data.slice(start_index, end_index);

                drawSection(section, line);

            } else if (d3.event.keyCode == 50) {
                //2 key press
                start_index = 144;
                end_index = 200;
                section = data.slice(start_index, end_index);

                drawSection(section, line);

            } else if (d3.event.keyCode == 51) {
                //3 key press
                start_index = 199;
                end_index = 234;
                section = data.slice(start_index, end_index);

                drawSection(section, line);

            } else if (d3.event.keyCode == 52) {
                //4 key press
                start_index = 233;
                end_index = 272;
                section = data.slice(start_index, end_index);

                drawSection(section, line);
            }
        });
});

function drawSection(data, line) {
    svg.append("path")
        .datum(data)
        .attr("class", "line")
        .attr("d", line)
        .call(transition);
}

function transition(path) {
    path.transition()
        .duration(3000)
        .attrTween("stroke-dasharray", tweenDash);
}

function tweenDash() {
    var l = this.getTotalLength(),
        i = d3.interpolateString("0," + l, l + "," + l);
    return function(t) {
        return i(t);
    };
}

// window.addEventListener('scroll', function() {
//     var l = svg.select('path.line')[0][0].getTotalLength();
//     svg.select('path.line').transition()
//         // .duration(2000)
//         .attr("stroke-dasharray", function() {
//             return pageYOffset + ", " + l;
//         });
// });

/************************************************************************************/