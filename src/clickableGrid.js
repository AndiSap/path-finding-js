let alreadyExecuted = false;

let lastClicked;
let grid = createGrid(24, 24, function(el, row, col, i) {
  el.className = "clicked";
  // if (lastClicked) {
  // lastClicked.className = "";
  if (startPoint.x == undefined) {
    setStartPoint(col, row);
  } else if (endPoint.x == undefined) {
    setEndPoint(col, row);
  } else {
    // just temporary for starting algorithm
    if (col == 23 && row == 23 && !alreadyExecuted) {
      console.log("Starting algorithm");
      startAlgorithm();
      alreadyExecuted = true;
    } else if (col == 0 && row == 23 && alreadyExecuted) {
      clearGrid();
    } else {
      setWall(col, row);
    }
  }
  // }
  // lastClicked = el;
});

document.body.appendChild(grid);

let Grid = require("./grid");
let Dijkstra = require("./dijkstra");
let visited = [];
let timeout = 1; // in ms
let timeWaited = 0;
let startPoint = {
  x: undefined,
  y: undefined
};
let endPoint = {
  x: undefined,
  y: undefined
};
let walls = [];

/**
 * If walls are added, change matrix cell to 1
 */
let matrix = new Array(24);
for (i = 0; i < 24; i++) {
  matrix[i] = new Array(24);
  for (j = 0; j < 24; j++) {
    matrix[i][j] = 0;
  }
}

function createGrid(rows, cols, callback) {
  var i = 0;
  var grid = document.createElement("table");
  grid.className = "grid";
  for (var r = 0; r < rows; ++r) {
    var tr = grid.appendChild(document.createElement("tr"));
    for (var c = 0; c < cols; ++c) {
      var cell = tr.appendChild(document.createElement("td"));
      cell.addEventListener(
        "click",
        (function(el, r, c, i) {
          return function() {
            callback(el, r, c, i);
          };
        })(cell, r, c, i),
        false
      );
    }
  }
  return grid;
}

/**
 * Adds visited element to list
 */
function getVisitedElement(row, column) {
  visited.push({ x: row, y: column });
}

/**
 * Sets color of start and endpoint
 */
function setElement(x, y, isStart, isWall) {
  let element = grid.rows[x].cells[y];
  if (isWall) element.style.backgroundColor = "black";
  if (isStart) element.style.backgroundColor = "lightgreen";
  if (!isStart && !isWall) element.style.backgroundColor = "indianred";
}

let createMatrix = rows => {
  /**
   * If walls are added, change matrix cell to 1
   */
  let matrix = new Array(rows);
  for (i = 0; i < rows; i++) {
    matrix[i] = new Array(rows);
    for (j = 0; j < rows; j++) {
      matrix[i][j] = 0;
    }
  }
  return matrix;
};

let setStartPoint = (row, col) => {
  startPoint = { x: col, y: row };
  setElement(startPoint.x, startPoint.y, true);
  console.log(`startpoint: (${startPoint.x}, ${startPoint.y})`);
};

let setEndPoint = (row, col) => {
  endPoint = { x: col, y: row };
  setElement(endPoint.x, endPoint.y, false);
  console.log(`endpoint: (${endPoint.x}, ${endPoint.y})`);
};

let setWall = (row, col) => {
  console.log(`Wall: (${col}, ${row})`);
  walls.push({ x: col, y: row });
  matrix[row][col] = 1;
  setElement(col, row, false, true);
};

let clearGrid = () => {
  console.log("Clearing grid");
  startPoint = { x: undefined, y: undefined };
  endPoint = { x: undefined, y: undefined };
  walls = [];
  visited = [];

  for (let x = 0; x < matrix.length; x++) {
    for (let y = 0; y < matrix[0].length; y++) {
      grid.rows[x].cells[y].style.backgroundColor = "white";
    }
  }
  alreadyExecuted = false;
  matrix = createMatrix(24);
  timeWaited = 0;
};

let startAlgorithm = () => {
  let intputGrid = new Grid(matrix);

  let dijkstra = new Dijkstra();
  let shortestPath = dijkstra.findShortestPath(
    startPoint,
    endPoint,
    intputGrid,
    getVisitedElement
  );

  /**
   * Animation for visited cells
   */
  visited.forEach((node, index) => {
    if (node.x == endPoint.x && node.y == endPoint.y) return;
    if (node.x == startPoint.x && node.y == startPoint.y) return;
    setTimeout(() => {
      let element = grid.rows[node.x].cells[node.y];
      element.style.backgroundColor = "lightblue";
    }, index * timeout);
    timeWaited++;
  });

  /**
   * Draws shortest path
   */
  setTimeout(() => {
    shortestPath.forEach(node => {
      if (node.x == startPoint.x && node.y == startPoint.y) return;
      if (node.x == endPoint.x && node.y == endPoint.y) return;
      let element = grid.rows[node.x].cells[node.y];
      element.style.backgroundColor = "sandybrown";
    });
  }, timeWaited * timeout);
};
