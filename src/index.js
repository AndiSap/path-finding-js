let Grid = require("./grid");
let Dijkstra = require("./dijkstra");

console.log("Starting algorithm...\n");
// 0 = walkable
// 1 = blocked
let matrix = [
  [0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0]
];

let intputGrid = new Grid(matrix);
let start = { x: 0, y: 0 },
  end = { x: 6, y: 3 };

let dijkstra = new Dijkstra();
let shortestPath = dijkstra.findShortestPath(start, end, intputGrid);

console.log(shortestPath);
