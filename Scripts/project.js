// width, height and padding for svgs
const width = screen.width / 2.1;
const height = screen.height / 1.8;
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

let select = d3.select('.select')
                .append('select')
              	.attr('class','select')
                .on('change', onchange);

let options = select.selectAll('option')
              	     .data(data)
                     .enter()
                     .append('option')
              	     .text(d => { return d; });

function onchange() {
	let select = d3.select('select')
                  .property('value');

  if (select === 'Export') {
    TRADE_FLOW = 'xprt';
  } else {
    TRADE_FLOW = 'mprt';
  };

  updateMap();
};

// create variable for all years
let years = [];
for (let year = 2000; year < 2018; year++) {
  years.push(year);
};

// source:https://bl.ocks.org/johnwalley/e1d256b81e51da68f7feb632a53c3518
// create slider
let slider = d3.select('#map')
              .append('svg')
              .attr('transform', 'translate('
              + ((screen.width / 1.3 - screen.width / 1.3 * 0.9) / 2) +' , '
              + (screen.height / 1.3 * 0.86) +')')
              .attr('width', screen.width / 1.3 * 0.9)
              .attr('height', screen.height / 1.3 * 0.2);

let sliderStep = d3.sliderBottom()
                    .min(Math.min(...years))
                    .max(Math.max(...years))
                    .tickFormat(d3.format('y'))
                    .width((screen.width / 1.3) * 0.8)
                    .ticks(years.length)
                    .step(1)
                    .default(0.015)
                    .on('onchange', d => {

                      // update year based on user selection
                      YEAR = d;

                      // reset country to germany if missing obs
                      if (!TRADE[YEAR].hasOwnProperty(COUNTRY)) {
                        COUNTRY = 'DEU'
                      };

                      updateMap();
                      barChartGenerator();
                      sunBurstGenerator();
                      d3.select('p#value-step')
                        .text(d);
                    });

let gStep = slider.append('g')
                  .attr('transform', 'translate(30,30)');

gStep.call(sliderStep);

// make all years readable
slider.selectAll('text')
      .style('fill', 'black');

// create tooltip
let tooltip = d3.select('body')
              .append('div')
              .attr('class', 'tooltip')
              .style('opacity', 0);

// obtain datasets
TRADE = d3.json('Data/dataset.json');
COUNTRIES = d3.json('Data/countries.json');
GDP = d3.json('Data/gdp.json');
MAP = d3.json('Data/world-110m.json');

// load map and datasets
let promises = [MAP, TRADE, COUNTRIES, GDP];

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
  };

  // generate map
  mapGenerator();

  // generate sun burst
  sunBurstGenerator();

  // generate bar chart
  barChartGenerator();

  // generate graph
  graph();
});
