// create SVG element for map
let svgLine = d3.select('#line')
              .attr('width', width)
              .attr('height', height)
              .append("g")

let xAxisLine = svgLine.append("g")
                    .attr("class", "x axis")
                    .attr("transform", "translate(0," + (height - padding)+ ")")
// draw y axis
let yAxis = svgLine.append("g")
               .attr("class", "y axis")
               .attr("transform", "translate(" + padding + ", 0)");;
               console.log('test')

function graph() {

  // remove old elements
  svgLine.select('.title').remove()
  svgLine.selectAll('path').remove()
  let data = getData()

  // add new title
  svgLine.append('text')
        .attr('class', 'title')
        .attr('x', (width / 2))
        .attr('y', 30)
        .attr('text-anchor', 'middle')
        .attr('fill', 'black')
        .style('font-size', '18px')
        .text('Export and Import from 2000 - 2017 with ' + COUNTRIES[COUNTRY]);

  let max = Math.max(d3.max(data, d => { return d.export; }), d3.max(data, d => { return d.import; }));

  // set the ranges
  let xScale = d3.scaleLinear()
                  .range([padding, width - padding])
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
  svgLine.append("path")
          .datum(data)
          .attr("class", "line")
          .style("stroke", "red")
          .attr("d", imLine)
          .call(transition);

  // Add the valueline path.
  svgLine.append("path")
          .datum(data)
          .attr("class", "line")
          .attr("d", exLine)
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
            .tickFormat(d3.formatPrefix("$,.0f", 1e6)));

};

function updateGraph() {
  svgLine.select('.line')
  .attr("d", exLine)
  .call(transition)
}
function getData() {
  let data = [];

  for(let year in TRADE) {
    let xprt;
    let mprt;
    if (Object.values(TRADE[year][COUNTRY].trade.hasOwnProperty('xprt'))) {
      xprt = Object.values(TRADE[year][COUNTRY].trade.xprt).reduce((a,b) => a + b, 0);
    } else {
      xprt = 0;
    }

    if (Object.values(TRADE[year][COUNTRY].trade.hasOwnProperty('mprt'))) {
      mprt = Object.values(TRADE[year][COUNTRY].trade.mprt).reduce((a,b) => a + b, 0);
    } else {
      mprt = 0;
    }

    data.push({year: year,
              export: xprt,
              import: mprt
            })
  };
  return data;
};

// https://bl.ocks.org/mbostock/5649592
function transition(path) {
    path.transition()
        .duration(2000)
        .attrTween("stroke-dasharray", tweenDash);
}
function tweenDash() {
    var l = this.getTotalLength(),
        i = d3.interpolateString("0," + l, l + "," + l);
    return function (t) { return i(t); };
}
