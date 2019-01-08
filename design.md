List of data sources:
===============
For the project I well need access to the following data: <br>
-	Total value of export and import in $ between each country and trade partner 2000-2017 <br>
-	Total value of export and import in $ for the following sectors: ”Raw agricultural, chemicals, food, fuels, manufacturing, Ores and Metals, Textiles, Transport” 2000-2017 <br>
-	Partner share in % of total and sector export and import value per country 2000-2017 <br>
-	Components of GDP for all countries worldwide*
The links used in the API will be the following:*
[Total and sectors export and import value in $](http://wits.worldbank.org/API/V1/SDMX/V21/datasource/tradestats-trade/reporter/usa/year/2017/partner/ALL/product/Total;AgrRaw;Chemical;Food;Fuels;manuf;OresMtls;Textiles;Transp
/indicator/XPRT-TRD-VL;MPRT-TRD-VL?format=JSON)


[Partner share export and import in %](http://wits.worldbank.org/API/V1/SDMX/V21/datasource/tradestats-trade/reporter/usa/year/2017/partner/ /product/ /indicator/XPRT-PRTNR-SHR;MPRT-PRTNR-SHR?format=JSON)<br>

The World Bank does not allow to obtain data for all countries, all at once. Therefore I can either iterate over all countries in a loop to adjust the API link or narrow the subject to a specific region or look at trade flows from one country to the rest of the world. This problem is exacerbated by the fact that I will need data over time from at least 2000 – 2017, which also needs separate links to load in the data and strongly increased the size of the data file.<br>

**Diagram** *
The components will consist of a map from which the user can select a subject country and a selected trade partner. The map should then display a line going from one country to the other. Simultaneously, a stacked graph and a pie chart should appear. The first contains information on the development of total trade value between the two countries, displayed in different sectors. The pie chart displays the different components of GDP in the partner country to compare the composition of GDP sectors to the composition of trade flows. All the visualizations are displayed on the same page.<br>
**List of API or D3 plugins** *
For all the visualizations D3 V5 will be used. I will download the data beforehand and make it available in the repository of the project. In that way, it will not be necessary to use an API in the script of the page. However, I will separately load in the data via python and provide the script in the repository of Github.<br>
