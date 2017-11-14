function everythingD3() {


var svg = d3.select("svg"),
width = svg.attr("width"),
height = svg.attr("height");

var color = d3.scaleOrdinal(d3.schemeCategory20);

var simulation = d3.forceSimulation()
  .force("link", d3.forceLink().id(function(d) { return d.id; }))
  .force("charge", d3.forceManyBody())
  .force("center", d3.forceCenter(width / 2, height / 2));

function drawGraph(graph) {

  var link = svg.append("g")
    .attr("class", "links")
    .selectAll("line")
    .data(graph.links)
    .enter().append("line")
    .attr("stroke-width", function(d) { return Math.sqrt(d.value); });


  var node = svg.append("g")
    .attr("class", "nodes")
    .selectAll("circle")
    .data(graph.nodes)
    .enter().append("circle")
    .attr("r", 5)
    .attr("fill", function(d) { return color(d.group); })
    .call(d3.drag()
        .on("start", dragstarted)
        .on("drag", dragged)
        .on("end", dragended)
    );

  node.append("title")
  .text(function(d) { return d.id; });

  simulation
  .nodes(graph.nodes)
  .on("tick", ticked);

  simulation.force("link")
  .links(graph.links);

  function ticked() {
    link
    .attr("x1", function(d) { return d.source.x; })
    .attr("y1", function(d) { return d.source.y; })
    .attr("x2", function(d) { return d.target.x; })
    .attr("y2", function(d) { return d.target.y; });

    node
    .attr("cx", function(d) { return d.x; })
    .attr("cy", function(d) { return d.y; });
  }
}

function dragstarted(d) {
  if (!d3.event.active) simulation.alphaTarget(0.3).restart();
  d.fx = d.x;
  d.fy = d.y;
}

function dragged(d) {
  d.fx = d3.event.x;
  d.fy = d3.event.y;
}

function dragended(d) {
  if (!d3.event.active) simulation.alphaTarget(0);
  d.fx = null;
  d.fy = null;
}

function processNodes(pages) {
  var nodes = []
  var edges = []
  var pageCount = {}

  pages.forEach(function(page) {
    console.log(page.id);
    if (pageCount[page.id] != undefined) {
      pageCount[page.id] = pageCount[page.id] + 1;
    } else {
      pageCount[page.id] = 0;
    }

    var dup = JSON.parse(JSON.stringify(page))
    dup.id = page.id + '-' + pageCount[page.id]
    console.log(dup);
    if (dup.openerTabId != undefined){
        dup.status="child";
            if (page.url.toLowerCase().includes("chrome://") ) {
                dup.status="chrome tab"
            }
    }
    else if ((dup.openerTabId == undefined) && (dup.url != undefined)) {
        dup.status="parent";
    
    }
    else {
        dup.status="close";
    }
    nodes.push(dup);


    if (pageCount[page.id]) {
      edges.push({
        source : page.id + '-' + (pageCount[page.id] - 1),
        target : dup.id,
        value : 1
      })
    } else {
      if (page.openerTabId && pageCount[page.openerTabId]) {
        edges.push({
          source : page.openerTabId + '-' + pageCount[page.openerTabId],
          target : dup.id,
          value : 1
        })
      }
    }
  });

  return {
    nodes : nodes,
    links : edges
  };
}

window.processNodes = processNodes
window.drawGraph = drawGraph

}
