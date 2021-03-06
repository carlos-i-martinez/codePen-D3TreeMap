var url = 'https://cdn.rawgit.com/freeCodeCamp/testable-projects-fcc/a80ce8f9/src/data/tree_map/movie-data.json';

d3.json(url).then(function (data) {


  var nodes = d3.select("#visual").append("svg").
  attr("width", 1220).
  attr("height", 1020);

  var myTool = d3.select("#visual").
  append("div").
  attr("class", "myTool").
  attr("id", "tooltip").
  style("opacity", 0);


  var treemapLayout = d3.treemap().
  size([1200, 600]).
  paddingInner(1);
  //.round(true);

  var rootNode = d3.hierarchy(data).
  sum(function (d) {
    return d.value;
  }).
  sort(function (a, b) {
    return b.value - a.value;
  });

  //treemapLayout.tile(d3.treemapSquarify.ratio(1))  
  treemapLayout(rootNode);

  var nodes1 = d3.select('svg').
  selectAll('g').
  data(rootNode.leaves()).
  enter().
  append('g').
  attr('transform', function (d) {return 'translate(' + [d.x0, d.y0] + ')';});

  var colorHold = ['#F52222', '#D9F522', '#22F522', '#22F5C3', '#22CAF5', '#2292F5', '#7622F5'];

  nodes1.
  append('rect').
  attr("class", "tile").
  attr("data-name", d => d.data.name).
  attr("data-category", d => d.data.category).
  attr("data-value", d => d.data.value).
  attr('width', function (d) {return d.x1 - d.x0;}).
  attr('height', function (d) {return d.y1 - d.y0;}).
  attr("fill", d => {
    if (d.data.category.localeCompare('Action') == 0) {
      return colorHold[0];
    } else
    if (d.data.category == 'Drama') {
      return colorHold[1];
    } else
    if (d.data.category == 'Adventure') {
      return colorHold[2];
    } else
    if (d.data.category == 'Family') {
      return colorHold[3];
    } else
    if (d.data.category == 'Animation') {
      return colorHold[4];
    } else
    if (d.data.category == 'Comedy') {
      return colorHold[5];
    } else
    {
      return colorHold[6];
    }
  }).
  on("mouseover", function (d, i) {

    myTool.transition().duration(250).style("opacity", 1);
    myTool.html(
    "<p><strong>" + d.data.name + "</strong></p>" +
    "<table><tbody><tr><td class='wide'>Category:</td><td>" + d.data.category + "</td></tr>" + "<tr><td class='wide'>Sales:</td><td>" + format(d.data.value) + "</td></tr>" +
    "</tbody></table>").
    attr("data-value", d.data.value).
    style("left", d3.event.pageX + 20 + "px").
    style("top", d3.event.pageY - 20 + "px").
    style("display", "inline-block").
    style("opacity", 1);
  }).
  on("mouseout", function (d) {
    myTool.style("display", "none");
  });

  format = d3.format(",d");
  nodes1.append("text").
  selectAll("tspan").
  data(d => d.data.name.split(/(?=[A-Z][^A-Z])/g))
  //.data(d => d.data.name.split("(\s+)/g"))
  .join("tspan").
  attr("x", 3).
  attr("y", (d, i, nodes) => `${(i === nodes.length - 1) * 0.3 + 1.1 + i * 0.9}em`).
  text(d => d);

  // Legends section          
  legends = nodes.append("g").attr("class", "legends").
  attr("id", "legend").
  attr("transform", "translate(" + 500 + "," + 610 + ")");


  var colorScale = d3.scaleOrdinal().domain([0, 1, 2, 3, 4, 5, 6]).range(colorHold);

  //Legend Rectangels
  legends.append("g").attr("class", "LegRect").
  attr("transform", "translate(0," + 9 + ")").
  selectAll("rect").data(colorScale.range()).enter().
  append("rect").
  attr("class", "legend-item").
  attr("width", 200 / colorScale.range().length + "px").
  attr("height", "20px").attr("fill", function (d) {return d;}).
  attr("stroke", "black").
  attr("y", function (d, i) {return i * (200 / colorScale.range().length);});

  var colorLText = ["Action", "Drama", "Adventure", "Family", "Animation", "Comedy", "Biography"];

  legends.selectAll("text").
  data(colorScale.range()).
  enter().
  append("text").
  text((d, i) => colorLText[i]).
  attr("x", 30).
  attr("y", function (d, i) {return 25 + i * (200 / colorScale.range().length);});

});