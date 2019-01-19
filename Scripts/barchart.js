// source: https://bl.ocks.org/tillg/14a9b1a363e82223c764551e977405f5

const svgBar = d3.select("#bar")
                  .attr("width", width)
                  .attr("height", height)
                  .append("g");
const BAR_WIDTH = 50;
const BAR_GAP = padding / 10;

function barChartGenerator(data) {

  let obs = Object.values(data);
  // generate scale for bar chart
  let scale = d3.scaleLinear()
                  .domain([0, d3.max(obs)])
                  .range([0, height - padding]);
  const t = d3.transition()
      .duration(750);

  const bar = svgBar.selectAll("g")
    .data(obs);

  // EXIT section
  bar
    .exit()
      .remove();

  // UPDATE section
  bar
    .transition(t)
      .attr("transform", (d, i) => { return `translate(${i * (BAR_WIDTH + BAR_GAP)},${height - scale(d)})`});

  bar.select("rect")
    .transition(t)
      .attr("height", height);

  bar.select("text")
    .transition(t)
      .tween("text", function(d) {
        const v0 = this.textContent || "0";
        const v1 = d;
        const i = d3.interpolateRound(v0, v1);
        return t => this.textContent = i(t);
      });

  // ENTER section
  const barEnter = bar
    .enter().append("g")
      .attr("transform", (d, i) => {`translate(${i * (BAR_WIDTH + BAR_GAP)},${height - padding})`});

  barEnter
    .transition(t)
      .attr("transform", (d, i) => {`translate(${i * (BAR_WIDTH + BAR_GAP)},${height - scale(d)})`});

  const rect = barEnter.append("rect")
      .attr("x", 0)
      .attr("y", 0)
      .attr("width", BAR_WIDTH)
      .attr("height", 0);

  rect
    .transition(t)
      .attr("height", height);

  const text = barEnter.append("text")
      .text(d => d)
      .attr("text-anchor", "middle")
      .attr("dx", BAR_WIDTH / 2)
      .attr("dy", -2);

};
