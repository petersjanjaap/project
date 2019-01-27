// width, height and padding for svgs
const width = 700;
const height = 500;
const padding = 60;

// globals
let YEAR = 2000;
let COUNTRY = 'DEU';
let MAP;
let GDP;
let TRADE;
let COUNTRIES;
let MAPCOUNTRIES;
let TRADE_FLOW = 'xprt';
let MAPCOLOR;

let data = ['Export', 'Import'];

let select = d3.selectAll('p')
  .append('select')
  	.attr('class','select')
    .on('change',onchange)

let options = select
  .selectAll('option')
	.data(data).enter()
	.append('option')
		.text(d => { return d; });

function onchange() {
	let select = d3.select('select').property('value');

  if (select === 'Export') {
    TRADE_FLOW = 'xprt';
  } else {
    TRADE_FLOW = 'mprt';
  };

  updateMap(TRADE[YEAR], map)
};

// create letiable for all years
let years = [];
for (let year = 2000; year < 2018; year++) {
  years.push(year);
};

// source:https://bl.ocks.org/johnwalley/e1d256b81e51da68f7feb632a53c3518
// create slider
let sliderStep = d3.sliderBottom()
                    .min(Math.min(...years))
                    .max(Math.max(...years))
                    .tickFormat(d3.format('y'))
                    .width(width * 0.9)
                    .ticks(years.length)
                    .step(1)
                    .default(0.015)
                    .on('onchange', d => {

                      // update year based on user selection
                      YEAR = d;

                      // reset country to germany if missing obs
                      if (!TRADE[YEAR].hasOwnProperty(COUNTRY)) {
                        COUNTRY = 'DEU'
                      }
                      updateMap()
                      barChartGenerator();
                      sunBurstGenerator()
                      d3.select('p#value-step').text(d);
                    });

let slider = d3.select('#slider')
              .attr('class', 'slider')
              .attr('width', width)
              .attr('height', 100);

let gStep = slider.append('g')
                  .attr('transform', 'translate(30,30)');

gStep.call(sliderStep);

// create tooltip
let tooltip = d3.select('body')
              .append('div')
              .attr('class', 'tooltip')
              .style('opacity', 0);

// obtain datasets
TRADE = d3.json('dataset.json');
COUNTRIES = d3.json('COUNTRIES.json');
GDP = d3.json('GDP.json');

// load map and datasets
let promises = [d3.json('http://enjalot.github.io/wwsd/data/world/world-110m.geojson'),
                TRADE, COUNTRIES, GDP];

Promise.all(promises).then(response => {

  //  save responses
  MAP = response[0];
  TRADE = response[1];
  COUNTRIES = response[2];
  GDP = response[3];

  // keep track of countries in map
  MAPCOUNTRIES = [];
  for (let i in MAP.features) {
    MAPCOUNTRIES.push(MAP.features[i].id)
  }

  // generate map
  mapGenerator();

  // generate sun burst
  sunBurstGenerator();

  // generate bar chart
  barChartGenerator();

  // generate graph
  graph()
});
