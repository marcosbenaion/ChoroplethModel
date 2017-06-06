// Select and position the SVG element
var svg = d3.select("svg"),
    width = +svg.attr("width"),
    height = +svg.attr("height");

// Define the buttons positions
var espacamentoTopo = 50;
var espacamentoEsquerda = 50;
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

// Queue load the map and data
d3.queue()
    .defer(d3.json, "map/bairrosBelem.json")
    .defer(d3.tsv, "data/populacaoBelem.tsv")
    .defer(d3.tsv, "data/areaBelem.tsv")
    .await(ready);

// Load Textures
var textureQ09 = textures.lines()
    .lighter();

var textureQ19 = textures.lines()
    .size(2)
    .strokeWidth(1);

var textureQ29 = textures.lines()
    .size(3)
    .strokeWidth(1);

var textureQ39 = textures.lines()
    .size(5)
    .strokeWidth(1);

var textureQ49 = textures.lines()
    .size(8)
    .strokeWidth(2);

var textureQ59 = textures.lines()
    .size(10)
    .strokeWidth(2);

var textureQ69 = textures.lines()
    .size(12)
    .strokeWidth(2);

var textureQ79 = textures.lines()
    .orientation("vertical")
    .heavier(10)
    .thinner(1.5)
    .size(6)
    .strokeWidth(2);

var textureQ89 = textures.lines()
    .orientation("vertical")
    .heavier(10)
    .thinner(1.5)
    .size(6)
    .strokeWidth(5);

svg.call(textureQ09);
svg.call(textureQ19);
svg.call(textureQ29);
svg.call(textureQ39);
svg.call(textureQ49);
svg.call(textureQ59);
svg.call(textureQ69);
svg.call(textureQ79);
svg.call(textureQ89);

var neighborhood;

//Load colors

var colors = [{ colorMap: "rgb(247,251,255)",textureMap: textureQ09}, 
              { colorMap: "rgb(222,235,247)",textureMap: textureQ19},
              { colorMap: "rgb(198,219,239)",textureMap: textureQ29}, 
              { colorMap: "rgb(158,202,225)",textureMap: textureQ39}, 
              { colorMap: "rgb(107,174,214)",textureMap: textureQ49}, 
              { colorMap: "rgb(66,146,198)",textureMap: textureQ59}, 
              { colorMap: "rgb(33,113,181)",textureMap: textureQ69}, 
              { colorMap: "rgb(8,81,156)",textureMap: textureQ79}, 
              { colorMap: "rgb(8,48,107)",textureMap: textureQ89}
             ];

// Function to manipulate the data in the map
function ready(error, mapObject, attributeOne, attributeTwo) {
    // mapObject = .json file - map
    // populacao = .tsv file - data
    
    if (error) throw error;
    
    // Assign to attributeOneDataArray the data in the attributeOne
    attributeOne.forEach(function(d) { 
        attributeOneDataArray.set(d.ID, +d.POPULACAO_TOTAL);
        // Correspondent Row names of attributeOne.tsv are used as 'd' property objects. Example:
        // Rows: ID, POPULACAO_TOTAL, BAIRRO
        // Access: d.ID, d.POPULACAO_TOTAL, d.BAIRRO
    });
    
    // Assign to attributeTwoDataArray the data in the attributeTwo
    attributeTwo.forEach(function(d) {
        attributeTwoDataArray.set(d.ID, +d.AREA);
    });
    
    // Create the filter array to store the filter state and scale class
    attributeOne.forEach(function(d) { 
        filterArray[d.ID] = {id: d.ID, filtro1: 1, filtro2:1, scaleClass: ""};
        // filterArray elements receive the same d.ID -- Correspondent Row, see above -- values of the attributeOne
        // Filter values starts at 1, meaning all data elements are included in the view
        // Scale class values will be set on the setScale function
    });
    
    // Create the scale for the attributeOne
    scales.populacao = d3.scaleThreshold() // 'jenks9' is the scale name -- used in the setScale function
      .domain(ss.jenks // Use Jenks Natural Breaks Classification Algorithm
              (attributeOne.map(function(d) { return +d.POPULACAO_TOTAL; }), 9)
              // Scale created use the 'd' property values -- Correspondet Row, see above --
              // Values are assigned into one of the 'n' classes -- 9 in this case
             )
      .range(d3.range(9).map(function(i) { return i; }));
    
    // Create the scale for the attributeTwo
    scales.area = d3.scaleThreshold()
      .domain(ss.jenks
              (attributeTwo.map(function(d) { return +d.AREA; }), 9)
             )
      .range(d3.range(9).map(function(i) { return i; }));
    
    var feat = topojson.feature(mapObject, mapObject.objects.bairrosBelem);
    
    var b = path.bounds(feat),
      s = .95 / Math.max((b[1][0] - b[0][0]) / width, (b[1][1] - b[0][1]) / height),
      t = [(width - s * (b[1][0] + b[0][0])) / 2, (height - s * (b[1][1] + b[0][1])) / 2];
    
    projection
      .scale(s)
      .translate(t);
    
    neighborhood = svg.append("g")
        .attr("class", "neighborhood")
    .selectAll("path")
    .data(topojson.feature(mapObject, mapObject.objects.bairrosBelem).features)
    .enter().append("path")
        .attr("d", path);
    
    d3.selectAll('input').on('change', function() {
      setScale(this.id);
  });
    
    var button = d3.button()
    .on('press', function(d, i) { attributeOne.forEach (mute.bind(null, d));
                                 setScale('populacao');
                                 console.log("Pressed", d, i, this.parentNode);})
    .on('release', function(d, i) { attributeOne.forEach (unmute.bind(null, d));
                                    setScale('populacao');
                                    console.log("Released", d, i, this.parentNode)});
    
// Add buttons
var buttons = svg.selectAll('.button')
    .data(dataButton)
  .enter()
    .append('g')
    .attr('class', 'button')
    .call(button);
    
    setText(attributeOneDataArray);
    
    // Default Scale loaded
    setScale('area');
}

function mute(botao, index){
    var labelBotao = botao.label;
    var scaleClass = filterArray[index.ID].scaleClass;
    if ((scaleClass) == (labelBotao)){
        filterArray[index.ID].filtro1 = 0;
    }
}
    
    function unmute(botao, index){
        var labelBotao = botao.label;
        var scaleClass = filterArray[index.ID].scaleClass;
        if ((scaleClass) == (labelBotao)){
            filterArray[index.ID].filtro1 = 1;
        }
    }

function setScale(s) {
    // Scale for populacao
    if (s == "populacao"){
        neighborhood.style("fill", function(d) { 
          if (filterArray[d.properties.id].filtro1 == 1)
              {
                  filterArray[d.properties.id].scaleClass = scales[s](d.POPULACAO_TOTAL = attributeOneDataArray.get(d.properties.id));
                  return colors[scales[s](d.POPULACAO_TOTAL = attributeOneDataArray.get(d.properties.id))].colorMap;
              }
          return "rgb(102, 103, 104)"; })
    }
    
    // Scale for area
      else if (s == "area"){
          neighborhood.style("fill", function(d) { 
          if (filterArray[d.properties.id].filtro2 == 1)
              {
                  // Textura -> Populacao / Cor -> Area
                  filterArray[d.properties.id].scaleClass = scales[s](d.AREA = attributeTwoDataArray.get(d.properties.id));
                  var cor = colors[scales[s](d.AREA = attributeTwoDataArray.get(d.properties.id))].colorMap;
                  
                  filterArray[d.properties.id].scaleClass = scales[s](d.POPULACAO_TOTAL = attributeOneDataArray.get(d.properties.id));
                  var textureTemp = colors[scales["populacao"](attributeOneDataArray.get(d.properties.id))].textureMap;
                  textureTemp.background(cor);
                  svg.call(textureTemp);
                  return textureTemp.url();
                                
                  // Area
                  /*filterArray[d.properties.id].scaleClass = scales[s](d.AREA = attributeTwoDataArray.get(d.properties.id));
                  return colors[scales[s](d.AREA = attributeTwoDataArray.get(d.properties.id))].colorMap;*/
              }
          return "rgb(102, 103, 104)"; })
      }
    
  }

function setText(d){
        neighborhood.append("title")
      .text(function(d) { return "ID: " + d.properties.id + ". Bairro " + d.properties.nome + ". Populacao: " + (d.POPULACAO_TOTAL = attributeOneDataArray.get(d.properties.id)) + ". Area: " + (d.AREA = attributeTwoDataArray.get(d.properties.id)) });
    
    }