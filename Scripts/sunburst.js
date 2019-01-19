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

const color = d3.scaleOrdinal(d3.schemeCategory10 );;

//
function sunBurstGenerator(obj) {
  // transform obj to readable data for hierarchy function
  let data = childrenObject(obj);


  // Find the root node, calculate the node.value, and sort our nodes by node.value
  root = d3.hierarchy(data)
      .sum(function (d) { return d.size; })
      .sort(function (a, b) { return b.value - a.value; });

  // Calculate the size of each arc; save the initial angles for tweening.
  partition(root);
  arc = d3.arc()
      .startAngle(function (d) { d.x0s = d.x0; return d.x0; })
      .endAngle(function (d) { d.x1s = d.x1; return d.x1; })
      .innerRadius(function (d) { return d.y0; })
      .outerRadius(function (d) { return d.y1; });

  // Add a <g> element for each node; create the slice variable since we'll refer to this selection many times
  slice = g.selectAll('g.node').data(root.descendants(), function(d) { return d.data.name; });
  newSlice = slice.enter().append('g').attr("class", "node").merge(slice);
  slice.exit().remove();

  // Append <path> elements and draw lines based on the arc calculations. Last, color the lines and the slices.
  slice.selectAll('path').remove();

  newSlice.append('path').attr("display", function (d) { return d.depth ? null : "none"; })
      .attr("d", arc)
      .style('stroke', '#fff')
      .style("fill", function (d) { return color((d.children ? d : d.parent).data.name); });

  // Populate the <text> elements with our data-driven titles.
  slice.selectAll('text').remove();
  newSlice.append("text")
      .attr("transform", function(d) {
          return "translate(" + arc.centroid(d) + ")rotate(" + computeTextRotation(d) + ")"; })
      .attr("dx", "-20")
      .attr("dy", ".5em")
      .text(function(d) { return d.parent ? d.data.name : "" });

  newSlice.on("click", highlightSelectedSlice);
};


// Redraw the Sunburst Based on User Input
function highlightSelectedSlice(c,i) {

    clicked = c;
    var rootPath = clicked.path(root).reverse();
    rootPath.shift(); // remove root node from the array

    newSlice.style("opacity", 0.4);
    newSlice.filter(function(d) {
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

    // Avoid upside-down labels
    // return (angle < 120 || angle > 270) ? angle : angle + 180;  // labels as rims
    return (angle < 180) ? angle - 90 : angle + 90;  // labels as spokes
}

function childrenObject(jsonObj, name){
  // transform an object compatible to d3 hierarchy function

  // make new object and keep track of keys in current object
  let obj = {};
  let count = 0;

  // add object name
  obj['name'] = name;

  // iterate over keys in object
  for (let key in jsonObj) {

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
