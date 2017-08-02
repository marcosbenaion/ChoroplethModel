// Select and position the SVG element
var svg = d3.select("svg#mapSVG"),
    width = +svg.attr("width"),
    height = +svg.attr("height");

var controlsSVG = d3.select("svg#controlsSVG"),
    width = +svg.attr("width"),
    height = +svg.attr("height");

// Define the buttons positions
var espacamentoTopo = 50;
var espacamentoEsquerda = 30;
var espacamentoBotoes = 50;

// Create the buttons for turning on/off filters
var dataButton = 
    [{label: "0", x: espacamentoEsquerda, y: espacamentoTopo },
    {label: "1", x: espacamentoEsquerda, y: espacamentoTopo + espacamentoBotoes * 1},
    {label: "2", x: espacamentoEsquerda, y: espacamentoTopo + espacamentoBotoes * 2},
    {label: "3", x: espacamentoEsquerda, y: espacamentoTopo + espacamentoBotoes * 3},
    {label: "4", x: espacamentoEsquerda, y: espacamentoTopo + espacamentoBotoes * 4},
    {label: "5", x: espacamentoEsquerda, y: espacamentoTopo + espacamentoBotoes * 5},
    {label: "6", x: espacamentoEsquerda, y: espacamentoTopo + espacamentoBotoes * 6},
    {label: "7", x: espacamentoEsquerda, y: espacamentoTopo + espacamentoBotoes * 7},
    {label: "8", x: espacamentoEsquerda, y: espacamentoTopo + espacamentoBotoes * 8}];


// Define projection to use on the map - d3 Projections
var projection = d3.geoEquirectangular();

// Variable objects used to store the attributes
var attributeOneDataArray= d3.map();
var attributeTwoDataArray= d3.map();

// Variable scales store the different scales created
var scales = {};

// Create path and assign projection
var path = d3.geoPath()
    .projection(projection);

// Filter array
var filterArray = {};
    
// Create initial projection - will be changed later properly
projection
    .scale(1)
    .translate([0, 0]);

//Current map level
var mapLevel = "brasil";

//Map Current loaded
var currentMap = "map/" + mapLevel + ".json";

//Data current loaded
var currentPopulacao = "data/brasil/" + mapLevel + "Area.tsv";
var currentArea = "data/brasil/" + mapLevel + "Populacao.tsv";

// Queue load the map and data
d3.queue()
    .defer(d3.json, currentMap)
    .defer(d3.tsv, currentPopulacao)
    .defer(d3.tsv, currentArea)
    .await(ready);

// Function to manipulate the data in the map
function ready(error, mapObject) {
    // mapObject = .json file - map
    // populacao = .tsv file - data
    
    if (error) throw error;
    
    neighborhood = svg.select("g")
                      .remove()
                      .exit();
    
    svg.call(d3.zoom().on("zoom", function () {
              neighborhood.attr("transform", d3.event.transform);
      }))
    
    var feat = topojson.feature(mapObject, mapObject.objects.collection);
    
    var b = path.bounds(feat),
      s = .95 / Math.max((b[1][0] - b[0][0]) / width, (b[1][1] - b[0][1]) / height),
      t = [(width - s * (b[1][0] + b[0][0])) / 2, (height - s * (b[1][1] + b[0][1])) / 2];
    
    console.log(s);
    console.log(t);
    
    projection
      .scale(s)
      .translate(t);
    
    neighborhood = svg.append("g")
        .attr("class", "neighborhood")
    .selectAll("path")
    .data(topojson.feature(mapObject, mapObject.objects.collection).features)
    .enter().append("path")
    .on("click", test)
        .attr("d", path);
    
}

function test(d) {
    currentMap = "map/" + d.properties.name + ".json";
    console.log(currentMap);
    
    projection
    .scale(1)
    .translate([0, 0]);
    
    d3.queue()
    .defer(d3.json, currentMap)
    .await(ready);
}