const svgBar = d3.select("#bar")
                  .attr("width", width)
                  .attr("height", height)
                  .append("g");

let duration = 1000;

svgBar.append('g')
    .attr('transform', 'translate(0, ' + (height - padding) + ')')
    .attr('class', 'x axis');

// draw y axis
yAxis = svgBar.append("g")
       .attr("class", "y axis")
       .attr("transform", "translate(" + padding + ", 0)")


// calculates the ordinal scale for a discrete variable
function ordinalScaling(variable) {
  let ordinalRange = [];
  let length = variable.length;
  for (let i = 0; i < length + 1; i++) {
    let coordinate =  padding + i * (width - padding * 2) / length;
    ordinalRange.push(coordinate);
  };
  ordinalScaler = d3.scaleOrdinal()
          .domain(variable)
          .range(ordinalRange);
  return ordinalScaler;
};


function barChartGenerator(data) {

    // obtain data
    let obs = Object.values(data);
    let sectors = Object.keys(data);

    //  get scalers
    let yScale = d3.scaleLinear()
        .range([height - padding, 0 + padding])
        .domain([0, d3.max(obs)]);

    yAxis.transition().duration(750).call(d3.axisLeft(yScale));
    let xScale = ordinalScaling(sectors);

    let xAxis = d3.axisBottom(xScale);
    let bars = svgBar.selectAll(".bar")
        .data(obs);

    bars
        .enter()
        .append('rect')
        .attr('class', 'bar')
        .attr("fill", "darkblue")
        .attr('width', (width - padding * 2) / obs.length)
        .attr('height', 0)
        .attr('y', height)
        .merge(bars)
        .transition()
        .duration(duration)
        .attr("height", function(d, i) {
            return height - padding - yScale(d);
        })
        .attr("y", function(d, i) {
            return yScale(d);
        })
        .attr("width", (width - padding * 3) / obs.length)
        .attr("x", function(d, i) {
           return padding + i * ((width - padding * 2)  / obs.length);
        })

    bars
        .exit()
        .transition()
        .duration(duration)
        .attr('height', 0)
        .attr('y', height)
        .remove();

    svgBar.select('.x.axis')
        .transition()
        .duration(duration)
        .call(xAxis);

};
