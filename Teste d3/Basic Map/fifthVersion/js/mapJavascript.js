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

/*var dataButton = 
    [{label: "", x: espacamentoEsquerda, y: espacamentoTopo,                        color: "rgb(247,251,255)", secretLabel: "0" },
    {label: "", x: espacamentoEsquerda, y: espacamentoTopo + espacamentoBotoes * 1, color: "rgb(222,235,247)", secretLabel: "1" },
    {label: "", x: espacamentoEsquerda, y: espacamentoTopo + espacamentoBotoes * 2, color: "rgb(198,219,239)", secretLabel: "2" },
    {label: "", x: espacamentoEsquerda, y: espacamentoTopo + espacamentoBotoes * 3, color: "rgb(158,202,225)", secretLabel: "3" },
    {label: "", x: espacamentoEsquerda, y: espacamentoTopo + espacamentoBotoes * 4, color: "rgb(107,174,214)", secretLabel: "4" },
    {label: "", x: espacamentoEsquerda, y: espacamentoTopo + espacamentoBotoes * 5, color: "rgb(66,146,198)", secretLabel: "5" },
    {label: "", x: espacamentoEsquerda, y: espacamentoTopo + espacamentoBotoes * 6, color: "rgb(33,113,181)", secretLabel: "6" },
    {label: "", x: espacamentoEsquerda, y: espacamentoTopo + espacamentoBotoes * 7, color: "rgb(8,81,156)", secretLabel: "7" },
    {label: "", x: espacamentoEsquerda, y: espacamentoTopo + espacamentoBotoes * 8, color: "rgb(8,48,107)", secretLabel: "8" }];*/

var dataButtonCores = 
    [{label: "", x: espacamentoEsquerda, y: espacamentoTopo + espacamentoBotoes * 1, color: "rgb(222,235,247)", secretLabel: "1" },
    {label: "", x: espacamentoEsquerda, y: espacamentoTopo + espacamentoBotoes * 2, color: "rgb(198,219,239)", secretLabel: "2" },
    {label: "", x: espacamentoEsquerda, y: espacamentoTopo + espacamentoBotoes * 3, color: "rgb(158,202,225)", secretLabel: "3" },
    {label: "", x: espacamentoEsquerda, y: espacamentoTopo + espacamentoBotoes * 4, color: "rgb(107,174,214)", secretLabel: "4" },
    {label: "", x: espacamentoEsquerda, y: espacamentoTopo + espacamentoBotoes * 5, color: "rgb(66,146,198)", secretLabel: "5" },
    {label: "", x: espacamentoEsquerda, y: espacamentoTopo + espacamentoBotoes * 6, color: "rgb(33,113,181)", secretLabel: "6" }];

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
var filterArrayLenght = 27;
    
// Create initial projection - will be changed later properly
projection
    .scale(1)
    .translate([0, 0]);

// Current map level
var mapLevel = "Brasil";
var mapLevelNumber = 1;

// Map Level hiera
var mapLevelOne = "Brasil";
var mapLevelTwo;
var mapLevelThree;

//Map Current loaded
var currentMap = "map/" + mapLevel + ".json";

//Data current loaded
var currentPopulacao = "data/brasil/" + mapLevel + "Populacao.tsv";
var currentArea = "data/brasil/" + mapLevel + "Area.tsv";

// Queue load the map and data
d3.queue()
    .defer(d3.json, currentMap)
    .defer(d3.tsv, currentPopulacao)
    .defer(d3.tsv, currentArea)
    .await(ready);

// Load Textures
var textureQ09 = textures.lines()
    .size(5)
    .strokeWidth(1);


var textureQ19 = textures.lines()
    .orientation("vertical")
    .size(5)
    .strokeWidth(1)
    .shapeRendering("crispEdges");

var textureQ29 = textures.circles()
    .thicker();

var textureQ39 = textures.circles()
    .radius(4)
    .size(7)
    .fill("transparent")
    .strokeWidth(2);

var textureQ49 = textures.lines()
    .size(10)
    .strokeWidth(1);

var textureQ59 = textures.lines()
    .size(5)
    .strokeWidth(1);

var textureQ69 = textures.lines()
    .size(3)
    .strokeWidth(1);

var textureQ79 = textures.lines()
    .size(14)
    .strokeWidth(3);

var textureQ89 = textures.lines()
    .size(16)
    .strokeWidth(3);

var testRect;

var menor1 = 0;
var menor2 = 0;
var menor3 = 0;
var menor4 = 0;
var menor5 = 0;
var menor6 = 0;

var maior1 = 0;
var maior2 = 0;
var maior3 = 0;
var maior4 = 0;
var maior5 = 0;
var maior6 = 0;

var menorPop1 = 0;
var menorPop2 = 0;
var menorPop3 = 0;
var menorPop4 = 0;
var menorPop5 = 0;
var menorPop6 = 0;

var maiorPop1 = 0;
var maiorPop2 = 0;
var maiorPop3 = 0;
var maiorPop4 = 0;
var maiorPop5 = 0;
var maiorPop6 = 0;

//svg.call(textureQ09);
//svg.call(textureQ19);
//svg.call(textureQ29);
//svg.call(textureQ39);
//svg.call(textureQ49);
//svg.call(textureQ59);
//svg.call(textureQ69);
//svg.call(textureQ79);
//svg.call(textureQ89);

var neighborhood;

var classes = 1;

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

var colorsOrange = 
             [{ colorMap: "rgb(255,245,235)",textureMap: textureQ09}, 
              { colorMap: "rgb(254,230,206)",textureMap: textureQ19},
              { colorMap: "rgb(253,208,162)",textureMap: textureQ29}, 
              { colorMap: "rgb(253,174,107)",textureMap: textureQ39}, 
              { colorMap: "rgb(253,141,60)",textureMap: textureQ49}, 
              { colorMap: "rgb(241,105,19)",textureMap: textureQ59}, 
              { colorMap: "rgb(217,72,1)",textureMap: textureQ69}, 
              { colorMap: "rgb(166,54,3)",textureMap: textureQ79}, 
              { colorMap: "rgb(127,39,4)",textureMap: textureQ89}
             ];

var colorsGreen = 
             [{ colorMap: "rgb(247,252,253)",textureMap: textureQ09}, 
              { colorMap: "rgb(229,245,249)",textureMap: textureQ19},
              { colorMap: "rgb(204,236,230)",textureMap: textureQ29}, 
              { colorMap: "rgb(153,216,201)",textureMap: textureQ39}, 
              { colorMap: "rgb(102,194,164)",textureMap: textureQ49}, 
              { colorMap: "rgb(65,174,118)",textureMap: textureQ59}, 
              { colorMap: "rgb(35,139,69)",textureMap: textureQ69}, 
              { colorMap: "rgb(0,109,44)",textureMap: textureQ79}, 
              { colorMap: "rgb(0,68,27)",textureMap: textureQ89}
             ];

var colorsRed = 
             [{ colorMap: "rgb(255,255,204)",textureMap: textureQ09}, 
              { colorMap: "rgb(255,237,160)",textureMap: textureQ19},
              { colorMap: "rgb(254,217,118)",textureMap: textureQ29}, 
              { colorMap: "rgb(254,178,76)",textureMap: textureQ39}, 
              { colorMap: "rgb(253,141,60)",textureMap: textureQ49}, 
              { colorMap: "rgb(252,78,42)",textureMap: textureQ59}, 
              { colorMap: "rgb(227,26,28)",textureMap: textureQ69}, 
              { colorMap: "rgb(189,0,38)",textureMap: textureQ79}, 
              { colorMap: "rgb(128,0,38)",textureMap: textureQ89}
             ];

// Function to manipulate the data in the map
function ready(error, mapObject, attributeOne, attributeTwo) {
    // mapObject = .json file - map
    // populacao = .tsv file - data
    
    if (error) throw error;
    
    console.log(mapObject);
    
    filterArray = {};
    
    neighborhood = svg.select("g")
                      .remove()
                      .exit();
    
    svg.call(d3.zoom().on("zoom", function () {
            neighborhood.attr("transform", d3.event.transform);
        
            d3.select(".neighborhood").selectAll("circle").attr("transform", d3.event.transform);
      }))
    
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
        filterArray[d.ID] = {id: d.ID, filtro1: 1, filtro2:1, scaleClassPopulacao: "", scaleClassArea: ""};
        // filterArray elements receive the same d.ID -- Correspondent Row, see above -- values of the attributeOne
        // Filter values starts at 1, meaning all data elements are included in the view
        // Scale class values will be set on the setScale function
    });
    
    // Create the scale for the attributeOne
    scales.populacao = d3.scaleThreshold() // 'jenks9' is the scale name -- used in the setScale function
      .domain(ss.jenks // Use Jenks Natural Breaks Classification Algorithm
              (attributeOne.map(function(d) { return +d.POPULACAO_TOTAL; }), 7)
              // Scale created use the 'd' property values -- Correspondet Row, see above --
              // Values are assigned into one of the 'n' classes -- 9 in this case
             )
      .range(d3.range(7).map(function(i) { return i; }));
    
    // Create the scale for the attributeTwo
    scales.area = d3.scaleThreshold()
      .domain(ss.jenks
              (attributeTwo.map(function(d) { return +d.AREA; }), 7)
             )
      .range(d3.range(7).map(function(i) { 
        if (i > classes){
            classes = i;
        }
        return i; }));
    
    var feat = topojson.feature(mapObject, mapObject.objects.collection);
    
    var b = path.bounds(feat),
      s = .95 / Math.max((b[1][0] - b[0][0]) / width, (b[1][1] - b[0][1]) / height),
      t = [(width - s * (b[1][0] + b[0][0])) / 2, (height - s * (b[1][1] + b[0][1])) / 2];
    
    projection
      .scale(s)
      .translate(t);
    
    neighborhood = svg.append("g")
        .attr("class", "neighborhood")
    .selectAll("path")
    .data(topojson.feature(mapObject, mapObject.objects.collection).features)
    .enter().append("path")
    .on('click', drillDown)
        .attr("d", path);
    
    d3.selectAll('input').on('change', function() {
      setScale(this.id);
});
        
    var button = d3.button()
    .on('press', function(d, i) { attributeTwo.forEach (mute.bind(null, d));
                                 setScale('area');
                                 console.log("Pressed", d, i, this.parentNode);})
    .on('release', function(d, i) { attributeTwo.forEach (unmute.bind(null, d));
                                    setScale('area');
                                    console.log("Released", d, i, this.parentNode)});
    
// Add buttons
var buttons = controlsSVG.selectAll('.button')
    .data(dataButtonCores)
  .enter()
    .append('g')
    .attr('class', 'button')
    .call(button);
    
var buttons2 = controlsSVG.selectAll('.button')
    .data(dataButtonCores)
  .enter()
    .append('g')
    .attr('class', 'button')
    .call(button);
    
    setText(attributeOneDataArray);
    
    // Default Scale loaded
    setScale('area');
    
    document.getElementById("texto1").innerHTML = maior1 + " - " + menor1;
    document.getElementById("texto2").innerHTML = maior2 + " - " + menor2;
    document.getElementById("texto3").innerHTML = maior3 + " - " + menor3;
    document.getElementById("texto4").innerHTML = maior4 + " - " + menor4;
    document.getElementById("texto5").innerHTML = maior5 + " - " + menor5;
    document.getElementById("texto6").innerHTML = maior6 + " - " + menor6;
    
    document.getElementById("texto7").innerHTML = maiorPop1 + " - " + menorPop1;
    document.getElementById("texto8").innerHTML = maiorPop2 + " - " + menorPop2;
    document.getElementById("texto9").innerHTML = maiorPop3 + " - " + menorPop3;
    document.getElementById("texto10").innerHTML = maiorPop4 + " - " + menorPop4;
    document.getElementById("texto11").innerHTML = maiorPop5 + " - " + menorPop5;
    document.getElementById("texto12").innerHTML = maiorPop6 + " - " + menorPop6;
    
    console.log(menorPop1);
    console.log(menor1);
    
    scatterDots(feat.features, 'populacao');
    
}

function drillDown(d) {
    // Verificar se eh Para ou Belem -- apenas estes disponiveis
    if ( (mapLevelNumber < 3) && ((d.properties.nome == "Para") || (d.properties.nome == "Belem") ) ){
        mapCurrentLevel = d.properties.nome;
        
        currentMap = "map/" + d.properties.nome + ".json";
        currentPopulacao = "data/brasil/" + d.properties.nome + "Populacao.tsv";
        currentArea = "data/brasil/" + d.properties.nome + "Area.tsv";
        
        menor1 = 0;
        menor2 = 0;
        menor3 = 0;
        menor4 = 0;
        menor5 = 0;
        menor6 = 0;

        maior1 = 0;
        maior2 = 0;
        maior3 = 0;
        maior4 = 0;
        maior5 = 0;
        maior6 = 0;
        
        menorPop1 = 0;
        menorPop2 = 0;
        menorPop3 = 0;
        menorPop4 = 0;
        menorPop5 = 0;
        menorPop6 = 0;

        maiorPop1 = 0;
        maiorPop2 = 0;
        maiorPop3 = 0;
        maiorPop4 = 0;
        maiorPop5 = 0;
        maiorPop6 = 0;
        
        attributeTwo = {};
    
        projection
        .scale(1)
        .translate([0, 0]);
        
        filterArray = {};
        
        mapLevelNumber = mapLevelNumber + 1;
        
        if (mapLevelNumber == 2){
            mapLevelTwo = d.properties.nome;
            document.getElementById("hierarchicTwo").innerHTML = d.properties.nome;
            
        } else if (mapLevelNumber == 3){
            mapLevelThree = d.properties.nome;
            document.getElementById("hierarchicThree").innerHTML = d.properties.nome;
        }
    
        d3.queue()
        .defer(d3.json, currentMap)
        .defer(d3.tsv, currentPopulacao)
        .defer(d3.tsv, currentArea)
    
        .await(ready);
    } else {
        if (mapLevelNumber == 3){
            loadGraph(d.properties.nome);
        }
        else {
            console.log("Nao disponivel");
        }
    }
    
}
    
function mute(botao, index){
    var labelBotao = botao.secretLabel;
    
    if(mapLevelNumber == 1){
        filterArrayLenght = 27;
    } else if (mapLevelNumber == 2){
        filterArrayLenght = 144;
    } else if (mapLevelNumber == 3){
        filterArrayLenght = 71;
    }
    
    for (i = 1; i < filterArrayLenght; i++) { 
        if ((filterArray[i].scaleClassArea) == (labelBotao)){
            filterArray[i].filtro2 = 0;
        }
    }

}
    
function unmute(botao, index){
    var labelBotao = botao.secretLabel;
        
    if(mapLevelNumber == 1){
        filterArrayLenght = 27;
    } else if (mapLevelNumber == 2){
        filterArrayLenght = 144;
    } else if (mapLevelNumber == 3){
        filterArrayLenght = 71;
    }
    
    for (i = 1; i < filterArrayLenght; i++) { 
        if ((filterArray[i].scaleClassArea) == (labelBotao)){
            filterArray[i].filtro2 = 1;
        }
    }
        
}

function setScale(s) {

    // Scale for populacao
    if (s == "populacao"){
        neighborhood.style("fill", function(d) { 
          if (filterArray[d.properties.id].filtro1 == 1)
              {
                  filterArray[d.properties.id].scaleClassPopulacao = scales[s](d.POPULACAO_TOTAL = attributeOneDataArray.get(d.properties.id));
                  return colors[scales[s](d.POPULACAO_TOTAL = attributeOneDataArray.get(d.properties.id))].colorMap;
              } else{
                    return "rgb(102, 103, 104)"; 
              }
        })
        
    }
    
    // Scale for area
      else if (s == "area"){
          neighborhood.style("fill", function(d) {
          if (filterArray[d.properties.id].filtro2 == 1)
              {
                  // Textura -> Populacao / Cor -> Area
                  filterArray[d.properties.id].scaleClassArea = scales["area"](d.AREA = attributeTwoDataArray.get(d.properties.id));
                  var cor = colors[scales["area"](d.AREA = attributeTwoDataArray.get(d.properties.id))].colorMap;
                  
                  if ((scales["area"](d.AREA = attributeTwoDataArray.get(d.properties.id))) == 1){
                      if(menor1 == 0){
                          menor1 = d.AREA;
                      }
                      
                      if((d.AREA) > maior1){
                          maior1 = d.AREA;
                      }
                      
                      if((d.AREA) < menor1){
                          menor1 = d.AREA;
                      }
                      
                  }
                  
                  if ((scales["area"](d.AREA = attributeTwoDataArray.get(d.properties.id))) == 2){
                      if(menor2 == 0){
                          menor2 = d.AREA;
                      }
                      
                      if((d.AREA) > maior2){
                          maior2 = d.AREA;
                      }
                      
                      if((d.AREA) < menor2){
                          menor2 = d.AREA;
                      }
                      
                  }
                  
                  if ((scales["area"](d.AREA = attributeTwoDataArray.get(d.properties.id))) == 3){
                      if(menor3 == 0){
                          menor3 = d.AREA;
                      }
                      
                      if((d.AREA) > maior3){
                          maior3 = d.AREA;
                      }
                      
                      if((d.AREA) < menor3){
                          menor3 = d.AREA;
                      }
                      
                  }
                  
                  if ((scales["area"](d.AREA = attributeTwoDataArray.get(d.properties.id))) == 4){
                      if(menor4 == 0){
                          menor4 = d.AREA;
                      }
                      
                      if((d.AREA) > maior4){
                          maior4 = d.AREA;
                      }
                      
                      if((d.AREA) < menor4){
                          menor4 = d.AREA;
                      }
                      
                  }
                  
                  if ((scales["area"](d.AREA = attributeTwoDataArray.get(d.properties.id))) == 5){
                      if(menor5 == 0){
                          menor5 = d.AREA;
                      }
                      
                      if((d.AREA) > maior5){
                          maior5 = d.AREA;
                      }
                      
                      if((d.AREA) < menor5){
                          menor5 = d.AREA;
                      }
                      
                  }
                  
                  if ((scales["area"](d.AREA = attributeTwoDataArray.get(d.properties.id))) == 6){
                      if(menor6 == 0){
                          menor6 = d.AREA;
                      }
                      
                      if((d.AREA) > maior6){
                          maior6 = d.AREA;
                      }
                      
                      if((d.AREA) < menor6){
                          menor6 = d.AREA;
                      }
                      
                  }
                  
                  //console.log(d.properties.nome);
                  //console.log(filterArray[d.properties.id]);
                  
                  filterArray[d.properties.id].scaleClassPopulacao = scales["populacao"](d.POPULACAO_TOTAL = attributeOneDataArray.get(d.properties.id));
                  var textureTemp = colors[scales["populacao"](attributeOneDataArray.get(d.properties.id))].textureMap;
                  textureTemp.background(cor);
                  svg.call(textureTemp);
                  
                  if (scales["populacao"](d.POPULACAO_TOTAL = attributeOneDataArray.get(d.properties.id)) == 1){
                      if(menorPop1 == 0){
                          menorPop1 = d.POPULACAO_TOTAL;
                      }
                      
                      if((d.POPULACAO_TOTAL) > maiorPop1){
                          maiorPop1 = d.POPULACAO_TOTAL;
                      }
                      
                      if((d.POPULACAO_TOTAL) < menorPop1){
                          menorPop1 = d.POPULACAO_TOTAL;
                      }
                      
                  }
                  
                  if (scales["populacao"](d.POPULACAO_TOTAL = attributeOneDataArray.get(d.properties.id)) == 2){
                      if(menorPop2 == 0){
                          menorPop2 = d.POPULACAO_TOTAL;
                      }
                      
                      if((d.POPULACAO_TOTAL) > maiorPop2){
                          maiorPop2 = d.POPULACAO_TOTAL;
                      }
                      
                      if((d.POPULACAO_TOTAL) < menorPop2){
                          menorPop2 = d.POPULACAO_TOTAL;
                      }
                      
                  }
                  
                  if (scales["populacao"](d.POPULACAO_TOTAL = attributeOneDataArray.get(d.properties.id)) == 3){
                      if(menorPop3 == 0){
                          menorPop3 = d.POPULACAO_TOTAL;
                      }
                      
                      if((d.POPULACAO_TOTAL) > maiorPop3){
                          maiorPop3 = d.POPULACAO_TOTAL;
                      }
                      
                      if((d.POPULACAO_TOTAL) < menorPop3){
                          menorPop3 = d.POPULACAO_TOTAL;
                      }
                      
                  }
                  
                  if (scales["populacao"](d.POPULACAO_TOTAL = attributeOneDataArray.get(d.properties.id)) == 4){
                      if(menorPop4 == 0){
                          menorPop4 = d.POPULACAO_TOTAL;
                      }
                      
                      if((d.POPULACAO_TOTAL) > maiorPop4){
                          maiorPop4 = d.POPULACAO_TOTAL;
                      }
                      
                      if((d.POPULACAO_TOTAL) < menorPop4){
                          menorPop4 = d.POPULACAO_TOTAL;
                      }
                      
                  }
                  
                  if (scales["populacao"](d.POPULACAO_TOTAL = attributeOneDataArray.get(d.properties.id)) == 5){
                      if(menorPop5 == 0){
                          menorPop5 = d.POPULACAO_TOTAL;
                      }
                      
                      if((d.POPULACAO_TOTAL) > maiorPop5){
                          maiorPop5 = d.POPULACAO_TOTAL;
                      }
                      
                      if((d.POPULACAO_TOTAL) < menorPop5){
                          menorPop5 = d.POPULACAO_TOTAL;
                      }
                      
                  }
                  
                  if (scales["populacao"](d.POPULACAO_TOTAL = attributeOneDataArray.get(d.properties.id)) == 6){
                      if(menorPop6 == 0){
                          menorPop6 = d.POPULACAO_TOTAL;
                      }
                      
                      if((d.POPULACAO_TOTAL) > maiorPop6){
                          maiorPop6 = d.POPULACAO_TOTAL;
                      }
                      
                      if((d.POPULACAO_TOTAL) < menorPop6){
                          menorPop6 = d.POPULACAO_TOTAL;
                      }
                      
                  }
                  
                  return textureTemp.url();
                  return cor;
                                
                  // Area
                  /*filterArray[d.properties.id].scaleClass = scales[s](d.AREA = attributeTwoDataArray.get(d.properties.id));
                  return colors[scales[s](d.AREA = attributeTwoDataArray.get(d.properties.id))].colorMap;*/
              } else{
                  
                  return "rgb(130, 138, 153)";
              }
         })
      }
    
    /*neighborhood.on("click", function(d){
        loadGraph(d.properties.nome);});*/
  }

function setText(d){
        neighborhood.append("title")
            .text(function(d) { return "ID: " + d.properties.id + ". " + d.properties.nome + ". Populacao: " + (d.POPULACAO_TOTAL = attributeOneDataArray.get(d.properties.id)) + ". Area: " + (d.AREA = attributeTwoDataArray.get(d.properties.id)) });
    
        var dots = d3.select(".neighborhood").selectAll("circle");
    
        dots.append("title")
            .text(function(d) { return "ID: " + d.properties.id + ". " + d.properties.nome + ". Populacao: " + (d.POPULACAO_TOTAL = attributeOneDataArray.get(d.properties.id)) + ". Area: " + (d.AREA = attributeTwoDataArray.get(d.properties.id)) });
    
    }

function createDots(){
    // add circles to svg
    d3.select(".neighborhood").selectAll("circle")
		.data([aa]).enter()
		.append("circle")
		.attr("cx", function (d) { return projection(d)[0]; })
		.attr("cy", function (d) { return projection(d)[1]; })
		.attr("r", "8px")
		.attr("fill", "red")
}

function scatterDots(features, s){
    
    d3.select(".neighborhood").selectAll("circle")
        .data( features ).enter()
        .append("circle")
        .on("click", drillDown)
        .attr("cx", function (d) { var num = [d.properties.pontoLongitude, d.properties.pontoLatitude]; return projection(num)[0]; } )
        .attr("cy", function (d) { var num = [d.properties.pontoLongitude, d.properties.pontoLatitude]; return projection(num)[1]; } )
        .attr("r", function (d) { 
                    filterArray[d.properties.id].scaleClassPopulacao = scales[s](d.POPULACAO_TOTAL = attributeOneDataArray.get(d.properties.id));
                    return scales[s](d.POPULACAO_TOTAL = attributeOneDataArray.get(d.properties.id)) + "px";
    } )
        .attr("fill", "red")
        .append("title")
            .text(function (d) { return "ID: " + d.properties.id + ". " + d.properties.nome + ". Populacao: " + (d.POPULACAO_TOTAL = attributeOneDataArray.get(d.properties.id)) + ". Area: " + (d.AREA = attributeTwoDataArray.get(d.properties.id)); } );
}

d3.select("b#hierarchicOne").on("click", returnDownOne);
d3.select("b#hierarchicTwo").on("click", returnDownTwo);
d3.select("b#hierarchicThree").on("click", returnDownThree);

function returnDownOne(){
    var novoDrillDown = document.getElementById("hierarchicOne").innerHTML;
    mapCurrentLevel = novoDrillDown;
        
        currentMap = "map/" + novoDrillDown + ".json";
        currentPopulacao = "data/brasil/" + novoDrillDown + "Populacao.tsv";
        currentArea = "data/brasil/" + novoDrillDown + "Area.tsv";
    
        menor1 = 0;
        menor2 = 0;
        menor3 = 0;
        menor4 = 0;
        menor5 = 0;
        menor6 = 0;

        maior1 = 0;
        maior2 = 0;
        maior3 = 0;
        maior4 = 0;
        maior5 = 0;
        maior6 = 0;
    
        menorPop1 = 0;
        menorPop2 = 0;
        menorPop3 = 0;
        menorPop4 = 0;
        menorPop5 = 0;
        menorPop6 = 0;

        maiorPop1 = 0;
        maiorPop2 = 0;
        maiorPop3 = 0;
        maiorPop4 = 0;
        maiorPop5 = 0;
        maiorPop6 = 0;
    
        document.getElementById("hierarchicTwo").innerHTML = "";
        document.getElementById("hierarchicThree").innerHTML = "";
    
        mapLevelTwo = "";
        mapLevelThree = "";
    
        projection
        .scale(1)
        .translate([0, 0]);
        
        mapLevelNumber = 1;
    
        d3.queue()
        .defer(d3.json, currentMap)
        .defer(d3.tsv, currentPopulacao)
        .defer(d3.tsv, currentArea)
    
        .await(ready);
}

function returnDownTwo(){
    var novoDrillDown = document.getElementById("hierarchicTwo").innerHTML;
    mapCurrentLevel = novoDrillDown;
        
        currentMap = "map/" + novoDrillDown + ".json";
        currentPopulacao = "data/brasil/" + novoDrillDown + "Populacao.tsv";
        currentArea = "data/brasil/" + novoDrillDown + "Area.tsv";
    
        menor1 = 0;
        menor2 = 0;
        menor3 = 0;
        menor4 = 0;
        menor5 = 0;
        menor6 = 0;

        maior1 = 0;
        maior2 = 0;
        maior3 = 0;
        maior4 = 0;
        maior5 = 0;
        maior6 = 0;
    
        menorPop1 = 0;
        menorPop2 = 0;
        menorPop3 = 0;
        menorPop4 = 0;
        menorPop5 = 0;
        menorPop6 = 0;

        maiorPop1 = 0;
        maiorPop2 = 0;
        maiorPop3 = 0;
        maiorPop4 = 0;
        maiorPop5 = 0;
        maiorPop6 = 0;
    
        projection
        .scale(1)
        .translate([0, 0]);
        
        mapLevelNumber = 2;
    
        document.getElementById("hierarchicTwo").innerHTML = mapLevelTwo;
        document.getElementById("hierarchicThree").innerHTML = "";
    
        mapLevelThree = "";
    
        d3.queue()
        .defer(d3.json, currentMap)
        .defer(d3.tsv, currentPopulacao)
        .defer(d3.tsv, currentArea)
    
        .await(ready);
}

function returnDownThree(){
    var novoDrillDown = document.getElementById("hierarchicThree").innerHTML;
    mapCurrentLevel = novoDrillDown;
        
        currentMap = "map/" + novoDrillDown + ".json";
        currentPopulacao = "data/brasil/" + novoDrillDown + "Populacao.tsv";
        currentArea = "data/brasil/" + novoDrillDown + "Area.tsv";
    
        menor1 = 0;
        menor2 = 0;
        menor3 = 0;
        menor4 = 0;
        menor5 = 0;
        menor6 = 0;

        maior1 = 0;
        maior2 = 0;
        maior3 = 0;
        maior4 = 0;
        maior5 = 0;
        maior6 = 0;
    
        menorPop1 = 0;
        menorPop2 = 0;
        menorPop3 = 0;
        menorPop4 = 0;
        menorPop5 = 0;
        menorPop6 = 0;

        maiorPop1 = 0;
        maiorPop2 = 0;
        maiorPop3 = 0;
        maiorPop4 = 0;
        maiorPop5 = 0;
        maiorPop6 = 0;
    
        projection
        .scale(1)
        .translate([0, 0]);
        
        mapLevelNumber = 3;
    
        d3.queue()
        .defer(d3.json, currentMap)
        .defer(d3.tsv, currentPopulacao)
        .defer(d3.tsv, currentArea)
    
        .await(ready);
}