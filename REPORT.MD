# Description
This visualization describes global trade flows of the U.K. with the rest of the world based on the aim of the British government to become a 'Global Britain' after leaving E.U. trade agreements with Brexit. This visualization offers users a view of U.K. trade relations over the years 2000-2017 and potentially interesting partner markets.
![alt text](https://github.com/petersjanjaap/project/blob/master/Images/Index_p1.png)

# Design
**Pages**\
The project is built around three pages. The home page includes all visualizations and a short introduction of the project. The Brexit page gives further information on the effect of Brexit on British trade explained in a short YouTube video. The user can also follow current news from six news sources on the left side of the page using the links. The About page describes the visualizations in this project, the sources of the data, the libraries and add-ins used and gives the links to the GitHub repository. 

**Visualizations**\
_The Map_\
All visualizations are built around the map indicating the relative share of a country in the total import or export of the U.K. The user has three options in this map. The user can either select export and import on the top left of the map after which colors on the map and the legend update based on the percentage in the given trade flow of all countries. The slider on the bottom of the map offers the option to select a year ranging from 2000 to 2017 to view export and import shares, after which the colors and the titles update.Lastly, the user can select a country on the map by clicking on it. If this country has information on the trade flow for the given year the visualizations below updates and the screen automatically scrolls to these new visualizations.

_The Line Chart_\
The line chart describes total export and import in dollars with the selected partner country. The line is updated if a new country is selected. If numbers on total trade flows were missing in a given year, then they were set at zero. This allows the user to quickly see whether trade with the partner country has been growing over the past years and if the U.K. has a trade deficit.

_The Sun Burst_\
The sun burst shows the relative shares in total trade of export and import in the inner side of the burst and further divides export and import into sectors in the outer side. The size of all slides indicates the share of the trade flow or sector in the total amount amount of trade. The user can thereby gain a quick overview of trade components. Sectors included are Agriculture, Chemicals, Food, Fuels, Industry (manufacturing), Metals, Textiles and Transport.

_The Bar Chart_\
The bar chart shows sectors comprising GDP in the partner country. This offers the user an indication whether the market is potentially attractive to the U.K. based on the goods that are produced in the partner country. Unfortunately, sectors included in trade data were not the exact same as sectors included in GDP data provided by the World Bank but still similar. These included are Manufacturing, Agriculture, Oil, Coal, Mining, Services and Trade. 

**Interactivity**\
_Tooltips_\
All four visualizations include tooltips to describe information of specific components. The user can hoover in the map over countries, which then switch to darkblue, and see the given country and the share percentage in the trade flow. In the line chart the user can hoover over the circles to see the total dollar value of either export or import in the given year. In the sun burst the user can either select a component by clicking on it, which then switches opacity for non-related slices of the burst (those not underlying or next to it) and by mousing on it can see the total value of the given slice. The bar chart also allows the user to mouse over bars to see the exact total value of the sector in the bar.

_Question marks_\
All visualizations include a question mark over which the user can mouse to see a full description of the visualization and the purpose of the information.

_Navigation Bar_\
The navigation bar can be used to select a new page.

_Updates_\
All visualizations are set to update based on changes to the selected year or country and the map as well for the selected trade flow. The map directly changes color, legend and title if the user makes any changes to the forenamed three variables. The other visualizations update using transitions and delays. The delays are used to make the transition visible before they are finished while scrolling down the page. The axes on the bar and line chart transition smoothly, as well as the bars and the lines, the circles on the line chart are removed and flown in directly. The sun burst switches to white after which the new labels fly in from the center and the slices change to their selected colors. All titles are updated as well.

**Preventing errors**\
Not all countries have data for all years. If the user clicks on a country without data on the map, which are shown in grey, a tooltip appears showing no info is available. The user is also informed to select a partner country if he selects the U.K.. If the user has selected a country in a given year for which information is available and switches to a new year for which no information is available for the country, then the selected country is automatically reset to Germany.

# Challenges
The project had some significant alterations since the original proposal
