// create SVG element for map
let svgMap = d3.select("#map")
              .attr("width", width)
              .attr("height", height)
              .append("g")
              .attr("class","dropdown");
              
// creates a title
svgMap.append("text")
      .attr("x", (width / 2))
      .attr("y", padding)
      .attr("text-anchor", "middle")
      .attr("fill", "black")
      .style("font-size", "34px")
      .text("Country share of UK export in %");

function mapGenerator(map, trade, countries, year) {

  // source: http://bl.ocks.org/palewire/d2906de347a160f38bc0b7ca57721328
  //  https://bl.ocks.org/adamjanes/6cf85a4fd79e122695ebde7d41fe327f
  // Map and projection
  // set map projection
  let projection = d3.geoNaturalEarth()
                    .scale(width / 2 / Math.PI)
                    .translate([width / 2, height / 2])

  // generate projetion
  let path = d3.geoPath()
               .projection(projection);

  // Data and mapColor scale
  let data = d3.map();

  // Draw the map
  svgMap.append("g")
        .attr("class", "countries")
        .selectAll("path")
        .data(map.features)
        .enter().append("path")
        .attr("d", path)
        .attr('id', d => { return d.id; })

  // do map coloring
  updateMap(trade[year], map)
};

// function to find info for tooltip
function toolInfo(country, tradeYear) {
  let name = country.properties.name;

  if (tradeYear.hasOwnProperty(country.id)) {
    if (tradeYear[country.id].share.hasOwnProperty('xprt')) {

      return name + ", " + Math.floor(tradeYear[country.id].share.xprt * 100) / 100 + "%";
    };
  } else {
    return name + "% unknown";
  };
};

// find minimum and maximum export values with all partners
function minMax (data, mapCountries) {

  let min = 0;
  let max = 0;

  for (let country in data) {
    if (data.hasOwnProperty(country)) {

    // find minima and maxima of partners share in British export
      if (data[country].share.xprt < min) {
        min = data[country].share.xprt;
      } else if (data[country].share.xprt > max)  {
        if (mapCountries.indexOf(country) >= 0 ) {
            max = data[country].share.xprt;
        };
      };
    };
  };
  return [min, max];
};

function updateMap(data, map) {

  let mapCountries = [];
  for (let i in map.features) {
    mapCountries.push(map.features[i].id)
  }

  // find ranges in min and maximum
  let range = minMax(data, mapCountries);
  let min = range[0];
  let max = range[1];

  // determine colorDomain
  let colorDomain = [];
  for (let i = 0; i < 10; i++) {
    let element = ((i * max) / 10);
    if (i == 0) {
      element = 0.1;
    };
    colorDomain.push(element / 100)
  }

  // mapColor for country
  let mapColor  = d3.scaleThreshold()
                     .range(colorbrewer.YlGnBu[9])
                     .domain(colorDomain);

  // create legend
  column("d3.scaleThreshold", mapColor);

  svgMap.selectAll("path").
  style("fill", d => {
    if (d.id == 'GBR') {
      return mapColor(0)
    } else if (data.hasOwnProperty(d.id)) {
      if (data[d.id].share.hasOwnProperty('xprt')){
        return mapColor(data[d.id].share.xprt / 100);
      } else {
        return "grey"
      }
    } else {
      return "grey"
    };
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
    let info = toolInfo(d, data)
    tooltip
      .html(info)
      .style('left', d3.event.pageX + 'px')
      .style('top', d3.event.pageY - 28 + 'px');
  })
  .on('mouseout', d => {
    d3.select("#" + d.id).style("fill", d => {
      if (d.id == 'GBR') {
        return mapColor(0)
      } else if (data.hasOwnProperty(d.id)) {
        if (data[d.id].share.hasOwnProperty('xprt')){
          return mapColor(data[d.id].share.xprt / 100);
        } else {
          return "grey"
        }
      } else {
        return "grey"
      };
    })
    tooltip
      .transition()
      .duration(500)
      .style('opacity', 0);
  })
  .on('click', d => {
    if (GDP.hasOwnProperty(d.id) && TRADE[YEAR].hasOwnProperty(d.id)) {
      COUNTRY = d.id;

      barChartGenerator(GDP[COUNTRY][YEAR], COUNTRIES[COUNTRY]);
      sunBurstGenerator(TRADE[YEAR][COUNTRY].trade)
    } else {
      tooltip
        .html("Oops, no info available")
        .style('left', d3.event.pageX + 'px')
        .style('top', d3.event.pageY - 28 + 'px');
    }
  });
};

function column(title, scale) {
  var legend = d3.legendColor()
    .labelFormat(d3.format(".2f"))
    .labels(d3.legendHelpers.thresholdLabels)
    .cells(10)
    .scale(scale);

  svgMap.append("g")
    .attr("class", "legend")
    .attr("transform", "translate(5 , " + height / 4 + ")");

  svgMap.select(".legend")
    .call(legend);
};
