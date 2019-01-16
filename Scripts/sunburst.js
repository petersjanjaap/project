
function computeTextRotation(d) {
    var angle = (d.x0 + d.x1) / Math.PI * 90;  // <-- 1

    // Avoid upside-down labels
    // return (angle < 90 || angle > 270) ? angle : angle + 180;  // <--2 "labels aligned with slices"

    // Alternate label formatting
    return (angle < 180) ? angle - 90 : angle + 90;  // <-- 3 "labels as spokes"
}


function sunBurstGenerator(data) {

  // create SVG element for Sun
  var svgSun = d3.select("body")
              .append("svg")
              .attr("class", "Sun")
              .attr("width", width)
              .attr("height", height);

  // creates a title
  svgSun.append("text")
        .attr("class", "Sun")
        .attr("x", (width / 2))
        .attr("y", padding * 0.4)
        .attr("text-anchor", "middle")
        .attr("fill", "black")
        .style("font-size", "20px")
        .text("Partner country components of GDP");

  // format data
  data = childrenObject(data);

  var radius = Math.min(width, height) / 2;

  var color = d3.scaleOrdinal(d3.schemeBlues[9]);

  // Create primary <g> element
  var g = svgSun
      .append('g')
      .attr('transform', 'translate(' + width / 2 + ',' + height / 2 + ')');

  // Data strucure
  var partition = d3.partition()
      .size([2 * Math.PI, radius]);

  // Find data root
  var root = d3.hierarchy(data)
      .sum(function (d) { return d.size});

  // Size arcs
  partition(root);
  var arc = d3.arc()
              .startAngle(function (d) { return d.x0 })
              .endAngle(function (d) { return d.x1 })
              .innerRadius(function (d) { return d.y0 })
              .outerRadius(function (d) { return d.y1 });

  // Put it all together
  g.selectAll('path')
      .data(root.descendants())
      .enter().append('g').attr("class", "node")
      .append('path')
      .attr("display", function (d) { return d.depth ? null : "none"; })
      .attr("d", arc)
      .style('stroke', '#fff')
      .style("fill", function (d) { return color((d.children ? d : d.parent).data.name); });

  // put labels in arc
  g.selectAll(".node")  // <-- 1
      .append("text")  // <-- 2
      .attr("transform", function(d) {
          return "translate(" + arc.centroid(d) + ")rotate(" + computeTextRotation(d) + ")"; }) // <-- 3
      .attr("dx", "-20")  // <-- 4
      .attr("dy", ".5em")  // <-- 5
      .text(function(d) { return d.parent ? d.data.name : "" });
};

function childrenObject(jsonObj, name){

  // make new object and keep track of keys in old object
  var obj = {};
  var count = 0;

  // add object name
  obj['name'] = name;

  // iterate over keys in object
  for (var key in jsonObj) {

    // count key iterations
    count += 1;

    // add list to hold children for first iteration
    if (count == 1){
      obj['children'] = [];
    }

    // generate child object
    var children = {};

    // check if underlying key has value
    if (jsonObj[key]) {

      // check if this value is an object (values don't contain strings or arrays)
      var c = 0;
      for (var keys in jsonObj[key]) {
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
      }
    }

    // else underlying value is missing, but bottom has been reached
    else {
      // create bottom child
      children =
      {
        name: key,
        size: jsonObj[key]
      };

      obj['children'].push(children)

    }
  }

  // return finalised object
  return obj;
}
