/**
 * executes all needed classes and functions for running the logic of path-finder
 */
let Gui = require("./Gui");

let gui = new Gui();

let grid = createGrid(24, 24, function (el, row, col, i) {
  el.className = "clicked";
  if (gui.startPoint.x == undefined) {
    gui.setStartPoint(col, row);
  } else if (gui.endPoint.x == undefined) {
    gui.setEndPoint(col, row);
  } else {
    gui.setWall(col, row);
  }
});

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
        (function (el, r, c, i) {
          return function () {
            callback(el, r, c, i);
          };
        })(cell, r, c, i),
        false
      );
    }
  }
  return grid;
}

document.body.appendChild(grid);
gui.setGrid(grid);
