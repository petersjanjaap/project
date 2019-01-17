// width, height and padding for svgs
const width = screen.width / 1.3;
const height = screen.height / 1.5;
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
                    .width(width)
                    .ticks(years.length)
                    .step(1)
                    .default(0.015)
                    .on('onchange', d => {

                      // update year based on user selection
                      YEAR = d;
                      d3.select('p#value-step').text(d);
                    });

let gStep = d3.select('div#slider-step')
              .append('svg')
              .attr("class", "sliderf")
              .attr('width', width)
              .attr('height', 100)
              .append('g')
              .attr('transform', 'translate(30,30)');

gStep.call(sliderStep);

d3.select('p#value-step').text(sliderStep.value());

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

  // generate bar chart
  barChartGenerator(trade[YEAR][COUNTRY].trade.xprt, countries[COUNTRY]);

  // generate sun burst
  sunBurstGenerator(trade, trade[YEAR][COUNTRY].trade);

});
