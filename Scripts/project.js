//width and height for svg's
var w = 700;
var h = 500;
var padding = 60;
var xWidth = w - 2 * padding;
var yHeight = h - 1.5 * padding;//width and height for svg containing graph
var w = 700;
var h = 500;
var padding = 60;
var xWidth = w - 2 * padding;
var yHeight = h - 1.5 * padding;

// width and height for svg containing pie
var width = 1000;
var height = 800;
var r = 160;

// function to find info for tooltip
function toolInfo(country) {
  if (trade[2017].hasOwnProperty(country.id)) {
    if (trade[2017][country.id].share.xprt) {
      return country.id + ", " + Math.floor(trade[2017][country.id].share.xprt * 100) / 100
    }
  } else {
    return "Unknown"
  }
}

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
    var coordinate = padding + i * xWidth / variable.length
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
         .range([yHeight, padding]);
  return linearScaler
}

// draws bars on an svg
function barGenerator(svg, obs, scaling){
  svg.selectAll("rect")
     .data(obs)
     .enter()
     .append("rect")
     .attr("class", "bar")
     .attr("x", function(d, i) {
        return padding * 2 + i * (xWidth / obs.length);
     })
     .attr("y", function(d) { return scaling(d); })
     .attr("width", xWidth / obs.length )
     .attr("height", function(d) { return yHeight - scaling(d); })
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

// create SVG element for map
var svgMap = d3.select("body")
            .append("svg")
            .attr("class", "map")
            .attr("width", width)
            .attr("height", height);

// create SVG element for graph
var svgGraph = d3.select("body")
            .append("svg")
            .attr("class", "graph")
            .attr("width", width)
            .attr("height", height);

// create SVG element for pie
var svgPie = d3.select("body")
            .append("svg")
            .attr("class", "pie")
            .attr("width", width)
            .attr("height", height);

// creates a title
svgMap.append("text")
      .attr("class", "Map")
      .attr("x", (width / 2))
      .attr("y", padding * 0.4)
      .attr("text-anchor", "middle")
      .attr("fill", "black")
      .style("font-size", "34px")
      .text("World Map of trade");

// creates a title
svgGraph.append("text")
      .attr("class", "Graph")
      .attr("x", (width / 2))
      .attr("y", padding * 0.4)
      .attr("text-anchor", "middle")
      .attr("fill", "black")
      .style("font-size", "20px")
      .text("Development of trade values in stacked graph");

// creates a title
svgPie.append("text")
      .attr("class", "Pie")
      .attr("x", (width / 2))
      .attr("y", padding * 0.4)
      .attr("text-anchor", "middle")
      .attr("fill", "black")
      .style("font-size", "20px")
      .text("Partner country components of GDP");

// Define the div for the tooltip
var tooltip = d3.select('body')
              .append('div')
              .attr('class', 'tooltip')
              .style('opacity', 0);

// create variable for all years
var years = [];
for (var year = 2000; year < 2018; year++) {
  years.push(year);
}

var sliderStep = d3.sliderBottom()
                    .min(Math.min(...years))
                    .max(Math.max(...years))
                    .width(1200)
                    .ticks(years.length)
                    .step(1)
                    .default(0.015)
                    .on('onchange', d => {
                      d3.select('p#value-step').text(d);
                    });

var gStep = d3.select('div#slider-step')
              .append('svg')
              .attr("class", "sliderf")
              .attr('width', 1200)
              .attr('height', 100)
              .append('g')
              .attr('transform', 'translate(30,30)');

gStep.call(sliderStep);

d3.select('p#value-step').text(sliderStep.value());


// sources : http://bl.ocks.org/palewire/d2906de347a160f38bc0b7ca57721328
//  https://bl.ocks.org/adamjanes/6cf85a4fd79e122695ebde7d41fe327f
// Map and projection
var path = d3.geoPath();
var projection = d3.geoNaturalEarth()
    .scale(width / 2 / Math.PI)
    .translate([width / 2, height / 2])
var path = d3.geoPath()
             .projection(projection);

// Data and color scale
var data = d3.map();

// obtain datasets
var trade = d3.json("dataset.json");
var countries = d3.json("countries.json");
var gdp = d3.json("gdp.json");

// load map and datasets
var promises = [d3.json("http://enjalot.github.io/wwsd/data/world/world-110m.geojson"),
                trade, countries, gdp]

Promise.all(promises).then(response => {

  map = response[0];
  trade = response[1];
  countries = response[2];
  gdp = response[3];

  // find minimum and maximum export values with all partners
  var min;
  var max;
  for (var country in trade[2017]) {
    if (trade[2017].hasOwnProperty(country)) {
      if (!min & !max) {
        max = trade[2017][country].share.xprt;
        min = trade[2017][country].share.xprt;
      }
      else {

        // find minima and maxima of partners share in British export
        if (trade[2017][country].share.xprt < min) {
          min = trade[2017][country].share.xprt;
        } else if (trade[2017][country].share.xprt > max)  {
          if (trade[2017][country].share.xprt != 100) {
              max = trade[2017][country].share.xprt;
          }
        }
      }
    }
  }

  // color for country
  var color = d3.scaleThreshold()
                .domain(d3.range(min, max))
                .range(d3.schemeBlues[9]);
  // Draw the map
  svgMap.append("g")
        .attr("class", "countries")
        .selectAll("path")
        .data(map.features)
        .enter().append("path")
        .attr("d", path)
        .attr('id', d => { return d.id; })
        .style("fill", function(d) {
          if (d.id == 'GBR') {
            return ("green")
          } else if (trade[2017].hasOwnProperty(d.id)) {
            return color(trade[2017][d.id].share.xprt);
          } else {
            return "grey"
          }
        })
        .style('stroke', 'black')
        .style('stroke-width', 1.5)
        .style("opacity",0.8)
        .on('mouseover', d => {
          d3.select("#" + d.id).style("fill", "red")

          // make tooltip
          tooltip
            .transition()
            .duration(200)
            .style('opacity', 0.9);

          // insert info tooltip
          var info = toolInfo(d)
          tooltip
            .html(info + "%")
            .style('left', d3.event.pageX + 'px')
            .style('top', d3.event.pageY - 28 + 'px');
        })
        .on('mouseout', d => {
          d3.select("#" + d.id).style("fill", d => {
            if (d.id == 'GBR') {
              return ("green")
            } else if (trade[2017].hasOwnProperty(d.id)) {
              return color(trade[2017][d.id].share.xprt);
            } else {
              return "grey"
            }
          })
          tooltip
            .transition()
            .duration(500)
            .style('opacity', 0);
        });

    // load data on sectors (x) and trade (y) variables
    axes = fillXY(trade[2017]["DEU"].trade.xprt);
    sectors = axes[0];
    values = axes[1];

    // obtains ordinale scale for country on x axis using function
    xScale = ordinalScaling(sectors)

    // obtains linear scale for gdp
    yScale = linearScaling(values)

    // draw bars on sgv using yScale
    barGenerator(svgPie, values, yScale);

    // draw y axis
    svgPie.append("g")
          .attr("transform", "translate(" + padding * 2 + ", 0)")
          .call(d3.axisLeft(yScale))

   // draw x axis
   svgPie.append("g")
      .attr("transform", "translate(" + padding + "," + yHeight + ")")
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
   svgPie.append("text")
      .attr("class", "label")
      .attr("x", xWidth / 2 )
      .attr("y", h - (h - yHeight) / 7 )
      .text("Selected countries in Eurozone");

   // add label to y axis
   svgPie.append("text")
      .attr("class", "label")
      .attr("transform", "rotate(-90)")

      /*
      x and y coordinates are rotated, so x and y coordinates are vice
      versa entered
      */
      .attr("y", 10)
      .attr("x", 0 - yHeight / 2)
      .attr("dy", ".35em")
      .style("text-anchor", "middle")
      .text("$ of trade in sector $");

  }
)
