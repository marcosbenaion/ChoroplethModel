// Select and position the SVG element
var svg = d3.select("svg#mapSVG"),
    width = +svg.attr("width"),
    height = +svg.attr("height");

var controlsSVG = d3.select("svg#controlsSVG"),
    width = +svg.attr("width"),
    height = +svg.attr("height");

// Define projection to use on the map - d3 Projections
var projection = d3.geoEquirectangular();

// Create path and assign projection
var path = d3.geoPath()
    .projection(projection);
    
// Create initial projection - will be changed later properly
projection
    .scale(1)
    .translate([0, 0]);

//Map Current loaded
var currentMap = "map/BRA.json";

// Queue load the map and data
d3.queue()
    .defer(d3.json, currentMap)
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