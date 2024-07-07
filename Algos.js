const directions = {
    N: { dx: 0, dy: -1 },
    NE: { dx: 1, dy: -1 },
    E: { dx: 1, dy: 0 },
    SE: { dx: 1, dy: 1 },
    S: { dx: 0, dy: 1 },
    SW: { dx: -1, dy: 1 },
    W: { dx: -1, dy: 0 },
    NW: { dx: -1, dy: -1 },

};





function createGrid(latMin, latMax, lonMin, lonMax, step = 0.05) {
    const grid = [];
    for (let lat = latMin; lat <= latMax; lat += step) {
        const row = [];
        for (let lon = lonMin; lon <= lonMax; lon += step) {
            row.push({
                lat,
                lon,
                currentDirection: null,
                currentSpeed: null,
                weight: Infinity,
                prev: null,
                center: { lat: lat + step / 2, lon: lon + step / 2 }, // Center position
            });
        }
        grid.push(row);
    }
    return grid;
}

async function fetchCurrentData(lat, lon) {
    const url = `https://marine-api.open-meteo.com/v1/marine?latitude=${lat}&longitude=${lon}&current=ocean_current_velocity,ocean_current_direction`;
    const response = await fetch(url);
    const data = await response.json();

    if (data && data.current) {
        const { ocean_current_velocity, ocean_current_direction } =
            data.current;
        return {
            speed: ocean_current_velocity, // Assuming the API returns speed in knots
            direction: ocean_current_direction, // Assuming the API returns direction in degrees
        };
    } else {
        return {
            speed: 0,
            direction: null,
        };
    }
}

async function getCurrentData(lat, lon) {
    const currentData = await fetchCurrentData(lat, lon);
    return currentData;
}

async function assignWeights(grid) {
    for (let row of grid) {
        for (let cell of row) {
            const { speed, direction } = await getCurrentData(
                cell.lat,
                cell.lon
            );
            cell.currentSpeed = speed;
            cell.currentDirection = direction;
            cell.weight = calculateWeight(direction, speed);
        }
    }
}

function calculateWeight(direction, speed) {
    const baseWeight = 1;
    return baseWeight / (speed || 1); // Example: inverse of speed
}

class PriorityQueue {
    constructor() {
        this.nodes = [];
    }

    enqueue(priority, key) {
        this.nodes.push({ key, priority });
        this.sort();
    }

    dequeue() {
        return this.nodes.shift().key;
    }

    sort() {
        this.nodes.sort((a, b) => a.priority - b.priority);
    }

    isEmpty() {
        return !this.nodes.length;
    }
}

function dijkstra(grid, start, goal) {
    const pq = new PriorityQueue();
    const startNode = grid[start.y][start.x];
    startNode.weight = 0;
    pq.enqueue(0, start);

    while (!pq.isEmpty()) {
        const { x, y } = pq.dequeue();
        const currentNode = grid[y][x];

        if (x === goal.x && y === goal.y) break;

        for (let dir in directions) {
            const newX = x + directions[dir].dx;
            const newY = y + directions[dir].dy;
            if (
                newX >= 0 &&
                newX < grid[0].length &&
                newY >= 0 &&
                newY < grid.length
            ) {
                const neighborNode = grid[newY][newX];
                const newWeight = currentNode.weight + neighborNode.weight;
                if (newWeight < neighborNode.weight) {
                    neighborNode.weight = newWeight;
                    neighborNode.prev = { x, y }; // Track the previous node
                    pq.enqueue(newWeight, { x: newX, y: newY });
                }
            }
        }
    }

    const path = [];
    let currentNode = goal;
    while (currentNode) {
        const { x, y } = currentNode;
        const cell = grid[y][x];
        path.push(cell.center); // Add the center position to the path
        currentNode = cell.prev;
    }

    return path.reverse();
}

const latMin = -30.25;
const latMax = -32.0;
const lonMin = -10.0;
const lonMax = 10;
const grid = await createGrid(latMin, latMax, lonMin, lonMax);

await assignWeights(grid);

const start = { x: 0, y: 0 }; // Starting point (index in grid)
const goal = { x: grid[0].length - 1, y: grid.length - 1 }; // Goal point (index in grid)

const path = await dijkstra(grid, start, goal);
console.log('Path:', path);

function generateCurvedLinePoints(lat1, lon1, lat2, lon2, curvature) {
    // Convert latitude and longitude from degrees to radians
    lat1 = lat1 * Math.PI / 180;
    lon1 = lon1 * Math.PI / 180;
    lat2 = lat2 * Math.PI / 180;
    lon2 = lon2 * Math.PI / 180;

    // Calculate the mid-point coordinates
    var midPointLat = (lat1 + lat2) / 2;
    var midPointLon = (lon1 + lon2) / 2;

    // Calculate the control point, which is influenced by the curvature
    var controlLat = midPointLat + curvature * (lon1 - lon2);
    var controlLon = midPointLon - curvature * (lat1 - lat2);

    // Convert back from radians to degrees
    controlLat = controlLat * 180 / Math.PI;
    controlLon = controlLon * 180 / Math.PI;

    // Generate points along the Bezier curve
    var points = [];
    for (var t = 0; t <= 1; t += 0.1) {
        var lat = (1 - t) * (1 - t) * lat1 + 2 * (1 - t) * t * controlLat + t * t * lat2;
        var lon = (1 - t) * (1 - t) * lon1 + 2 * (1 - t) * t * controlLon + t * t * lon2;
        points.push({ latitude: lat, longitude: lon });
    }

    // Add the final point (lat2, lon2) to ensure the line ends at the destination
    points.push({ latitude: lat2, longitude: lon2 });

    return points;
}


function traverseGridInZigzag(rows, cols,latMin,lonMin,latMax,lonMax) {
    var result = [];

    result.push([latMin,lonMin])
    for (var r = 0; r < rows; r++) {
        // Determine whether to move left to right or right to left
        if (r % 2 === 0) {
            // Move left to right
            for (var c = 0; c < cols; c++) {
                result.push([latMin+r,lonMin+c]);
            }
        } else {
            // Move right to left
            for (var c = cols - 1; c >= 0; c--) {
                result.push([latMin+r,lonMin+c]);
            }
        }
    }
    result.push(latMax,lonMax)
    return result;
}

function getGrid(latMin,latMax,lonMin,lonMax) {
    rows = (latMax-latMin) / 0.05;
    cols = (lonMax-lonMin) / 0.05;

    return rows,cols;}