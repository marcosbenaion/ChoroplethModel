var svg = d3.select("svg#barSVG"),
    margin = {top: 20, right: 20, bottom: 30, left: 40},
    width = +svg.attr("width") - margin.left - margin.right,
    height = +svg.attr("height") - margin.top - margin.bottom;

var x = d3.scaleBand().rangeRound([0, width]).padding(0.1),
    y = d3.scaleLinear().rangeRound([height, 0]);

var yearArray =[];

var g = svg.append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

d3.tsv("data/populacaoBelemAno.tsv", function(error, data) {
  if (error) throw error;
    
    data.forEach(function(d) {
        yearArray[d.ID] = {id: d.ID, 
                           ano_2012: d.ANO_2012, 
                           ano_2013: d.ANO_2013, 
                           ano_2014: d.ANO_2014, 
                           ano_2015: d.ANO_2015, 
                           ano_2016: d.ANO_2016};
    });

  x.domain(data.map(function(d) { return yearArray[d.ID].id; }));
  y.domain([0, d3.max(data, function(d) { return yearArray[d.ID].ano_2012; })]);

  g.append("g")
      .attr("class", "axis axis--x")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(x));

  g.append("g")
      .attr("class", "axis axis--y")
      .call(d3.axisLeft(y).ticks(10, "%"))
    .append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 6)
      .attr("dy", "0.71em")
      .attr("text-anchor", "end")
      .text("Frequency");

  g.selectAll(".bar")
    .data(data)
    .enter().append("rect")
      .attr("class", "bar")
      .attr("x", function(d) { return x(d.ID); })
      .attr("y", function(d) { return y(d.ANO_2012); })
      .attr("width", x.bandwidth())
      .attr("height", function(d) { return height - y(d.ANO_2012); });
});