// source: http://bl.ocks.org/d3noob/7030f35b72de721622b8

// create SVG element for map
let svgLine = d3.select('#line')
              .attr('width', width)
              .attr('height', height)
              .append('g');

// create info button
// add question mark to info button
let lineInfo = 'The Line Chart shows the total $ values of export and import between the U.K. and the partner country over the years 2000-2017. This graph is updated automatically after you selects a new partner country. Import is displayed in orange and export in red.'
svgLine.append('text')
      .attr('transform', 'translate(' + (width - 30)+ ' , 30)')
      .text('?')
      .attr('text-anchor', 'middle')
      .attr('fill', 'white')
      .style('font-size', '30px');

svgLine.append('rect')
      .attr('transform', 'translate(' + (width - 49)+ ' , 0)')
      .attr('width', 40)
      .attr('height', 40)
      .attr('opacity', 0.3)
      .on('mouseover', d => {

        // make tooltip
        tooltip
          .transition()
          .duration(200)
          .style('opacity', 0.9);

        // insert info tooltip
        tooltip
          .html(lineInfo)
          .style('left', d3.event.pageX - 100 + 'px')
          .style('top', d3.event.pageY - 28 + 'px');
      })
      .on('mouseout', d => {

        tooltip
          .transition()
          .duration(500)
          .style('opacity', 0);
      });

// create legend for export
svgLine.append('rect')
      .attr('transform', 'translate(5 , ' + height / 90 + ')')
      .attr('width', 20)
      .attr('height', 20)
      .attr('fill', 'red');

svgLine.append('text')
      .attr('transform', 'translate(25 , ' + (height / 90 + 15) + ')')
      .style('font-size', '8px')
      .text('Export');

// create legend for import
svgLine.append('rect')
      .attr('transform', 'translate(5 , ' + height / 15 + ')')
      .attr('width', 20)
      .attr('height', 20)
      .attr('fill', 'orange');

svgLine.append('text')
      .attr('transform', 'translate(25 , ' + (height / 15 + 15) + ')')
      .style('font-size', '8px')
      .text('Import');

let xAxisLine = svgLine.append('g')
                    .attr('class', 'x axis')
                    .attr('transform', 'translate(0,' + (height - padding)+ ')');

// draw y axis
let yAxis = svgLine.append('g')
               .attr('class', 'y axis')
               .attr('transform', 'translate(' + padding + ', 0)');

// update graph
function graph() {

  // remove old elements
  svgLine.select('.title').remove();
  svgLine.selectAll('path').remove();

  // add new title
  svgLine.append('text')
        .attr('class', 'title')
        .attr('x', (width / 2))
        .attr('y', 20)
        .attr('text-anchor', 'middle')
        .attr('fill', 'black')
        .style('font-size', '16px')
        .text('Total Export and Import in $ from 2000 - 2017 with '
              + COUNTRIES[COUNTRY]);

  // get data and find maximum observation
  let data = getData();
  let max = Math.max(d3.max(data, d => { return d.export; }),
                     d3.max(data, d => { return d.import; }));

  // set the ranges
  let xScale = d3.scaleLinear()
                  .range([padding + 1, width - padding])
                  .domain(d3.extent(data, d => { return d.year;}));

  let yScale = d3.scaleLinear()
                  .domain([0, max])
                  .range([height - padding, padding]);

  // define the line
  let exLine = d3.line()
                    .x(d => { return xScale(d.year); })
                    .y(d => { return yScale(d.export); });

  let imLine = d3.line()
                    .x(d => { return xScale(d.year); })
                    .y(d => { return yScale(d.import); });

  // Add the valueline path.
  svgLine.append('path')
          .datum(data)
          .attr('class', 'line')
          .style('stroke', 'red')
          .attr('d', imLine)
          .call(transition);

  // Add the valueline path.
  svgLine.append('path')
          .datum(data)
          .attr('class', 'line')
          .attr('d', imLine)
          .style('stroke', 'orange')
          .attr('d', exLine)
          .call(transition);

  // Add the X Axis
  xAxisLine.transition()
            .duration(750)
            .call(d3.axisBottom(xScale)
                    .tickFormat(d3.format('y')));

  // Add the Y Axis
  yAxis.transition()
          .duration(750)
          .call(d3.axisLeft(yScale)
                  .ticks(13)
                  // source https://bl.ocks.org/mbostock/9764126
                  .tickFormat(d3.formatPrefix('$,.0f', 1e5)));
};

// updates graph
function updateGraph() {
  svgLine.select('.line')
  .attr('d', exLine)
  .call(transition);
};

// gets data on gdp for country over all yearss
function getData() {
  let data = [];

  for(let year in TRADE) {
    let xprt;
    let mprt;

    // check if data in year for country is available
    if (TRADE[year].hasOwnProperty([COUNTRY])) {
      let info = TRADE[year][COUNTRY].trade;

      // check if data on export is available
      if (info.hasOwnProperty('xprt')) {
        xprt = Object.values(info.xprt).
        reduce((a,b) => a + b, 0);
      } else {
        xprt = 0;
      };
      // check if data on import is available
      if (info.hasOwnProperty('mprt')) {
        mprt = Object.values(info.mprt)
                            .reduce((a,b) => a + b, 0);
      } else {
        mprt = 0;
      };

    // if not fill in zero values
    } else {
      xprt = 0;
      mprt = 0;
    };

    // append data
    data.push({year: year,
              export: xprt,
              import: mprt
            });
  };
  return data;
};

// https://bl.ocks.org/mbostock/5649592
function transition(path) {
    path.transition()
        .delay(100)
        .duration(1500)
        .attrTween('stroke-dasharray', tweenDash);
}
function tweenDash() {
    var l = this.getTotalLength(),
        i = d3.interpolateString('0,' + l, l + ',' + l);
    return function (t) { return i(t); };
}
