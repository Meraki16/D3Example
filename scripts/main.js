   // create map
   var width = window.innerWidth,
       height = window.innerHeight

   var map = new Datamap({
       element: document.getElementById('map'),
       height: height,
       width: width
   });

   var svg = map.svg;
   var force = d3.layout.force()
       .gravity(.05)
       .distance(100)
       .charge(-100)
       .size([width, height]);

   var graphdata = {};

   d3.json("data/GraphData.json", function(error, graph) {
       Object.assign(graphdata, graph.nodes);
   })

   d3.json("data/GraphData.json", function(json) {
       force
           .nodes(json.nodes)
           .links(json.links)
           .start();

       // create nodes with classes according to temp
       var node = svg.selectAll(".node")
           .data(json.nodes)
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
           .call(force.drag);

       var link = svg.selectAll(".link")
           .data(json.links)
           .enter().append("path")
           .attr("class", "link")
           .style("fill", "none")
           .style("stroke", function(d) {
               if (d.source.tempStart == 1 && d.source.tempEnd == 3 && d.target.tempStart == 1 && d.target.tempEnd == 3) {
                   return "yellow"
               } else {
                   if (d.source.tempStart == 3 && d.source.tempEnd == 5 && d.target.tempStart == 1 && d.target.tempEnd == 3) {
                       return "orange"
                   } else {
                       return "Red"
                   }
               }
           })
           .attr("pointer-events", "visibleStroke")
           .style("stroke-width", function(d) {
               return Math.sqrt(d.weight);
           });

       node.append("ellipse")
           .attr("rx", "5")
           .attr("ry", "3")
           .attr('cx', function(d) {
               return json.nodes.px;
           })
           .attr('cy', function(d) {
               return json.nodes.py;
           })
           .style("fill-opacity", 0.6)
           .style("stroke-width", 3)
           // .style("stroke", function(d) {
           //     if (d.tempStart == 1 && d.tempEnd == 3) {
           //         return "yellow"
           //     } else {
           //         if (d.tempStart == 3 && d.tempEnd == 5) {
           //             return "orange"
           //         } else {
           //             return "Red"
           //         }
           //     }
           // })
           // .attr('fill', function(d) {
           //     if (d.tempStart == 1 && d.tempEnd == 3) {
           //         return "yellow"
           //     } else {
           //         if (d.tempStart == 3 && d.tempEnd == 5) {
           //             return "orange"
           //         } else {
           //             return "Red"
           //         }
           //     }
           // });

       node.append("text")
           .attr("dx", json.nodes.x)
           .attr("dy", json.nodes.y)
           .text(function(d) {
               return d.name
           });

       node.attr("transform", function(d) {
           return "translate(" + d.x + "," + d.y + ")";
       });

       force.on("tick", function() {
           link.attr("d", function(d) {
               var dx = graphdata[d.target.id].x - graphdata[d.source.id].x,
                   dy = graphdata[d.target.id].y - graphdata[d.source.id].y,
                   dr = Math.sqrt(dx * dx + dy * dy);

               return "M" + graphdata[d.source.id].x + "," + graphdata[d.source.id].y + "A" + dr + "," + dr + " 0 0,1 " + graphdata[d.target.id].x + "," + graphdata[d.target.id].y;
           });
       });
   });



   var waypoint1 = new Waypoint({
       element: document.getElementById('timeline-1'),
       handler: function(direction) {
           window.addEventListener('scroll', function() {
               if (pageYOffset < document.getElementById('timeline-2').offsetTop && pageYOffset > document.getElementById('timeline-1').offsetTop) {
                   svg.selectAll(".group-1").select("ellipse")
                       .attr("transform", function() {
                           return "scale(" + (pageYOffset - document.getElementById('timeline-1').offsetTop) / 100 + ")";
                       })
               }
           });
       }
   })

   var waypoint2 = new Waypoint({
       element: document.getElementById('timeline-2'),
       handler: function(direction) {
           window.addEventListener('scroll', function() {
               if (pageYOffset < document.getElementById('timeline-3').offsetTop && pageYOffset > document.getElementById('timeline-2').offsetTop) {
                   svg.selectAll(".group-2").select("ellipse")
                       .attr("transform", function() {
                           return "scale(" + (pageYOffset - document.getElementById('timeline-2').offsetTop) / 100 + ")";
                       })
               }
           });
       }
   })

   var waypoint3 = new Waypoint({
       element: document.getElementById('timeline-3'),
       handler: function(direction) {
           window.addEventListener('scroll', function() {
               if (pageYOffset > document.getElementById('timeline-3').offsetTop) {
                   svg.selectAll(".group-3").select("ellipse")
                       .attr("transform", function() {
                           return "scale(" + (pageYOffset - document.getElementById('timeline-3').offsetTop) / 100 + ")";
                       })
               }
           });
       }
   })




   //    window.addEventListener('scroll', function() {

   //        //if temp value
   //        svg.selectAll(".group-1").select("ellipse")
   //            .attr("transform", function() {
   //                return "scale(" + pageYOffset / 100 + ")";
   //            })
   //    });