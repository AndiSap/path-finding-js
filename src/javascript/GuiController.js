let Grid = require("./Grid");
let Dijkstra = require("./Dijkstra");
let AStar = require("./AStar");
let HTMLActions = require("./HTMLActions");
let EventListener = require("./EventListener");
let {
  colors,
  timeouts,
  obstacleWeights,
  cellTypes,
  gridSize,
} = require("./Models");

class GuiController {
  visited = new Array();
  weights = new Array();
  timeout = timeouts.default;
  timeWaited = 0;

  alreadyExecuted = false;
  choosingStartPoint = true;
  choosingEndPoint = false;
  choosingObstacle = false;
  weightsActive = false;
  currentWeight = "";

  /**
   * sets up Gui controller
   */
  constructor() {
    console.log("Gui controller created");
    this.matrix = this.createMatrix(24);
    this.dijkstra = new Dijkstra();
    this.astar = new AStar();
    this.algorithm = this.dijkstra;
    this.inputGrid = new Grid();
  }

  /**
   * sets up grid html component
   */
  setup = () => {
    this.grid = HTMLActions.createGrid(
      gridSize.row,
      gridSize.column,
      this.onGridClicked
    );

    this.htmlActions = new HTMLActions(this.grid);
    let eventListener = new EventListener(this);
  };

  onGridClicked = (element, selectedRow, selectedColumn) => {
    element.className = "clicked";
    if (this.choosingObstacle) {
      this.setObstacle(selectedColumn, selectedRow);
    } else if (this.choosingEndPoint) {
      this.setEndPoint(selectedColumn, selectedRow);
    } else {
      this.setStartPoint(selectedColumn, selectedRow);
    }
  };

  /**
   * Adds visited element to list
   * @param {number} row represents y coord
   * @param {number} column represents x coord
   */
  getVisitedElement = (node) => {
    this.visited.push({ x: node.x, y: node.y });
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
    if (this.inputGrid.startPoint.x !== undefined)
      this.htmlActions.setElement(
        this.inputGrid.startPoint.x,
        this.inputGrid.startPoint.y,
        cellTypes.plain
      );
    this.inputGrid.startPoint = { x: col, y: row };
    this.htmlActions.setElement(
      this.inputGrid.startPoint.x,
      this.inputGrid.startPoint.y,
      cellTypes.start
    );
    console.log(
      `startpoint: (${this.inputGrid.startPoint.x}, ${this.inputGrid.startPoint.y})`
    );
  };

  /**
   * sets endpoint
   * @param {number} row represents y coord
   * @param {number} col represents x coord
   */
  setEndPoint = (row, col) => {
    if (this.inputGrid.endPoint.x !== undefined)
      this.htmlActions.setElement(
        this.inputGrid.endPoint.x,
        this.inputGrid.endPoint.y,
        cellTypes.plain
      );
    this.inputGrid.endPoint = { x: col, y: row };
    this.htmlActions.setElement(
      this.inputGrid.endPoint.x,
      this.inputGrid.endPoint.y,
      cellTypes.end
    );
    console.log(
      `endpoint: (${this.inputGrid.endPoint.x}, ${this.inputGrid.endPoint.y})`
    );
  };

  /**
   * sets obstacle (either wall or weights depending on user input)
   * @param {number} row represents y coord
   * @param {number} col represents x coord
   */
  setObstacle = (row, col) => {
    if (this.weightsActive == false) this.setWall(row, col);
    else this.setWeight(row, col);
  };

  /**
   * sets wall
   * @param {number} row represents y coord
   * @param {number} col represents x coord
   */
  setWall = (row, col) => {
    console.log(`Wall: (${col}, ${row})`);
    this.matrix[row][col] = 1;
    this.htmlActions.setElement(col, row, cellTypes.wall);
  };

  /**
   * Sets weight
   * @param {number} row represents y coord
   * @param {number} col represents x coord
   */
  setWeight = (row, col) => {
    console.log(`Weight: (${col}, ${row}): ${this.currentWeight}`);
    this.weights.push({
      x: col,
      y: row,
      weight: obstacleWeights[this.currentWeight],
    });
    this.htmlActions.setElement(col, row, this.currentWeight);
  };

  /**
   * clears grid from all ui changes and resets saved start/endpoint and walls
   */
  clearGrid = () => {
    console.log("Clearing grid");
    this.inputGrid.startPoint = { x: undefined, y: undefined };
    this.inputGrid.endPoint = { x: undefined, y: undefined };
    this.visited = [];

    for (let x = 0; x < this.matrix.length; x++) {
      for (let y = 0; y < this.matrix[0].length; y++) {
        this.grid.rows[x].cells[y].style.backgroundColor = colors.plain;
      }
    }
    this.alreadyExecuted = false;
    this.matrix = this.createMatrix(24);
    this.timeWaited = 0;
    this.currentWeight = "";
    this.weights = [];
    this.weightsActive = false;
    this.htmlActions.resetElementsUi();
  };

  /**
   * starts algorithms and draws shotest path and visited cells
   * @param {algorithm} algorithm which should be used for finding the shortest path
   */
  startAlgorithm = (algorithm) => {
    console.log("Starting algorithm");

    if (this.inputGrid.startPoint.x == null) {
      alert("Cannot start algorithm, choose startpoint first");
      return;
    }
    if (this.inputGrid.endPoint.x == null) {
      alert("Cannot start algorithm, choose endpoint first");
      return;
    }

    this.inputGrid.buildNodesFromMatrix(this.matrix);

    this.weights.forEach((data) => {
      this.inputGrid.setWeight(data.x, data.y, data.weight);
    });

    let shortestPath = algorithm.findShortestPath(
      this.inputGrid,
      this.getVisitedElement
    );

    /**
     * Animation for visited cells
     */
    this.visited.forEach((node, index) => {
      let weight = false;
      this.weights.forEach((data) => {
        if (node.x == data.x && node.y == data.y) weight = true;
      });
      if (weight) return;

      if (
        node.x == this.inputGrid.endPoint.x &&
        node.y == this.inputGrid.endPoint.y
      )
        return;
      if (
        node.x == this.inputGrid.startPoint.x &&
        node.y == this.inputGrid.startPoint.y
      )
        return;
      setTimeout(() => {
        this.htmlActions.setElement(node.x, node.y, cellTypes.visitedCell);
      }, index * this.timeout);
      this.timeWaited++;
    });

    /**
     * Draws shortest path
     */
    setTimeout(() => {
      shortestPath.forEach((node) => {
        if (
          node.x == this.inputGrid.startPoint.x &&
          node.y == this.inputGrid.startPoint.y
        )
          return;
        if (
          node.x == this.inputGrid.endPoint.x &&
          node.y == this.inputGrid.endPoint.y
        )
          return;

        this.htmlActions.setElement(node.x, node.y, cellTypes.shortestPathCell);
      });
    }, this.timeWaited * this.timeout);

    this.alreadyExecuted = true;
  };
}

module.exports = GuiController;
