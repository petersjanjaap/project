let radius = Math.min(width, height) / 2 - padding;
let color = d3.scaleOrdinal(d3.schemeBlues[9]);


function sunBurstGenerator(trade, data) {

  // format data and obtain vars
  let obj = childrenObject(data, "DEU");
  let radius = Math.min(width, height) / 2 - padding;
  let color = d3.scaleOrdinal(d3.schemeBlues[9]);

  // create primary g element
  let g = d3.select('#sun')
    .attr('width', height)
    .attr('height', height)
    .append('g')
    .attr('transform', 'translate(' + height / 2 + ',' + height / 2 + ')');

  // data strucure
  let partition = d3.partition()
      .size([2 * Math.PI, radius]);

  // find data root and sorts arc based on observed value
  let root = d3.hierarchy(obj)
                .sum(function (d) { return d.size; })
                .sort(function(a, b) { return b.value - a.value; });

  // size arcs
  partition(root);

  var arc = d3.arc()
              .startAngle(d => { return d.x0; })
              .endAngle(d => { return d.x1; })
              .innerRadius(d => { return d.y0; })
              .outerRadius(d => { return d.y1; });

  // generate slice variable
  var slice = g.selectAll('g')
    .data(root.descendants())
    .enter().append('g').attr('class', 'node');

    slice.append('path').attr('display', function (d) { return d.depth ? null : 'none'; })
      .attr('d', arc)
      .style('stroke', '#fff')
      .style('fill', function (d) { return color((d.children ? d : d.parent).data.name); });

      // source: https://bl.ocks.org/denjn5/e1cdbbe586ac31747b4a304f8f86efa5
      function arcTweenPath(a, i) {

        let oi = d3.interpolate({ x0: a.x0s, x1: a.x1s }, a);

        function tween(t) {
          let b = oi(t);
          a.x0s = b.x0;
          a.x1s = b.x1;
          return arc(b);
        }
        return tween;
      }


      // when switching data: interpolate the text centroids and rotation.

      function arcTweenText(a, i) {

        let oi = d3.interpolate({ x0: a.x0s, x1: a.x1s }, a);
        function tween(t) {
            let b = oi(t);
            return 'translate(' + arc.centroid(b) + ')rotate(' + computeTextRotation(b) + ')';
        }
        return tween;
      }

      function computeTextRotation(d) {
          let angle = (d.x0 + d.x1) / Math.PI * 90;

          // format text as spokes
          return (angle < 180) ? angle - 90 : angle + 90;
      }

  // put labels in arcs
  g.selectAll('.node')
      .append('text')
      .attr('transform', d =>  {
          return 'translate(' + arc.centroid(d) + ')rotate(' + computeTextRotation(d) + ')'; })
      .attr('dx', '-20')
      .attr('dy', '.5em')
      .text(d => { return d.parent ? d.data.name : '' });

  // update function for sunburst
  d3.select("#map")
    .selectAll("path")
    .on('click', function(d,i) {

      // generate new object and root
      let obj = childrenObject(trade[2017][d.id].trade);

      // find data root and sorts arc based on observed value
      let root = d3.hierarchy(obj)
                    .sum(function (d) { return d.size; })
                    .sort(function(a, b) { return b.value - a.value; })

    d3.select("#sun").transition().duration(750)..exit()
          .style("background", "red")
        .transition()
          .style("opacity", 0)
          .remove();
    });
};

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
