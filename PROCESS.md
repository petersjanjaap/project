#day 2
- built a script in Python to use API's from the World Bank to convert and save the data in JSON-format.
- working on a script to import GDP info for countries
- I limited the scope of the subject to trade flows of the UK with the world, because otherwise the dataset would become to large, namely > 9  million obs

#day 3
- finished the API-script in Python to download all data. Trade data and data on GDP components for all countries worldwide is now complete.
- created basic layout for the website, including svg's for all visualizations and buttons for navigation around the page.
- decided to add a slider to navigate through the years 2000-2017 of GDP and trade data.

#day 4
- loaded all JSON data to the web page
- built a world map with D3 and made a prototype with british export flows displayed in colors
- after mentor meeting decided to substitute pie chart for bar chart for the display of GDP components

#day 6
- worked on map and inserted color scheme. implemented tooltip and changed colors of countries on hoovering
- implemented bar chart in svg displaying components of trade
- implemented slider from d3 to slide over years 2000-2017
- started working on third visualization, either journalism graph from d3 gallery or dynamic sunburst for export and import

#day 7
- adjusted the structure of the JSON files to name children structure for all nodes by using a recursive function. This allows the usage of       the hierarchy function in D3 in order to build a sun burst chart, which I want to divide between export and import.
- built a prototype sun burst chart
