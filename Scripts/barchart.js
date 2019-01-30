// source: https://alignedleft.com/tutorials/d3/making-a-bar-chart

const svgBar = d3.select('#bar')
                  .attr('width', width)
                  .attr('height', height)
                  .append('g');

// create info button
// add question mark to info button
const barInfo = 'The Bar chart shows sectors comprising GDP in the partner country. This view offers a comparison between the sectors composing trade flows and significant value producing parts of the economy in the partner country. The user can hoover over the Bar Chart to view absolute values.'

svgBar.append('text')
      .attr('transform', 'translate(' + (width - 30)+ ' , 30)')
      .text('?')
      .attr('text-anchor', 'middle')
      .attr('fill', 'white')
      .style('font-size', '30px');

svgBar.append('rect')
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
          .html(barInfo)
          .style('left', d3.event.pageX - 100 + 'px')
          .style('top', d3.event.pageY - 28 + 'px');
      })
      .on('mouseout', d => {

        tooltip
          .transition()
          .duration(500)
          .style('opacity', 0);
      });

let duration = 1000;

svgBar.append('g')
    .attr('transform', 'translate(0, ' + (height - padding) + ')')
    .attr('class', 'x axis');

// draw y axis
let yAxisBar = svgBar.append('g')
       .attr('class', 'y axis')
       .attr('transform', 'translate(' + padding * 2 + ', 0)');

// calculates the ordinal scale for a discrete variable
function ordinalScaling(variable) {
  let ordinalRange = [];
  let length = variable.length;
  for (let i = 0; i < length + 1; i++) {
    let coordinate =  padding * 2 + i * (width - padding * 3) / length;
    ordinalRange.push(coordinate);
  };

  ordinalScaler = d3.scaleOrdinal()
          .domain(variable)
          .range(ordinalRange);
  return ordinalScaler;
};

function barChartGenerator() {

    // creates a title
    svgBar.select('.title').remove()

    // check if dollar or perctentage values of gdp components are presented
    let type;
    if (GDP[COUNTRY][YEAR].hasOwnProperty('GDP')) {
      type = ' in dollars';
    } else {
      type = ' in percentage';
    };

    svgBar.append('text')
          .attr('class', 'title')
          .attr('x', (width / 2))
          .attr('y', 20)
          .attr('text-anchor', 'middle')
          .attr('fill', 'black')
          .style('font-size', '18px')
          .text('GDP components of ' + COUNTRIES[COUNTRY] + type);

    let data = obsGenerator();
    let obs = data[0];
    let sectors = data[1];

    //  get scalers
    let yScale = d3.scaleLinear()
        .range([height - padding, 0 + padding])
        .domain([0, d3.max(obs)]);

    // source interactivity: https://stackoverflow.com/questions/40571511/dynamically-updating-d3-bar-chart
    yAxisBar.transition()
          .delay(800)
          .duration(750)
          .call(d3.axisLeft(yScale)
                  .ticks(13)
                  .tickFormat(d3.formatPrefix('$,.0f', 1e6)));

    let xScale = ordinalScaling(sectors);
    let xAxis = d3.axisBottom(xScale);
    let bars = svgBar.selectAll('.bar')
                      .data(obs);

    bars.enter()
        .append('rect')
        .attr('class', 'bar')
        .attr('fill', 'darkblue')
        .attr('width', (width - padding * 2) / obs.length)
        .attr('height', 0)
        .attr('y', height)
        .on('mouseover', d => {

          // make tooltip
          tooltip
            .transition()
            .duration(200)
            .style('opacity', 0.9);

          tooltip
            .html('$'+ Math.round(d).toLocaleString() +' ')
            .style('left', d3.event.pageX + 'px')
            .style('top', d3.event.pageY - 28 + 'px');
        })
        .on('mouseout', d => {
          tooltip
            .transition()
            .duration(500)
            .style('opacity', 0);
        })
        .merge(bars)
        .transition()
        .delay(800)
        .duration(duration)
        .attr('height', (d, i) => {
            return height - padding - yScale(d);
        })
        .attr('y', (d, i) => {
            return yScale(d);
        })
        .attr('width', (width - padding * 4) / obs.length)
        .attr('x', (d, i) =>  {
           return padding * 2 + 1 + i * ((width - padding * 3)  / obs.length);
        })

    bars.exit()
        .transition()
        .duration(duration)
        .attr('height', 0)
        .attr('y', height)
        .remove();

    svgBar.select('.x.axis')
        .transition()
        .duration(duration)
        .call(xAxis)

        // source for rotation: https://bl.ocks.org/mbostock/4403522
        .selectAll('text')
        .attr('y', 2)
        .attr('x', 7)
        .attr('dy', '.35em')
        .attr('transform', 'rotate(30)')
        .style('text-anchor', 'start');
};

function obsGenerator() {
  let obs;
  let sectors;

  // use absolute values of sectors in $
  let gdp = GDP[COUNTRY][YEAR]['GDP'];

  // make copy of data
  let data = $.extend({}, GDP[COUNTRY][YEAR]);
  delete data.GDP;

  // get sectors and obs from data
  sectors = Object.keys(data);
  obs = Object.values(data);

  // transform obs to absolute values
  for (let i = 0; i < obs.length; i++) {
    obs[i] = obs[i] * gdp / 100;
  };
  return [obs, sectors];
};
