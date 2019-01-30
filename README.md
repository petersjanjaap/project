# Programmeerproject
https://petersjanjaap.github.io/project/Pages/index.html

Jan Peters 10452125

Global Britain (Visualization of global trade flows with the U.K.)

# Beschrijving
Open pagina op normale zoom, bij voorkeur op een laptop. Alles is getest in Firefox.
Dit project geeft een weergave van handelsstromen (export en import) van het VK over de jaren 2000 - 2017 in drie verschillende visualizaties. De eerste is een heatmap gebaseerd op het percentage van de handelsspartner met het VK in respectievelijk totale export of import die de gebruiker kan selecteren:
![alt text](https://github.com/petersjanjaap/project/blob/master/Images/Index_p1.png)

Verder kan de gebruiker d.m.v. info buttons informatie over de visualizatie op vragen. Andere visualizaties die zijn gebruikt zijn een lijngrafiek om de totale waarde van export en import met de geselecteerde partner over alle jaren te bekijken, een sun burst die het aandeel van verschillende sectoren in export en import weergeeft en een bar chart die het relatieve aandeel van verschillende sectoren in het GDP van het partnerland weergeeft om te zien of deze partner een veelbelovende handelspartner is.
![alt text](https://github.com/petersjanjaap/project/blob/master/Images/Index_p2.png)

Verder kan de gebruiker op de Brexit pagina via de navigatiebar een video bekijken met uitleg over de invloed van Brexit op Britse handel bekijken en live de nieuwsfeed van verschillende vooraanstaande nieuwsbronnen selecteren.
![alt text](https://github.com/petersjanjaap/project/blob/master/Images/Brexit.png)

De laatste pagina is een overzicht met een beschrijving van alle gebruikte visualizaties en de gebruikte libraries en add-ins voor dit project. Daarnaast wordt er gelinkt naar de GIT repository en kunnen overige bronnen in deze README worden teruggelezen.
![alt text](https://github.com/petersjanjaap/project/blob/master/Images/About.png)


# Veranderingen
Dit gedeelte geeft een overzicht van alle veranderingen sinds het begin van dit project.

8-1-2019: 
In overleg met Tim ervoor gekozen om te kijken naar het verhaal van 'Global Britain', ofwel handelsstromen van de UK met de rest van de wereld.  


10-1-2019:
1) Op de pagina heb ik een slider toegevoegd om de handelsstromen over de jaren heen te kunnen bekijken. 
2) Daarnaast wil ik een van de visualizaties, dan wel de grafiek of de pie chart gaan veranderen in de volgende visualisatie om import export te kunnen vergelijken: http://www.brightpointinc.com/united-states-trade-deficit/

11-2-2019:
De GDP componenten wil ik in plaats van een pie chart in een bar chart weergeven, omdat dit overzichtelijker is met een totaal van 7 variabelen.

15-1-2019:
Bezig met eens sun burst chart i.p.v. deze visualisatie http://www.brightpointinc.com/united-states-trade-deficit/. Sun burst heeft betere documentatie en is voor visualisatie nog steeds interessant omdat het export en import opdeelt. 

25-1-2019:
Besloten een line chart toe te voegen om de ontwikkeling van export en import tussen UK en geselecteerd land over tijd te kunnen bekijken. Deze is verwerkt op de pagina.

28-1-2019:
Navigatie bar toegevoegd met nieuwe html pagina's voor verhaal over Brexit en verwijzingen naar externe library's en data.

# Bronnen
Voor alle bronnen hieronder vermeld heb ik de licentie gecheckt. Per codefile staat vermeld welke bronnen voor welk doel zijn gebruikt, de inhoud hiervan is afkomstig van de desbetreffende auteur en vallen onder hun oorspronkelijke licentie.

**project.js:**

Slider: https://bl.ocks.org/johnwalley/e1d256b81e51da68f7feb632a53c3518

**map.js:**


Map: http://bl.ocks.org/palewire/d2906de347a160f38bc0b7ca57721328

https://bl.ocks.org/adamjanes/6cf85a4fd79e122695ebde7d41fe327f

Scroll: https://jsfiddle.net/cyril123/xyczrts2/1/

Legend: https://stackoverflow.com/questions/42009622/how-to-create-a-horizontal-legend


**sunburst.js:**


Sun: https://bl.ocks.org/denjn5/6d161cb24695c8df503f9109045ea629

Redraw sun and interactivity: https://bl.ocks.org/denjn5/6d161cb24695c8df503f9109045ea629

**barchart.js**


bar chart: https://alignedleft.com/tutorials/d3/making-a-bar-chart

interactiviteit: https://stackoverflow.com/questions/40571511/dynamically-updating-d3-bar-chart

rotatie titels x-as: https://bl.ocks.org/mbostock/4403522

**linechart.js:**


Line graph: http://bl.ocks.org/d3noob/7030f35b72de721622b8

Circles: https://bl.ocks.org/NGuernse/58e1057b7174fd1717993e3f5913d1a7

Tick format: https://bl.ocks.org/mbostock/9764126

Stroke: https://bl.ocks.org/mbostock/5649592

**project.css:**

Tooltip: https://gist.github.com/woodyrew/645d0258415db9205da52cb0e049ca28#file-index-html

Navigation bar: https://www.w3schools.com/css/css_navbar.asp

Box shadow: https://css-tricks.com/snippets/css/css-box-shadow/

**html:**

Bootstrap grids https://www.w3schools.com/bootstrap/tryit.asp?filename=trybs_navbar_inverse&stacked=h

Image in title bar: https://stackoverflow.com/questions/15786937/add-image-in-title-bar

Navigation bar: https://www.w3schools.com/css/css_navbar.asp

**Afbeeldingen en video's:**

Video: Universiteit Groningen - https://www.youtube.com/watch?v=HEN0pppgjrw

Headerafbeelding Wikipedia:  https://upload.wikimedia.org/wikipedia/en/thumb/a/ae/Flag_of_the_United_Kingdom.svg/1280px-Flag_of_the_United_Kingdom.svg.png

Achtergrond: George Hodan - publicdomainpictures.net: https://www.publicdomainpictures.net/en/view-image.php?image=180560&picture=brexit-referendum-uk

# Configuraties
Er zijn geen configuraties als gitignore toegepast. Deze zijn dus ook niet toegevoegd. Data bevindt zich in de map Pages.

# Licentie
MIT License

Copyright (c) 2019 petersjanjaap

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
Readme heeft nu een volledige beschrijving van wat het doel is van dit project met ondersteuning van verschillende screenshots. Daarnaast de readme opgedeeld in beschrijving, veranderingen, bronnen en licentie
