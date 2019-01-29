var width = 500, height = 500;
var threshold = 0;
var count = 0;
var yVelocity = 2;
var nodes = []

var interval = setInterval(function () {
    let x = getRandomArbitrary(10, width)
    nodes.push({
        r: getRandomArbitrary(5, 20),
        x: x,
        y: 0,
        cx: x,
        cy: 0
    })
    update();
    if (nodes.length == 300)
        clearInterval(interval);
}, 100)

var svg = d3.select("svg")
    .attr("width", width)
    .attr("height", height);


function update() {
    let circle = svg.selectAll("circle")
        .data(nodes)

    circle.enter()
        .append("circle").merge(circle)
        .attr("r", function (d) {
            return d.r;
        })
        .attr("x", function (d) {
            return d.x;
        })
        .attr("y", function (d) {
            return d.y;
        }).attr("cx", function (d) {
        return d.cx;
    })
        .attr("cy", function (d) {
            return d.cy;
        });

    circle
        .exit()
        .remove()

    simulation.stop();
    simulation = createSimulation();
}

function createSimulation() {

    return d3.forceSimulation(nodes)
        .alphaTarget(1)
        .force('collision', d3.forceCollide().radius((d) => {
            return d.r
        }).strength(0.4).iterations(5))
        .on('tick', tickedY);
}

simulation = createSimulation();
update();
// var circle =
// .style("fill", function(d) { return color(d.cluster); })

// var heart =
// d3.forceCenter().x(100).y(100)
// var simulation = d3.forceSimulation(nodes)
// .force("alphaMin",1)
// .force("y", d3.forceY(height * 10).strength(.000022))
// .force("x", d3.forceX(height*10).strength(.000022))
//     .alphaMin(1)
//     .alphaTarget(1)
// .velocityDecay(0.6)
// .force("xAxis",d3.forceX().strength(-10))
// .force("yAxis", d3.forceY(height * 4).strength(0.003))
// .force('charge', d3.forceManyBody().strength(10))
// simulation
// .force('center', d3.forceCenter()
// .x(height)
// .y(height))
// .velocityDecay(0.1)
// .alpha(10)
//     .force("forceY",
//         d3.forceY(height)
//             .strength(1)
//           )
//     .force("charge", null)
//     .force('collision', d3.forceCollide().r((d) => d.r).strength(1).iterations(0.001))
//     .on('tick', tickedY);

//
//
// d3.forceSimulation(nodes)
//     .velocityDecay(0.009)
//     .force("x", d3.forceX(width).strength(.000022))

// function force(alpha) {
//     for (var i = 0, n = nodes.length, node, k = alpha * 0.1; i < n; ++i) {
//         node = nodes[i];
//         node.vx -= node.x * k;
//         node.vy -= node.y * k;
//     }
// }
function restart() {
    simulation.alpha(1).restart();
}


function tickedY() {

    var u = d3.select('svg')
        .selectAll('circle')
        .data(nodes)

    u.enter()
        .append('circle')
        .merge(u)

    u.attr('cx', function (d) {

            // // d.vx = Math.random()
            // // d.vx = 10;
            if (d.vy == 0) {
                d.vx = 0;
            } else {
                if (!d.ticks) {
                    d.ticks = 100
                } else {
                    d.ticks--
                }
                if (d.ticks > 50) {
                    d.vx = 0.9
                } else {
                    d.vx = -0.9
                }
            }
            return Math.max(d.r, Math.min(width - d.r, d.x));
        }
    )
        .attr('cy', function (d) {
            d.vy = yVelocity

            if (d.y > height * .2) { //per evitare che collisioni iniziali fermino la caduta dei fiocchi
                if (
                    d.y >= height - (d.r)//*threshold)
                ) {

                    d.vy = 0
                    d.vx = 0

                }
                if (d.y - d.lastY < d.vy / 2) {
                    d.vy = d.vy / 1.15;

                }
                if (d.y - d.lastY <= 0.0005) {
                    d.fy = d.y
                    d.fx = d.x
                }
                d.lastY = d.y;
            }
            return d.y = Math.max(d.r, Math.min(height - d.r, d.y));
        });

    u.exit().remove()
}

function getRandomArbitrary(min, max) {
    return Math.random() * (max - min) + min;
}