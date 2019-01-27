// create SVG element for map
let svgMap = d3.select('#map')
              .attr('width', width * 1.4)
              .attr('height', height * 1.4)


// create legend for gbr and countries with unknown data
svgMap.append('rect')
      .attr('transform', 'translate(5 , ' + height / 18 + ')')
      .attr('width', 20)
      .attr('height', 20)
      .attr('fill', 'gold')

svgMap.append('text')
      .attr('transform', 'translate(25 , ' + (height / 18 + 15) + ')')
      .style('font-size', '11px')
      .text('Great Britain')

// create legend for gbr and countries with unknown data
svgMap.append('rect')
      .attr('transform', 'translate(5 , ' + height / 8 + ')')
      .attr('width', 20)
      .attr('height', 20)
      .attr('fill', 'grey');

svgMap.append('text')
      .attr('transform', 'translate(25 , ' + (height / 8 + 15) + ')')
      .style('font-size', '11px')
      .text('Incomplete information')

function mapGenerator() {
  /*
  sources: http://bl.ocks.org/palewire/d2906de347a160f38bc0b7ca57721328
  https://bl.ocks.org/adamjanes/6cf85a4fd79e122695ebde7d41fe327f
  */

  // set map projection
  let projection = d3.geoNaturalEarth()
                    .scale(width / 1.25 / Math.PI)
                    .translate([width / 1.4, height / 1.4])

  // generate projetion
  let path = d3.geoPath()
               .projection(projection);

  // data and mapColor scale
  let data = d3.map();

  // draw the map
  svgMap.append('g')
        .attr('class', 'countries')
        .selectAll('path')
        .data(MAP.features)
        .enter().append('path')
        .attr('d', path)
        .attr('id', d => { return d.id; })

  // map coloring
  updateMap();
};

// updates map colors based on data
function updateMap() {

  // removes old title and creates new one
  svgMap.select('.title').remove()
  let flow;
  if (TRADE_FLOW === 'xprt') {
    flow = 'Export';
  } else {
    flow = 'Import';
  };
  svgMap.append('text')
        .attr('class', 'title')
        .attr('x', (width * 1.4 / 2))
        .attr('y', 30)
        .attr('text-anchor', 'middle')
        .attr('fill', 'black')
        .style('font-size', '34px')
        .text('Country share of UK ' + flow + ' in % in ' + YEAR);

  // find ranges in min and maximum
  let range = minMax();
  let min = range[0];
  let max = range[1];

  // determine colorDomain
  let colorDomain = [];
  for (let i = 0; i < 9; i++) {
    let element = ((i * max) / 9);
    colorDomain.push(element)
  };

  // mapColor for country
  let colorScheme;
  if (TRADE_FLOW === 'xprt') {
    colorScheme = colorbrewer.YlGnBu[9];
  } else {
    colorScheme = colorbrewer.YlOrBr[9];
  }

  // create colorscale
  MAPCOLOR = d3.scaleThreshold()
                     .range(colorScheme)
                     .domain(colorDomain);

  // create legend
  legend(colorDomain);
  svgMap.selectAll('path').
  style('fill', d => {return colorFiller(d)})
  .style('stroke', 'black')
  .style('stroke-width', 1.5)
  .style('opacity',0.8)
  .on('mouseover', d => {

    // make tooltip
    tooltip
      .transition()
      .duration(200)
      .style('opacity', 0.9);

    // insert info tooltip
    let info = toolInfo(d, TRADE[YEAR])
    tooltip
      .html(info)
      .style('left', d3.event.pageX + 'px')
      .style('top', d3.event.pageY - 28 + 'px');
  })
  .on('mouseout', d => {
    d3.select('#' + d.id).style('fill', d => {return colorFiller(d)})
    tooltip
      .transition()
      .duration(500)
      .style('opacity', 0);
  })
  .on('click', d => {
    if (d.id != 'GBR') {
      if (TRADE[YEAR].hasOwnProperty(d.id)) {

        // color selected country red
        d3.select('#' + COUNTRY).style('opacity', 1)

        COUNTRY = d.id;

        d3.select('#' + COUNTRY).style('opacity', 0.3)
        graph()
        barChartGenerator();
        sunBurstGenerator(TRADE[YEAR][COUNTRY].trade)

      } else {
        tooltip
          .html('Oops, no info available')
          .style('left', d3.event.pageX + 'px')
          .style('top', d3.event.pageY - 28 + 'px');
      }
    } else {
      tooltip
        .html('Please select a partner country')
        .style('left', d3.event.pageX + 'px')
        .style('top', d3.event.pageY - 28 + 'px');
    };
  });
};

// function to find info for tooltip
function toolInfo(country) {
  if (country.hasOwnProperty('properties')) {
    if (country.properties.hasOwnProperty('name')) {
      let name = country.properties.name;

      if (TRADE[YEAR].hasOwnProperty(country.id)) {
        if (TRADE[YEAR][country.id].share.hasOwnProperty([TRADE_FLOW])) {

          return name + ', ' +
          Math.floor(TRADE[YEAR][country.id].share[TRADE_FLOW] * 100)
          / 100 + '%';
        };
      }
      else {
          return name + '% unknown';
      };
  } else {
    return 'No info available';
  };

  } else {
    return 'No info available';
  };
};

// find minimum and maximum export values with all partners
function minMax () {

  let min = 0;
  let max = 0;

  // iterate over data in given year
  for (let country in TRADE[YEAR]) {

  // find minima and maxima of partners share in British trade
    let amount = TRADE[YEAR][country].share[TRADE_FLOW];
    if (amount < min) {
      min = amount;
    } else if (amount > max)  {

      // check if country is present on map
      if (MAPCOUNTRIES.indexOf(country) >= 0 ) {
          max = amount;
      };
    };
  };
  return [min, max];
};

// generate a legend
function legend(colorDomain) {

  // remove old legend
  svgMap.select('.legend').remove()

  // source: https://stackoverflow.com/questions/42009622/how-to-create-a-horizontal-legend
  let legendGroup = svgMap.append('g')
                       .attr('transform', 'translate(5 , ' + height / 4 + ')')
                       .attr('class', 'legend');


  let legend = legendGroup.selectAll('.legend')
        .data(colorDomain)
        .enter()
        .append('g')
        .attr('transform', (d, i)=>'translate(0,' + ((height - padding * 4)
                / colorDomain.length) * i + ')');

  let legendRects = legend.append('rect')
                          .attr('width', 20)
                          .attr('height', 20)
                          .attr('fill', (d,i) => {return MAPCOLOR(d)});

  let legendText = legend.append('text')
                         .attr('x', 20)
                         .attr('y', 18)
                         .style('font-size', '11px')
                         .text((d,i) => (d / 100).toLocaleString('en',
                            {style: 'percent'}));
};

// fills countries on map with color
function colorFiller(d) {

  // great britain is displayed in gold
  if (d.id == 'GBR') {
    return 'gold'
  } else if (TRADE[YEAR].hasOwnProperty(d.id)) {

    // check if data on trade flow for country in year is present
    if (TRADE[YEAR][d.id].share.hasOwnProperty([TRADE_FLOW])){
      return MAPCOLOR(TRADE[YEAR][d.id].share[TRADE_FLOW]);
    }

    // if no data on trade flow or country is available fill with grey
    else {
      return 'grey'
    }
  } else {
    return 'grey'
  };
};
