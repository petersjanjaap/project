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
var width = 520;
var height = 400;
var r = 160;

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
      .attr("class", "title")
      .attr("x", (width / 2))
      .attr("y", padding * 0.4)
      .attr("text-anchor", "middle")
      .attr("fill", "black")
      .style("font-size", "34px")
      .text("World Map of trade");

// creates a title
svgGraph.append("text")
      .attr("class", "title")
      .attr("x", (width / 2))
      .attr("y", padding * 0.4)
      .attr("text-anchor", "middle")
      .attr("fill", "black")
      .style("font-size", "20px")
      .text("Development of trade values in stacked graph");

// creates a title
svgPie.append("text")
      .attr("class", "title")
      .attr("x", (width / 2))
      .attr("y", padding * 0.4)
      .attr("text-anchor", "middle")
      .attr("fill", "black")
      .style("font-size", "20px")
      .text("Partner country components of GDP");
