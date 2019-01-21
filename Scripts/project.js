// width, height and padding for svgs
const width = 700;
const height = 500;
const padding = 60;

// global year
let YEAR = 2000;
let COUNTRY = "DEU";
let GDP;
let TRADE;
let COUNTRIES;

// create variable for all years
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
                      updateMap(TRADE[YEAR], map)
                      barChartGenerator(GDP[COUNTRY][YEAR], COUNTRIES[COUNTRY]);
                      sunBurstGenerator(TRADE[YEAR][COUNTRY].trade)
                      d3.select('p#value-step').text(d);
                    });

let slider = d3.select('#slider')
              .attr("class", "slider")
              .attr('width', width)
              .attr('height', 150);

let gStep =   slider.append('g')
                    .attr('transform', 'translate(30,70)');


// Define the div for the tooltip
let tooltip = d3.select('body')
              .append('div')
              .attr('class', 'tooltip')
              .style('opacity', 0);

slider.append("text")
      .attr("x", (width / 2))
      .attr("y", padding)
      .attr("text-anchor", "middle")
      .attr("fill", "black")
      .style("font-size", "34px")
      .text("Select year from slider");

gStep.call(sliderStep);

// obtain datasets
TRADE = d3.json("dataset.json");
COUNTRIES = d3.json("COUNTRIES.json");
GDP = d3.json("GDP.json");

// load map and datasets
let promises = [d3.json("http://enjalot.github.io/wwsd/data/world/world-110m.geojson"),
                TRADE, COUNTRIES, GDP];

Promise.all(promises).then(response => {

  //  save responses
  map = response[0];
  TRADE = response[1];
  COUNTRIES = response[2];
  GDP = response[3];

  // generate map
  mapGenerator(map, TRADE, COUNTRIES, YEAR);

  // generate sun burst
  sunBurstGenerator(TRADE[YEAR][COUNTRY].trade);

  // generate bar chart
  barChartGenerator(GDP[COUNTRY][YEAR], COUNTRIES[COUNTRY]);
});
