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
    [{label: "q0-9", x: espacamentoEsquerda, y: espacamentoTopo },
    {label: "q1-9", x: espacamentoEsquerda, y: espacamentoTopo + espacamentoBotoes * 1},
    {label: "q2-9", x: espacamentoEsquerda, y: espacamentoTopo + espacamentoBotoes * 2},
    {label: "q3-9", x: espacamentoEsquerda, y: espacamentoTopo + espacamentoBotoes * 3},
    {label: "q4-9", x: espacamentoEsquerda, y: espacamentoTopo + espacamentoBotoes * 4},
    {label: "q5-9", x: espacamentoEsquerda, y: espacamentoTopo + espacamentoBotoes * 5},
    {label: "q6-9", x: espacamentoEsquerda, y: espacamentoTopo + espacamentoBotoes * 6},
    {label: "q7-9", x: espacamentoEsquerda, y: espacamentoTopo + espacamentoBotoes * 7},
    {label: "q8-9", x: espacamentoEsquerda, y: espacamentoTopo + espacamentoBotoes * 8}];

// Define projection to use on the map - d3 Projections
var projection = d3.geoEquirectangular();

// Variable object used to search with get
var data4Search= d3.map();

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
    .defer(d3.tsv, "data/bairrosBelem.tsv")
    .await(ready);

var neighborhood;

var textureD3 = textures.lines()
  .thicker();

svg.call(textureD3);

// Function to manipulate the data in the map
function ready(error, mapObject, dataObject) {
    // mapObject = .json file - map
    // populacao = .tsv file - data
    
    if (error) throw error;
    
    // Assign to data4Search the data in the dataObject
    dataObject.forEach(function(d) { 
        data4Search.set(d.ID, +d.POPULACAO_TOTAL);
        // Correspondent Row names of dataObject.tsv are used as 'd' property objects. Example:
        // Rows: ID, POPULACAO_TOTAL, BAIRRO
        // Access: d.ID, d.POPULACAO_TOTAL, d.BAIRRO
    });
    
    // Create the filter array to store the filter state and scale class
    dataObject.forEach(function(d) { 
        filterArray[d.ID] = {id: d.ID, filtro: 1, scaleClass: ""};
        // filterArray elements receive the same d.ID -- Correspondent Row, see above -- values of the dataObject
        // Filter values starts at 1, meaning all data elements are included in the view
        // Scale class values will be set on the setScale function
    });
    
    // Create the scale for a dataObject
    scales.jenks9 = d3.scaleThreshold() // 'jenks9' is the scale name -- used in the setScale function
      .domain(ss.jenks // Use Jenks Natural Breaks Classification Algorithm
              (dataObject.map(function(d) { return +d.POPULACAO_TOTAL; }), 9)
              // Scale created use the 'd' property values -- Correspondet Row, see above --
              // Values are assigned into one of the 'n' classes -- 9 in this case
             )
      .range(d3.range(9).map(function(i) { return "q" + i + "-9"; }));
    
    var feat = topojson.feature(mapObject, mapObject.objects.bairrosBelem);
    
    var b = path.bounds(feat),
      s = .95 / Math.max((b[1][0] - b[0][0]) / width, (b[1][1] - b[0][1]) / height),
      t = [(width - s * (b[1][0] + b[0][0])) / 2, (height - s * (b[1][1] + b[0][1])) / 2];
    
    projection
      .scale(s)
      .translate(t);
    
    console.log(textureD3.url());
    
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
    .on('press', function(d, i) { dataObject.forEach (mute.bind(null, d));
                                 setScale('jenks9');
                                 console.log("Pressed", d, i, this.parentNode);})
    .on('release', function(d, i) { dataObject.forEach (unmute.bind(null, d));
                                    setScale('jenks9');
                                    console.log("Released", d, i, this.parentNode)});
    
// Add buttons
var buttons = svg.selectAll('.button')
    .data(dataButton)
  .enter()
    .append('g')
    .attr('class', 'button')
    .style("fill", textureD3.url())
    .call(button);
    
    setText(data4Search);
    
    setScale('jenks9');
}

function mute(botao, index){
        var labelBotao = botao.label;
        var scaleClass = filterArray[index.ID].scaleClass;
        if ((scaleClass) == (labelBotao)){
            filterArray[index.ID].filtro = 0;
        }
    }
    
    function unmute(botao, index){
        var labelBotao = botao.label;
        var scaleClass = filterArray[index.ID].scaleClass;
        if ((scaleClass) == (labelBotao)){
            filterArray[index.ID].filtro = 1;
        }
    }

function setScale(s) {
        console.log(s);
      neighborhood.attr("class", function(d) { 
          if (filterArray[d.properties.id].filtro == 1)
              {
                  filterArray[d.properties.id].scaleClass = scales[s](d.POPULACAO_TOTAL = data4Search.get(d.properties.id));
                  return scales[s](d.POPULACAO_TOTAL = data4Search.get(d.properties.id));
              }
          return "excludeView"; })
  }

function setText(d){
        neighborhood.append("title")
      .text(function(d) { return "ID: " + d.properties.id + ". Bairro " + d.properties.nome + ". Populacao: " + (d.rate = data4Search.get(d.properties.id)) });
    
    }