var svg = d3.select("svg#barSVG"),
    margin = {top: 20, right: 20, bottom: 30, left: 60},
    width = +svg.attr("width") - margin.left - margin.right,
    height = +svg.attr("height") - margin.top - margin.bottom;

var x = d3.scaleBand().rangeRound([0, width]).padding(0.1),
    y = d3.scaleLinear().rangeRound([height, 0]);

var g = svg.append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

function loadGraph(bairroNome){
    
    var bairroSelecionado = "data/bairros/testVar/" + bairroNome + ".tsv";
    
        d3.tsv(bairroSelecionado, function(d) {
      d.value = +d.value;
      return d;
    }, function(error, data) {
      if (error) throw error;

      draw(data);
    });
    
}

function draw(data){
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
}