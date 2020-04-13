let Grid = require("./Grid");
let Dijkstra = require("./Dijkstra");
let { colors, events, htmlElement } = require("./Models");

class Gui {
  visited = new Array();
  timeout = 1; // in ms
  timeWaited = 0;
  startPoint = {
    x: undefined,
    y: undefined,
  };
  endPoint = {
    x: undefined,
    y: undefined,
  };
  walls = [];
  alreadyExecuted = false;

  /**
   * sets up Gui component
   */
  constructor() {
    console.log("Gui component created");
    this.matrix = this.createMatrix(24);
  }

  /**
   * sets up grid html component
   */
  setGrid = (grid) => {
    this.grid = grid;

    window.addEventListener(events.load, () => {
      let test = document.getElementsByClassName(htmlElement.grid);
      let putHere = test.item(0);
      putHere.appendChild(this.grid);
      this.onClearButtonClicked();
      this.onStartAlgorithmButtonClicked();
    });
  };

  /**
   * Adds visited element to list
   * @param {number} row represents y coord
   * @param {number} column represents x coord
   */
  getVisitedElement = (row, column) => {
    this.visited.push({ x: row, y: column });
  };

  /**
   * Sets color of element depending on type
   * @param {number} x column value
   * @param {number} y row value
   * @param {boolean} isStart is element startpoint
   * @param {boolean} isWall is element wall
   */
  setElement = (x, y, isStart, isWall) => {
    let element = this.grid.rows[x].cells[y];
    if (isWall) element.style.backgroundColor = colors.wall;
    if (isStart) element.style.backgroundColor = colors.start;
    if (!isStart && !isWall) element.style.backgroundColor = colors.end;
  };

  /**
   * creates matrix representation of grid with row and columns
   * @param {number} rows
   */
  createMatrix = (rows) => {
    /**
     * If walls are added, change matrix cell to 1
     */
    let matrix = new Array(rows);
    for (let i = 0; i < rows; i++) {
      matrix[i] = new Array(rows);
      for (let j = 0; j < rows; j++) {
        matrix[i][j] = 0;
      }
    }
    return matrix;
  };

  /**
   * sets startpoint
   * @param {number} row represents y coord
   * @param {number} col represents x coord
   */
  setStartPoint = (row, col) => {
    this.startPoint = { x: col, y: row };
    this.setElement(this.startPoint.x, this.startPoint.y, true);
    console.log(`startpoint: (${this.startPoint.x}, ${this.startPoint.y})`);
  };

  /**
   * sets endpoint
   * @param {number} row represents y coord
   * @param {number} col represents x coord
   */
  setEndPoint = (row, col) => {
    this.endPoint = { x: col, y: row };
    this.setElement(this.endPoint.x, this.endPoint.y, false);
    console.log(`endpoint: (${this.endPoint.x}, ${this.endPoint.y})`);
  };

  /**
   * sets wall
   * @param {number} row represents y coord
   * @param {number} col represents x coord
   */
  setWall = (row, col) => {
    console.log(`Wall: (${col}, ${row})`);
    this.walls.push({ x: col, y: row });
    this.matrix[row][col] = 1;
    this.setElement(col, row, false, true);
  };

  /**
   * clears grid from all ui changes and resets saved start/endpoint and walls
   */
  clearGrid = () => {
    console.log("Clearing grid");
    this.startPoint = { x: undefined, y: undefined };
    this.endPoint = { x: undefined, y: undefined };
    this.walls = [];
    this.visited = [];

    for (let x = 0; x < this.matrix.length; x++) {
      for (let y = 0; y < this.matrix[0].length; y++) {
        this.grid.rows[x].cells[y].style.backgroundColor = colors.plain;
      }
    }
    this.alreadyExecuted = false;
    this.matrix = this.createMatrix(24);
    this.timeWaited = 0;
  };

  /**
   * starts algorithms and draws shotest path and visited cells
   * @todo: modify this to add algorithm as parameter
   */
  startAlgorithm = () => {
    console.log("Starting algorithm");

    if (this.startPoint.x == null) {
      alert("Cannot start algorithm, choose startpoint first");
      return;
    }
    if (this.endPoint.x == null) {
      alert("Cannot start algorithm, choose endpoint first");
      return;
    }

    let intputGrid = new Grid(this.matrix);

    let dijkstra = new Dijkstra();
    let shortestPath = dijkstra.findShortestPath(
      this.startPoint,
      this.endPoint,
      intputGrid,
      this.getVisitedElement
    );

    /**
     * Animation for visited cells
     */
    this.visited.forEach((node, index) => {
      if (node.x == this.endPoint.x && node.y == this.endPoint.y) return;
      if (node.x == this.startPoint.x && node.y == this.startPoint.y) return;
      setTimeout(() => {
        let element = this.grid.rows[node.x].cells[node.y];
        element.style.backgroundColor = colors.visited;
      }, index * this.timeout);
      this.timeWaited++;
    });

    /**
     * Draws shortest path
     */
    setTimeout(() => {
      shortestPath.forEach((node) => {
        if (node.x == this.startPoint.x && node.y == this.startPoint.y) return;
        if (node.x == this.endPoint.x && node.y == this.endPoint.y) return;
        let element = this.grid.rows[node.x].cells[node.y];
        element.style.backgroundColor = colors.shortestPath;
      });
    }, this.timeWaited * this.timeout);

    this.alreadyExecuted = true;
  };

  /**
   * Executed once clear button is clicked
   */
  onClearButtonClicked = () => {
    document
      .getElementById(htmlElement.clearButton)
      .addEventListener(events.click, () => {
        console.log("Clear button clicked");
        this.clearGrid();
      });
  };

  /**
   * Executed once start algorithm button is clicked
   */
  onStartAlgorithmButtonClicked = () => {
    document
      .getElementById(htmlElement.startAlgorithmButton)
      .addEventListener(events.click, () => {
        console.log("Start algorithm button clicked");
        if (!this.alreadyExecuted) this.startAlgorithm();
      });
  };
}

module.exports = Gui;