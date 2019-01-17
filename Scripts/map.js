
function mapGenerator(map, trade, countries, year) {

  // create SVG element for map
  let svgMap = d3.select("#map")
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

  // Define the div for the tooltip
  let tooltip = d3.select('body')
                .append('div')
                .attr('class', 'tooltip')
                .style('opacity', 0);

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

  let mapCountries = [];
  for (let i in map.features) {
    mapCountries.push(map.features[i].id)
  }

  // find minimum and maximum export values with all partners
  let min = 0;
  let max = 0;
  let maxcountry;

  for (let country in trade[year]) {
    if (trade[year].hasOwnProperty(country)) {

    // find minima and maxima of partners share in British export
      if (trade[year][country].share.xprt < min) {
        min = trade[year][country].share.xprt;
      } else if (trade[year][country].share.xprt > max)  {
        if (mapCountries.indexOf(country) >= 0 ) {
            max = trade[year][country].share.xprt;
        }
      }
    }
  }

  // mapColor for country
  let mapColor = d3.scaleThreshold()
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
        .style("fill", d => {
          if (d.id == 'GBR') {
            return ("green")
          } else if (trade[year].hasOwnProperty(d.id)) {
            if (trade[year][d.id].share.hasOwnProperty('xprt')){
              return mapColor(trade[year][d.id].share.xprt);
            }
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
          let info = toolInfo(d, trade[year])

          tooltip
            .html(info)
            .style('left', d3.event.pageX + 'px')
            .style('top', d3.event.pageY - 28 + 'px');
        })
        .on('mouseout', d => {
          d3.select("#" + d.id).style("fill", d => {
            if (d.id == 'GBR') {
              return ("green")
            } else if (trade[year].hasOwnProperty(d.id)) {

              return mapColor(trade[year][d.id].share.xprt);

            } else {
              return "grey"
            }
          })
          tooltip
            .transition()
            .duration(500)
            .style('opacity', 0);
        })
        .on('click', d => {

          COUNTRY = d.id;
        });

}

// function to find info for tooltip
function toolInfo(country, tradeYear) {
  let name = country.properties.name;

  if (tradeYear.hasOwnProperty(country.id)) {
    if (tradeYear[country.id].share.xprt) {

      return name + ", " + Math.floor(tradeYear[country.id].share.xprt * 100) / 100 + "%";
    };
  } else {
    return name + "% unknown";
  };
};
