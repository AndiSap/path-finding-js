let { colors, htmlElement, cellTypes, events } = require("./Models");

class HtmlActions {
  constructor(grid) {
    this.grid = grid;
  }

  /**
   * creates html representation of grid
   * @param {number} rows total number of grid rows
   * @param {number} cols total number of grid columns
   * @param {callback} callback which will be executed once a click event is recognized
   */
  static createGrid = (rows, cols, callback) => {
    var i = 0;
    let grid = document.createElement("table");
    grid.className = "grid";
    for (var r = 0; r < rows; ++r) {
      var tr = grid.appendChild(document.createElement("tr"));
      for (var c = 0; c < cols; ++c) {
        var cell = tr.appendChild(document.createElement("td"));
        cell.addEventListener(
          events.click,
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
  };

  /**
   * sets up grid html component
   */
  setGrid = () => {
    let htmlGridDiv = document.getElementsByClassName(htmlElement.grid);
    let putHere = htmlGridDiv.item(0);
    putHere.appendChild(this.grid);
  };

  /**
   * Sets color of element depending on type
   * @param {number} x column value
   * @param {number} y row value
   * @param {cellType} type the element type (plain, start, end, wall or obstacle)
   */
  setElement = (x, y, type) => {
    let element = this.grid.rows[x].cells[y];

    switch (type) {
      case cellTypes.plain:
        element.style.backgroundColor = colors.plain;
        break;
      case cellTypes.wall:
        element.style.backgroundColor = colors.wall;
        break;
      case cellTypes.start:
        element.style.backgroundColor = colors.start;
        break;
      case cellTypes.end:
        element.style.backgroundColor = colors.end;
        break;
      case cellTypes.obstacleLight:
        element.style.backgroundColor = colors.obstacleLight;
        break;
      case cellTypes.obstacleMedium:
        element.style.backgroundColor = colors.obstacleMedium;
        break;
      case cellTypes.obstacleHeavy:
        element.style.backgroundColor = colors.obstacleHeavy;
        break;
      case cellTypes.visitedCell:
        element.style.backgroundColor = colors.visited;
        break;
      case cellTypes.shortestPathCell:
        element.style.backgroundColor = colors.shortestPath;
        break;
    }
  };

  /**
   * Resets element selection on clearGrid to default to start point
   */
  resetElementsUi = () => {
    document.getElementById(htmlElement.startPointButton).click();
  };
}

module.exports = HtmlActions;
