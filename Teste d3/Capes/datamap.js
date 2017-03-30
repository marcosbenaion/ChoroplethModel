define(function(){

	function DataMap(container){
		var topo,projection,path,svg,g,zoom,tooltip,width,height, configs,mapa,corDefault;

		// inicializa o datamap
		init();
		
		
		
		// faz o desenho do mapa
		this.drawMap = function(topology,layer,config){
			configs = config;
			topo= topojson.feature(topology, topology.objects[layer]);
			topo.id = topology.id; 
			draw();
		}
		
		
		
		// função usada para configurar os elementos iniciais
		function init(){
			configs = {};
			corDefault = '#e4d6c5';
			
			// adiciona o suporte ao redimensionamento do browser 
			var throttleTimer;
			$(window).on("resize", function(){
				  window.clearTimeout(throttleTimer);
				    throttleTimer = window.setTimeout(function() {
				    	mapa = null;
				    	draw(topo);
				    }, 200);
			});

			// cria a tooltip
			tooltip = d3.select(container).append("div").attr("class", "tooltip hidden");
	
			// cria controle de zoom
			zoom = d3.behavior.zoom().scaleExtent([1, 6]).on("zoom", move);
			//  cria o elemento svg
		  	svg = d3.select(container).append("svg").call(zoom); //.append("g"); 
	
		  	// adiciona o elemento grafico
		  	g = svg.append("g");
		}
				
		
	
		
		// função responsável por fazer o desenho do mapa
		function draw() {
			g.attr('transform','');
			 width =  d3.select(container)[0][0].offsetWidth;
			 height =  d3.select(container)[0][0].offsetHeight-60;
			 d3.select(container).select("svg").attr("width", width).attr("height", height);
			 
			// centraliza o elemento no mapa
			var projection = d3.geo.equirectangular().scale(1);
 
			// Create a path generator.
			var path = d3.geo.path().projection(projection);
			
			var center = d3.geo.centroid(topo);
			var bounds  = path.bounds(topo);
			var b = path.bounds(topo),
		    s = 0.95 / Math.max((b[1][0] - b[0][0]) / width, (b[1][1] - b[0][1]) / height);
			 

			projection = d3.geo.equirectangular()
			.scale(s)
			.translate([((width)/2), ((height-120)/2)]);
			
			if (topo.id!='MUNDO')
				projection.center(center);
			
			path =  d3.geo.path().projection(projection); 
			
			var geoElement, itens;

			// carrega os elementos geograficos
			geoElement = g.selectAll(".element");
			
			
		    
			
			// caso seja o mesmo mapa apenas limpa o elemento
			if (mapa == topo.id){
				// reseta as cores 
				if (configs.style){
					geoElement.style("fill", function(d, i) { return configs.style(d.properties); })
				}	
		    
			} else {
				mapa = topo.id;
				g.selectAll(".element").remove();
				geoElement  = g.selectAll(".element").data(topo.features);
			  
				var x = 0;
				geoElement.enter().insert("path")
				  .style("fill", corDefault)
				  .style('cursor','pointer')
			      .attr("class", "element ")
			      .attr("d", path) 
			      .attr("id", function(d,i) { return "m-"+x++; })
			  if (configs.style){
		    	geoElement.style("fill", function(d, i) { return configs.style(d.properties); })
			  }
			}
			
			var x=0;
			g.selectAll("text").remove();
			g.selectAll("text").data(topo.features).enter().append("svg:text")
			.text(function(d) {
				return configs.label(d.properties);
			})
			.attr('id',function(){return "l-"+x++;})
			.style('cursor','pointer')
			.attr("x", function(d) {
				return path.centroid(d)[0];
			}).attr("y", function(d) {
				return path.centroid(d)[1];
			}).attr("text-anchor", "middle").attr('font-size', '10');
			
			
			// tooltips
			geoElement
			.on("mousemove", function(d,i) {
				var mouse = d3.mouse(svg.node()).map( function(d) { return parseInt(d); } );
	
		      
				var text = "";
				if (configs.tooltip) {
					text = configs.tooltip(d.properties);
				}
				
				if (text!='') {
					
					tooltip.classed("hidden", false)
		             	.attr("style", "left:"+(mouse[0]+10)+"px;top:"+(mouse[1]+10)+"px")
		             	.html(text);
				}
				
			})
			.on("mouseout",  function(d,i) {
		        	tooltip.classed("hidden", true);
			}); 
		  
			//add support click
			if (configs.click){
				var clickElm = false;
				
				var handleClick = function(d,i){
					clickElm = true;
					configs.click(d.properties);
					 d3.event.stopPropagation();
					 g.selectAll(".element").classed('selected',false);
					 
					 var id = d3.select(this).attr('id');
					 
					 id = id.replace('l','m');
					 
					 d3.select("#"+id).classed('selected',true);
				};
				
				g.selectAll("text").on('click',handleClick);
				
				geoElement.on("click",handleClick );
				

				d3.select(container).select("svg").on('click',function(){
					if (!clickElm){
						configs.click();
						d3.event.stopPropagation();
					}
					g.selectAll(".element").classed('selected',false);
					clickElm = false;
				})
			}
			
		}
		
		
	
	
	    // função usada para tratar movimento de zoom 
		function move() {
			  var t = d3.event.translate;
			  var s = d3.event.scale; 
			  zscale = s;
			  var h = height/4; 
	
	
			  t[0] = Math.min(
			    (width/height)  * (s - 1), 
			    Math.max( width * (1 - s), t[0] )
			  );
	
			  t[1] = Math.min(
			    h * (s - 1) + h * s, 
			    Math.max(height  * (1 - s) - h * s, t[1])
			  );
	
			  zoom.translate(t);
			  g.attr("transform", "translate(" + t + ")scale(" + s + ")");
	
			  //adjust the element hover stroke width based on zoom level
			  d3.selectAll(".element").style("stroke-width", 1.5 / s);
			  g.selectAll("text").attr('font-size', 10/s);
		}
	}

	return DataMap;
})