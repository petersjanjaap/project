// width, height and padding for svgs
const width = 800;
const height = 600;
const padding = 60;

// global year
let YEAR = 2000;
let COUNTRY = "DEU";

// create letiable for all years
let years = [];
for (let year = 2000; year < 2018; year++) {
  years.push(year);
};

// create slider
let sliderStep = d3.sliderBottom()
                    .min(Math.min(...years))
                    .max(Math.max(...years))
                    .width(width * 0.9)
                    .ticks(years.length)
                    .step(1)
                    .default(0.015)
                    .on('onchange', d => {

                      // update year based on user selection
                      YEAR = d;
                      barChartGenerator(trade[YEAR][COUNTRY].trade.xprt, countries[COUNTRY]);
                      sunBurstGenerator(trade[YEAR][COUNTRY].trade)
                      d3.select('p#value-step').text(d);
                    });

let slider = d3.select('#slider')
              .attr("class", "slider")
              .attr('width', width)
              .attr('height', 150);

let gStep =   slider.append('g')
                    .attr('transform', 'translate(30,70)');

slider.append("text")
      .attr("x", (width / 2))
      .attr("y", padding)
      .attr("text-anchor", "middle")
      .attr("fill", "black")
      .style("font-size", "34px")
      .text("Select year from slider");

gStep.call(sliderStep);

// obtain datasets
let trade = d3.json("dataset.json");
let countries = d3.json("countries.json");
let gdp = d3.json("gdp.json");

// load map and datasets
let promises = [d3.json("http://enjalot.github.io/wwsd/data/world/world-110m.geojson"),
                trade, countries, gdp];

Promise.all(promises).then(response => {

  //  save responses
  map = response[0];
  trade = response[1];
  countries = response[2];
  gdp = response[3];

  // generate map
  mapGenerator(map, trade, countries, YEAR);

  // generate sun burst
  sunBurstGenerator(trade[YEAR][COUNTRY].trade);

  // generate bar chart
  barChartGenerator(trade[YEAR][COUNTRY].trade.xprt, countries[COUNTRY]);

  // update function for sunburst
  d3.select('#map')
    .selectAll('path')
    .on('click', function(d,i) {
      COUNTRY = d.id
      barChartGenerator(trade[YEAR][COUNTRY].trade.xprt, countries[COUNTRY]);
      sunBurstGenerator(trade[YEAR][COUNTRY].trade)
    });
});
