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

#day 8
- implemented sunburst chart together with labels
- splitted code into seperate files for all visualizations
- started working on updates through slider and map click function
- minor adjustments to css sheet

#day 9
- started organizing elements on page using bootstrap grids
- sorted slices in pie charts based on elements' underlying values
- started working on updates by clicking on countries on map
- prepared alpha version

#day 10
- implemented interactivity in sunburst, updates automatically by selecting year or country
- sunburst elements can now be selected and will be highlighted
- implemented interactivity into bar chart. used new source to create cleaner code

#day 11
- after some struggles got bootstrap grids working
- colors on map update after selecting new year
- made an interactive flashing sunburst
- bar chart now displays GDP components of partner country: This still needs to list the total value of GDP somewhere in the SVG.
- started working on better layout

#day 12
- inserted legend into map svg
- added drop down menu to switch display between export and import relations
- used new color elements for charts
- tried different styling methods for page layout

#day 13
- worked on layout, edited styles of boxes in css
- put slider and dropdown boxes as foreign objects in svg for map
- put titles in svg's
- downloaded total gdp in api to use dollar values of gdp components in bar chart instead of percentages
- added tooltips to all elements
- asked for feedback on layout
- made plan to finalise style tomorrow and add a line chart in the weekend to display export and import for UK with selected country

#day 14
- Hackathon

#day 15
- updated all visualizations with titles axes etc.
- finalised interactivity for bar chart and map
- built new legend for map
- added a line chart to display export and import with partner country over time (finished)
--> now that all visualizations have been finished I can focus on the layout. This will include replacing of all elements, adding info on the sources and what kind of data is visualized. I also want to built more of a story around Brexit and news events related to trade.
