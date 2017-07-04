var nomeBairroChart;

function loadGraph(bairroNome){
    
    nomeBairroChart = bairroNome;
    
    var bairroSelecionado = "data/bairros/testVar/" + bairroNome + ".tsv";
    
    d3.tsv(bairroSelecionado, function(d) {
        d.value = +d.value;
        return d;
        }, function(error, data) {
        if (error) throw error;

        update(data);
    });
    
}

function update(data){
    //set domain for the x axis
	xChart.domain(data.map(function(d){ return d.id;}));
    
    //set domain for y axis
	yChart.domain( [0, d3.max(data, function(d){ return +d.value; })] );
    
    //get the width of each bar 
	var barWidth = width / data.length;
    
    //select all bars on the graph, take them out, and exit the previous data set. 
	//then you can add/enter the new data set
	var bars = chart.selectAll(".bar")
					.remove()
					.exit()
					.data(data)
    
    //now actually give each rectangle the corresponding data
	bars.enter()
		.append("rect")
		.attr("class", "bar")
		.attr("x", function(d, i){ return i * barWidth + 1 })
		.attr("y", function(d){ return yChart( d.value); })
		.attr("height", function(d){ return height - yChart(d.value); })
		.attr("width", barWidth - 1)
		.attr("fill", "rgb(179,205,227)");
    
    //left axis
	chart.select('.y')
		  .call(yAxis)
	//bottom axis
	chart.select('.xAxis')
		.attr("transform", "translate(0," + height + ")")
		.call(xAxis)
		.selectAll("text")
			.style("text-anchor", "end")
			.attr("dx", "-.8em")
			.attr("dy", ".15em")
			.attr("transform", function(d){
				return "rotate(-65)";
			});
			
}//end update

//set up chart
var margin = {top: 20, right: 20, bottom: 95, left: 70};
var width = 450;
var height = 500;

var chart = d3.select(".chart")
				.attr("width", width + margin.left + margin.right)
				.attr("height", height + margin.top + margin.bottom)
				.append("g")
				.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

var xChart = d3.scaleBand()
				.range([0, width]);
				
var yChart = d3.scaleLinear()
				.range([height, 0]);

var xAxis = d3.axisBottom(xChart);
var yAxis = d3.axisLeft(yChart);

//set up axes
//left axis
	chart.append("g")
		  .attr("class", "y axis")
		  .call(yAxis)
		  
	//bottom axis
	chart.append("g")
		.attr("class", "xAxis")
		.attr("transform", "translate(0," + height + ")")
		.call(xAxis)
		.selectAll("text")
			.style("text-anchor", "end")
			.attr("dx", "-.8em")
			.attr("dy", ".15em")
			.attr("transform", function(d){
				return "rotate(-65)";
			});

//add labels
chart
	.append("text")
	.attr("transform", "translate(-60," +  (height+margin.bottom)/2 + ") rotate(-90)")
	.text("Dado");
		
chart
	.append("text")
	.attr("transform", "translate(" + (width/2) + "," + (height + margin.bottom - 5) + ")")
	.text("Ano");

/*function draw(data){
      x.domain(data.map(function(d) { return d.id; }));
      y.domain([0, d3.max(data, function(d) { return d.value; })]);
    
    g.append("g")
          .attr("class", "axis axis--x")
          .attr("transform", "translate(0," + height + ")")
          .call(d3.axisBottom(x));

      g.append("g")
          .attr("class", "axis axis--y")
          .call(d3.axisLeft(y).ticks(10))
        .append("text")
          .attr("transform", "rotate(-90)")
          .attr("y", 6)
          .attr("dy", "0.71em")
          .attr("text-anchor", "end")
          .text("Frequency");

      var bars = svg.selectAll(".bar").data(data, function(d) { return d.id; })
      
      bars.exit()
        .transition()
        .duration(300)
        .attr("y", y(6))
        .attr("height", height - y(6))
    .   style('fill-opacity', 1e-6)
        .remove();

      // data that needs DOM = enter() (a set/selection, not an event!)
      bars.enter().append("rect")
        .attr("class", "bar")
        .attr("y", y(6))
        .attr("height", height - y(6));

      // the "UPDATE" set:
      bars.transition().duration(300).attr("x", function(d) { return x(d.id); }) // (d) is one item from the data array, x is the scale object from above
        .attr("width", x.bandwidth()) // constant, so no callback function(d) here
        .attr("y", function(d) { return y(d.value); })
        .attr("height", function(d) { return height - y(d.value); }); // flip the height, because y's domain is bottom up, but SVG renders top down
}*/