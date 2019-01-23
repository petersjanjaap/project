// width, height and padding for svgs
const width = 700;
const height = 500;
const padding = 60;

// global year
let YEAR = 2000;
let COUNTRY = 'DEU';
let GDP;
let TRADE;
let COUNTRIES;
let TRADE_FLOW = 'xprt';

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
                      sunBurstGenerator()
                      d3.select('p#value-step').text(d);
                    });

let slider = d3.select('#slider')
              .attr('class', 'slider')
              .attr('width', width)
              .attr('height', 100);

let gStep =   slider.append('g')
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
  map = response[0];
  TRADE = response[1];
  COUNTRIES = response[2];
  GDP = response[3];

  // generate map
  mapGenerator(map, TRADE, COUNTRIES, YEAR);

  // generate sun burst
  sunBurstGenerator();

  // generate bar chart
  barChartGenerator(GDP[COUNTRY][YEAR], COUNTRIES[COUNTRY]);

});
