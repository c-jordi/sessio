

var IMAGE_SIZE = 50;

var svg = d3.select("svg#visualizer"),
width = svg.attr("width"),
height = svg.attr("height");

var color = d3.scaleOrdinal(d3.schemeCategory20);

const forceX = d3.forceX(width / 2).strength(0.01)
const forceY = d3.forceY(height / 2).strength(0.01)
const forceVer = d3.forceY().strength(function(d){console.log("force", d.title,  -(d.id-3)/50);return -(d.id-3)/50})

var simulation = d3.forceSimulation()
  .force("link", d3.forceLink().id(function(d) { return d.id; }).strength(0.5))
  .force("charge", d3.forceManyBody().strength(-400))
  .force("center", d3.forceCenter(width / 2, height / 2))
  .force("forceVer",forceVer);

  // .force('x', forceX)
  // .force('y',  forceY);

function drawGraph(graph) {

  var link = svg.append("g")
    .attr("class", "links")
    .selectAll("line")
    .data(graph.links)
    .enter().append("line")
    .attr("stroke-width", function(d) { return d.value*3; })
    .attr("stroke", "red")
    .style("stroke-opacity", function(d){return d.value/2;});


  // Update the nodes…
  var node = svg.append("g")
    .attr("class", "nodes")
    .selectAll("g.node")
    .data(graph.nodes, function(d) { return d.id; });


  // Enter any new nodes.
  var nodeEnter = node.enter().append("svg:g")
    .attr("class", "node")
    .on("mouseover", nodeDetails)
    // .on("mouseout", mouseOut)
    .on("click", click);
    /*.call(d3.drag()
        .on("start", dragstarted)
        .on("drag", dragged)
        .on("end", dragended));*/





  // Append a circle
  var images = nodeEnter.append("svg:image")
    .attr("xlink:href",  function(d) { return d.favIconUrl;})
    .attr("style","filter:grayscale(100%);")
    .attr("x", function(d) { return -Math.floor(IMAGE_SIZE/2);})
    .attr("y", function(d) { return -Math.floor(IMAGE_SIZE/2);})
    .attr("height", IMAGE_SIZE)
    .attr("width", IMAGE_SIZE);











  simulation
  .nodes(graph.nodes)
  .on("tick", ticked);

  simulation.force("link")
  .links(graph.links);

  node = svg.selectAll("g.node");

  function ticked() {

    link
    .attr("x1", function(d) { return d.source.x; })
    .attr("y1", function(d) { return d.source.y; })
    .attr("x2", function(d) { return d.target.x; })
    .attr("y2", function(d) { return d.target.y; });

    // node
    // .attr("cx", function(d) { return d.x; })
    // .attr("cy", function(d) { return d.y; });
    node
    .attr("transform", function(d) {
      return "translate(" + (d.x) + "," + (d.y) + ")";
    })
  }
}
maxNodeSize = 50

function click(d){
    chrome.runtime.sendMessage({fn: "navigate", url: d.url});
}


function nodeDetails(d){
    mouseOut();
    document.getElementById("node_tit").innerText = d.title;
    document.getElementById("node_url").innerText = purl(d.url).attr('host');;

    new Typed("#node_des",{
        strings: [d.mainWords.join(', ')],
        typeSpeed: 0,
        backSpeed: 0,
        fadeOut: true,
        showCursor:false
    });


}

function mouseOut(){
    document.getElementById('node_tit').innerText ="";
    document.getElementById('node_url').innerText ="";
    document.getElementById('node_des').innerText ="";
}
