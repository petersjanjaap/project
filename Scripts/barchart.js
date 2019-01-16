
  // Define the div for the tooltip
  var tooltip = d3.select('body')
                .append('div')
                .attr('class', 'tooltip')
                .style('opacity', 0);

// returns x and y observations for a given json object
function fillXY(jsonObj){
  var xAxis = [];
  var yAxis = [];
  for (var key in jsonObj) {
    if (jsonObj.hasOwnProperty(key)) {

      xAxis.push(key);

      // add x and y observations for each key to lists
      if (jsonObj[key]) {
        yAxis.push(Math.round(parseFloat(jsonObj[key])));
      } else {
        yAxis.push(0)
      }
    }
  }
  return [xAxis, yAxis]
}

// calculates the ordinal scale for a discrete variable
function ordinalScaling(variable) {
  var ordinalRange = [];
  for (var i = 0; i < variable.length + 1; i++) {
    var coordinate = padding + i * width / variable.length
    ordinalRange.push(coordinate)
  }
  ordinalScaler = d3.scaleOrdinal()
          .domain(variable)
          .range(ordinalRange);
  return ordinalScaler
}

// generates linear scale for variable
function linearScaling(variable) {
  linearScaler = d3.scaleLinear()
         .domain([0, d3.max(variable, function(d) { return d; })])
         .range([height, padding]);
  return linearScaler
}

// draws bars on an svg
function barsGen(svg, obs, scaling){

  // generate bars
  svg.selectAll("rect")
     .data(obs)
     .enter()
     .append("rect")
     .attr("class", "bar")
     .attr("x", function(d, i) {
        return padding * 2 + i * (width / obs.length);
     })
     .attr("y", function(d) { return scaling(d); })
     .attr("width", width / obs.length )
     .attr("height", function(d) { return height - scaling(d); })
     .style("fill", "darkblue")
     // source for tooltip: https://codepen.io/jackdbd/pen/NAEdBG
     .on('mouseover', d => {

       // make tooltip
       tooltip
         .transition()
         .duration(200)
         .style('opacity', 0.9);

       // insert info tooltip
       tooltip
         .html("$" + d.toLocaleString())
         .style('left', d3.event.pageX + 'px')
         .style('top', d3.event.pageY - 28 + 'px');
     })
     .on('mouseout', d => {
       tooltip
         .transition()
         .duration(500)
         .style('opacity', 0);
     });
}
function barChartGenerator(data, id) {

    // create SVG element for bars
    var svgBar = d3.select("body")
                .append("svg")
                .attr("class", "bar")
                .attr("width", width)
                .attr("height", height);

     // load data on sectors (x) and trade (y) variables
     axes = fillXY(data);
     sectors = axes[0];
     values = axes[1];

     // obtains ordinale scale for country on x axis using function
     xScale = ordinalScaling(sectors)

     // obtains linear scale for gdp
     yScale = linearScaling(values)

     // draw bars on sgv using yScale
     barsGen(svgBar, values, yScale);

     // draw y 'test'
     svgBar.append("g")
           .attr("transform", "translate(" + padding * 2 + ", 0)")
           .call(d3.axisLeft(yScale))

    // draw x axis
    svgBar.append("g")
       .attr("transform", "translate(" + padding + "," + height + ")")
       .call(d3.axisBottom(xScale)
                .tickSize(10))

        // source for rotation: https://bl.ocks.org/mbostock/4403522
        .selectAll("text")
        .attr("y", 0)
        .attr("x", 9)
        .attr("dy", ".35em")
        .attr("transform", "rotate(50)")
        .style("text-anchor", "start");

    // add label to x axis
    svgBar.append("text")
       .attr("class", "label")
       .attr("x", width / 2 )
       .attr("y", height - padding )
       .text("Components of trade with" + id);

    // add label to y axis
    svgBar.append("text")
       .attr("class", "label")
       .attr("transform", "rotate(-90)")

       /*
       x and y coordinates are rotated, so x and y coordinates are vice
       versa entered
       */
       .attr("y", 10)
       .attr("x", 0 - height / 2)
       .attr("dy", ".35em")
       .style("text-anchor", "middle")
       .text("$ of trade in sector $");
};

// source: https://bl.ocks.org/tillg/14a9b1a363e82223c764551e977405f5
function updateBars(svg, data) {
  var t = d3.transition()
      .duration(750);
  var svg = d3.select("#bar")
  console.log(svg)
  var bar = svg.selectAll("g")
    .data((data, d => d.id))

  // EXIT section
  bar
    .exit()
      .remove();

  bar.select("rect")
    .transition(t)
      .attr("height", height);
}
