// source: https://bl.ocks.org/denjn5/6d161cb24695c8df503f9109045ea629

// Size our <svg> element, add a <g> element, and move translate 0,0 to the center of the element.
const g = d3.select('#sun')
    .attr('width', width)
    .attr('height', height)
    .append('g')
    .attr('transform', 'translate(' + width / 2 + ',' + height / 2 + ')');

const radius = Math.min(width, height) / 2 - padding;

// Create our sunburst data structure and size it.
const partition = d3.partition()
    .size([2 * Math.PI, radius]);

const color = d3.scaleOrdinal(colorbrewer.YlGnBu[5] );;

function sunBurstGenerator() {

  d3.select('#sun').select('.title').remove()
  d3.select('#sun').append('text')
        .attr('class', 'title')
        .attr('x', (width / 2))
        .attr('y', 30)
        .attr('text-anchor', 'middle')
        .attr('fill', 'black')
        .style('font-size', '24px')
        .text('Components of Export and Import with ' + COUNTRIES[COUNTRY]);

  // transform obj to readable data for hierarchy function
  let data = childrenObject(TRADE[YEAR][COUNTRY].trade);

  // Find the root node, calculate the node.value, and sort our nodes by node.value
  root = d3.hierarchy(data)
      .sum(d => { return d.size; })
      .sort((a, b) => { return b.value - a.value; });

  // Calculate the size of each arc; save the initial angles for tweening.
  partition(root);
  arc = d3.arc()
      .startAngle(d => { d.x0s = d.x0; return d.x0; })
      .endAngle(d => { d.x1s = d.x1; return d.x1; })
      .innerRadius(d => { return d.y0; })
      .outerRadius(d => { return d.y1; });

  // Add a <g> element for each node; create the slice variable since we'll refer to this selection many times
  slice = g.selectAll('g.node').data(root.descendants(), d => { return d.data.name; });
  newSlice = slice.enter().append('g').attr("class", "node").merge(slice);
  slice.exit().remove();

  // Append <path> elements and draw lines based on the arc calculations. Last, color the lines and the slices.

  d3.select('#sun').selectAll('path').remove();

  newSlice.append('path').attr("display", d => { return d.depth ? null : "none"; })
      .attr("d", arc)
      .style("fill", "white")
      .transition()
      .duration(750)
      .style('stroke', '#fff')
      .style("fill", d => { return color((d.children ? d : d.parent).data.name); });

  // Populate the <text> elements with our data-driven titles.
  slice.selectAll('text')
  .remove();

  newSlice.append("text")
  .style("fill", "white")
  .transition()
  .duration(750)
      .attr("transform", d => {
          return "translate(" + arc.centroid(d) + ")rotate(" + computeTextRotation(d) + ")"; })
      .attr("dx", "-30")
      .attr("dy", ".3em")
      .style("fill", "white")
      .text(d => {

        // only display text if space available
        if (d.value / root.value > 0.01){
          return (d.parent ? d.data.name : "")
        };
      })
  newSlice.on("click", highlightSelectedSlice);
  newSlice.on('mouseover', d => {
    // make tooltip
    tooltip
      .transition()
      .duration(200)
      .style('opacity', 0.9);

    tooltip
      .html(""+ d.data.name + ": $"+ Math.round(d.value).toLocaleString() +" ")
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


// Redraw the Sunburst Based on User Input
function highlightSelectedSlice(c,i) {

    clicked = c;
    var rootPath = clicked.path(root).reverse();
    rootPath.shift(); // remove root node from the array

    newSlice.style("opacity", 0.4);
    newSlice.filter(d => {
        if (d === clicked && d.prevClicked) {
            d.prevClicked = false;
            newSlice.style("opacity", 1);
            return true;

        } else if (d === clicked) {
            d.prevClicked = true;
            return true;
        } else {
            d.prevClicked = false;
            return (rootPath.indexOf(d) >= 0);
        }
    })
        .style("opacity", 1);

    d3.select("#sidebar").text("another!");

};

function arcTweenPath(a, i) {

    var oi = d3.interpolate({ x0: a.x0s, x1: a.x1s }, a);

    function tween(t) {
        var b = oi(t);
        a.x0s = b.x0;
        a.x1s = b.x1;
        return arc(b);
    }

    return tween;
}

/**
 * When switching data: interpolate the text centroids and rotation.
 */
function arcTweenText(a, i) {

    var oi = d3.interpolate({ x0: a.x0s, x1: a.x1s }, a);
    function tween(t) {
        var b = oi(t);
        return "translate(" + arc.centroid(b) + ")rotate(" + computeTextRotation(b) + ")";
    }
    return tween;
}

/**
 * Calculate the correct distance to rotate each label based on its location in the sunburst.
 */
function computeTextRotation(d) {
    var angle = (d.x0 + d.x1) / Math.PI * 90;

    // set labels as spokes
    return (angle < 180) ? angle - 90 : angle + 90;
}

function childrenObject(jsonObj, name){
  // transform an object compatible to d3 hierarchy function

  // make new object and keep track of keys in current object
  let obj = {};
  let count = 0;

  // add object name
  obj['name'] = name;

  // iterate over keys in object except total components
  for (let key in jsonObj) {
    if (key == "Total") {
      continue;
    }
    // count key iterations
    count += 1;

    // add list to hold children for first iteration
    if (count == 1){
      obj['children'] = [];
    };

    // generate child object
    let children = {};

    // check if underlying key has value
    if (jsonObj[key]) {

      // check if this value is an object (values don't contain strings or arrays)
      let c = 0;
      for (let keys in jsonObj[key]) {
        c += 1;
        continue;
      }

      // if so use recursion to add new children to current children
      if (c > 0) {

        children = childrenObject(jsonObj[key], key);

        obj['children'].push(children);
      }

      // else bottom value has been reached
      else {

        // create bottom child
        children =
        {
          name: key,
          size: jsonObj[key]
        };

        obj['children'].push(children)
      };
    }

    // else underlying value is missing, but bottom has been reached
    else {
      // create bottom child
      children =
      {
        name: key,
        size: jsonObj[key]
      };

      obj['children'].push(children);

    };
  };

  // return finalised object
  return obj;
};
