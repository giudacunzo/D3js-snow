var width = 500, height = 500;

var yVelocity = 1.8;
var nodes = []

var interval =
    setInterval(function () {
        let x = getRandomArbitrary(10, width)
        nodes.push({
            r: getRandomArbitrary(10, 35),
            x: x,
            y: 0,
            opacity: getRandomArbitrary(0.65, 1)
        })
        update();

        if (nodes.length == 250)
            clearInterval(interval);

    }, 250)

var svg = d3.select("svg")
    .attr("width", width)
    .attr("height", height);

var snowflakes = svg.append('g')
    .raise()


function createSimulation() {

    return d3.forceSimulation(nodes)
        .alphaTarget(1)
        .force('collision',
            d3.forceCollide()
                .radius(d => d.r / 2.5)
                .strength(0.4)
                .iterations(5))
        .on('tick', tickedY);
}

function update() {
    let sf = snowflakes
        .selectAll("image")
        .data(nodes)

    sf.enter()
        .append("image").merge(sf)
        .attr("xlink:href", "snowflake.svg")
        .attr("color", "white")
        .attr("opacity", d => d.opacity)
        .attr("height", d => d.r)
        .attr("width", d => d.r)
        .attr("x", d => d.x)
        .attr("y", d => d.y)

    sf.exit().remove()

    simulation.stop();
    simulation = createSimulation();
}


simulation = createSimulation();
update();

function tickedY() {
    let sf = snowflakes
        .selectAll('image')
        .data(nodes)

    sf.enter()
        .append('image')
        .merge(sf)
        .attr('x', function (d) {
            if (d.vy == 0) {
                d.vx = 0;
            } else {
                if (d.ticks == null) {
                    /**
                     *  Faccio memorizzare un contatore dei ticks ad ogni nodo
                     *  così da cambiargli la velocità ad intervalli regolari
                     */
                    d.ticks = 200
                    d.xVelocity = getRandomArbitrary(-1, 1);
                } else {
                    if (d.ticks == 0) {
                        d.xVelocity = getRandomArbitrary(-1, 1);
                    }
                    d.ticks--
                }
                d.vx = d.xVelocity
            }
            return Math.max(d.r, Math.min(width - d.r, d.x)); // per impedire ai nodi di uscire dalla larghezza dell'svg
        })
        .attr('y', function (d) {
            d.vy = yVelocity

            if (d.y > height * .2) { // Per evitare che collisioni iniziali fermino la caduta dei fiocchi
                if (d.y >= height - (d.r)) { // se un fiocco tocca il suolo perde la sua velocità
                    d.vy = 0
                    d.vx = 0
                }

                // memorizzo in d.lastY la coordinata y del nodo all'ultimo tick eseguito
                if (d.y - d.lastY < d.vy / 2) {
                    // se un fiocco rallenta (a causa di collisioni) la sua velocità viene ridotta
                    d.vy = d.vy / 1.15;
                }

                if (d.y - d.lastY <= 0.0005) {
                    // se un fiocco ha avuto una piccola variazione di coordinate dall'ultimo tick, questo viene fissato
                    d.fy = d.y
                    d.fx = d.x
                }
                d.lastY = d.y;
            }
            return d.y = Math.max(d.r, Math.min(height - d.r, d.y)); // per impedire ai nodi di uscire dall'altezza dell'svg
        });

    sf.exit().remove()
}

function getRandomArbitrary(min, max) {
    return Math.random() * (max - min) + min;
}