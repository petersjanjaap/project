// calculates the ordinal scale for a discrete variable
function ordinalScaling(variable) {

  // save info for scaling
  let coordinates = [];
  let length = variable.length;

  // add coordinates to range
  for (let i = 0; i <= length; i++) {
    let coordinate = padding + i * (width - padding * 3) / length;
    coordinates.push(coordinate);
  };

  // gen ordinal scaler
  ordinalScaler = d3.scaleOrdinal()
          .domain(variable)
          .range(coordinates);

  //  return scaler
  return ordinalScaler;
}

// generates linear scale for variable
function linearScaling(variable) {

  // create linear scaling
  let linearScaler = d3.scaleLinear()
         .domain([0, d3.max(variable, d => { return d; })])
         .range([height - padding, padding]);

  return linearScaler;
};

// draws bars on an svg
function barsGen(svg, obs, scaling){

  // define tooltip
  let tooltip = d3.select('body')
                .append('div')
                .attr('class', 'tooltip')
                .style('opacity', 0);

  // generate bars
  svg.selectAll("rect")
     .data(obs)
     .enter()
     .append("rect")
     .attr("class", "bar")
     .attr("x", (d, i) => {
        return padding * 2 + i * (width - padding * 3) / obs.length;
     })
     .attr("y", (d) => { return scaling(d); })
     .attr("width", (width - padding * 4) / obs.length )
     .attr("height", (d) => { return height - padding - scaling(d); })
     .style("fill", "darkblue")

     // source for tooltip: https://codepen.io/jackdbd/pen/NAEdBG
     .on('mouseover', d => {

       // make tooltip
       tooltip
         .transition()
         .duration(200)
         .style('opacity', 0.9);
          console.log(d)
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
};

function barChartGenerator(data, id) {

    // create SVG element for bars
    let svgBar = d3.select("#bar")
                .attr("class", "bar")
                .attr("width", width)
                .attr("height", height);

     // get sectors and respective observations
     let sectors = Object.getOwnPropertyNames(data);
     let obs = Object.values(data);

     // obtains ordinale scale for country on x axis using function
     let xScale = ordinalScaling(sectors);

     // obtains linear scale for gdp
     let yScale = linearScaling(obs);

     // draw bars on sgv using yScale
     barsGen(svgBar, obs, yScale);

     // draw y axis
     svgBar.append("g")
           .attr("transform", "translate(" + padding * 2 + ", 0)")
           .call(d3.axisLeft(yScale));

    // draw x axis
    svgBar.append("g")
       .attr("transform", "translate(" + padding + "," + (height - padding) + ")")
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
    svgBar.append("text")
       .attr("class", "label")
       .attr("x", width / 2 )
       .attr("y", height - padding / 5)
       .text("Components of trade with " + id);


    // add label to y axis
    svgBar.append("text")
       .attr("class", "label")
       .attr("transform", "rotate(-90)")

       /*
       x and y coordinates are rotated, so x and y coordinates are vice
       versa entered
       */
       .attr("y", 10)
       .attr("x", 0 - height / 2)
       .attr("dy", ".35em")
       .style("text-anchor", "middle")
       .text("$ of trade in sector $");
};
