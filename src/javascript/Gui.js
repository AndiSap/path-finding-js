let Grid = require("./Grid");
let Dijkstra = require("./Dijkstra");
let AStar = require("./AStar");
let {
  colors,
  events,
  htmlElement,
  timeouts,
  obstacleWeights,
  cellTypes,
} = require("./Models");

class Gui {
  visited = new Array();
  weights = new Array();
  timeout = timeouts.default;
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
  choosingStartPoint = true;
  choosingEndPoint = false;
  choosingObstacle = false;
  dijkstra = new Dijkstra();
  astar = new AStar();
  weightsActive = false;
  currentWeight = "";

  /**
   * sets up Gui component
   */
  constructor() {
    console.log("Gui component created");
    this.matrix = this.createMatrix(24);
    this.algorithm = this.dijkstra;
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
      this.onChooseStartPointButtonClicked();
      this.onChooseEndPointButtonClicked();
      this.onSetWeights();
      this.onAstartClicked();
      this.onDijkstraClicked();
      this.onOtherClicked();
      this.onSlowMotion();
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
    }
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
    if (this.startPoint.x !== undefined)
      this.setElement(this.startPoint.x, this.startPoint.y, cellTypes.plain);
    this.startPoint = { x: col, y: row };
    this.setElement(this.startPoint.x, this.startPoint.y, cellTypes.start);
    console.log(`startpoint: (${this.startPoint.x}, ${this.startPoint.y})`);
  };

  /**
   * sets endpoint
   * @param {number} row represents y coord
   * @param {number} col represents x coord
   */
  setEndPoint = (row, col) => {
    if (this.endPoint.x !== undefined)
      this.setElement(this.endPoint.x, this.endPoint.y, cellTypes.plain);
    this.endPoint = { x: col, y: row };
    this.setElement(this.endPoint.x, this.endPoint.y, cellTypes.end);
    console.log(`endpoint: (${this.endPoint.x}, ${this.endPoint.y})`);
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
    this.walls.push({ x: col, y: row });
    this.matrix[row][col] = 1;
    this.setElement(col, row, cellTypes.wall);
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
    this.setElement(col, row, this.currentWeight);
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
    this.currentWeight = "";
    this.weights = [];
    this.weightsActive = false;
    this.resetElementsUi();
  };

  /**
   * Resets element selection on clearGrid to default to start point
   */
  resetElementsUi = () => {
    document.getElementById(htmlElement.startPointButton).checked = true;
    document.getElementById(htmlElement.endPointButton).checked = false;
    document.getElementById(htmlElement.obstacleWall).checked = false;
    document.getElementById(htmlElement.obstacleLight).checked = false;
    document.getElementById(htmlElement.obstacleMedium).checked = false;
    document.getElementById(htmlElement.obstacleHeavy).checked = false;
  };

  /**
   * starts algorithms and draws shotest path and visited cells
   * @param {algorithm} algorithm which should be used for finding the shortest path
   */
  startAlgorithm = (algorithm) => {
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

    this.weights.forEach((data) => {
      intputGrid.setWeight(data.x, data.y, data.weight);
    });

    let shortestPath = algorithm.findShortestPath(
      this.startPoint,
      this.endPoint,
      intputGrid,
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
        if (!this.alreadyExecuted) this.startAlgorithm(this.algorithm);
      });
  };

  /**
   * Executed once choose start point button is clicked
   */
  onChooseStartPointButtonClicked = () => {
    document
      .getElementById(htmlElement.startPointButton)
      .addEventListener(events.click, () => {
        console.log("Choose start point button clicked");
        this.choosingStartPoint = true;
        this.choosingEndPoint = false;
        this.choosingObstacle = false;
        console.log("choosingStart: " + this.choosingStartPoint);
      });
  };

  /**
   * Executed once choose end point button is clicked
   */
  onChooseEndPointButtonClicked = () => {
    document
      .getElementById(htmlElement.endPointButton)
      .addEventListener(events.click, () => {
        console.log("Choose end point button clicked");
        this.choosingStartPoint = false;
        this.choosingEndPoint = true;
        this.choosingObstacle = false;
        console.log("choosingEnd: " + this.choosingEndPoint);
      });
  };

  /**
   * Executed once A* Algorithm button is clicked
   */
  onAstartClicked = () => {
    document
      .getElementById(htmlElement.astar)
      .addEventListener(events.click, () => {
        console.log("Setting algorithm to AStart");
        this.algorithm = this.astar;
      });
  };

  /**
   * Executed once Dijkstra Algorithm button is clicked
   */
  onDijkstraClicked = () => {
    document
      .getElementById(htmlElement.dijkstra)
      .addEventListener(events.click, () => {
        console.log("Setting algorithm to Dijkstra");
        this.algorithm = this.dijkstra;
      });
  };

  /**
   * Executed once "other" button is clicked
   */
  onOtherClicked = () => {
    document
      .getElementById(htmlElement.other)
      .addEventListener(events.click, () => {
        alert("More algorithms comming soon!");
        if (this.algorithm == this.dijkstra)
          document.getElementById(htmlElement.dijkstra).checked = true;
        else document.getElementById(htmlElement.astar).checked = true;
      });
  };

  /**
   * Executed once one of the slow motion selection is clicked
   */
  onSlowMotion = () => {
    document
      .getElementById(htmlElement.slowMotionNormal)
      .addEventListener(events.click, () => (this.timeout = timeouts.default));
    document
      .getElementById(htmlElement.slowMotionSlow)
      .addEventListener(events.click, () => (this.timeout = timeouts.slow));
    document
      .getElementById(htmlElement.slowMotionVerySlow)
      .addEventListener(events.click, () => (this.timeout = timeouts.verySlow));
  };

  /**
   * Executed once one of the elements selection is clicked
   */
  onSetWeights = () => {
    document
      .getElementById(htmlElement.obstacleWall)
      .addEventListener(events.click, () => {
        this.choosingStartPoint = false;
        this.choosingEndPoint = false;
        this.choosingObstacle = true;
        this.weightsActive = false;
        console.log(`Setting obstacle to: ${cellTypes.wall}`);
        this.currentWeight = cellTypes.wall;
      });
    document
      .getElementById(htmlElement.obstacleLight)
      .addEventListener(events.click, () => {
        this.choosingStartPoint = false;
        this.choosingEndPoint = false;
        this.choosingObstacle = true;
        this.weightsActive = true;
        console.log(`Setting obstacle to: ${cellTypes.obstacleLight}`);
        this.currentWeight = cellTypes.obstacleLight;
      });
    document
      .getElementById(htmlElement.obstacleMedium)
      .addEventListener(events.click, () => {
        this.choosingStartPoint = false;
        this.choosingEndPoint = false;
        this.choosingObstacle = true;
        this.weightsActive = true;
        console.log(`Setting obstacle to: ${cellTypes.obstacleMedium}`);
        this.currentWeight = cellTypes.obstacleMedium;
      });
    document
      .getElementById(htmlElement.obstacleHeavy)
      .addEventListener(events.click, () => {
        this.choosingStartPoint = false;
        this.choosingEndPoint = false;
        this.choosingObstacle = true;
        this.weightsActive = true;
        console.log(`Setting obstacle to: ${cellTypes.obstacleHeavy}`);
        this.currentWeight = cellTypes.obstacleHeavy;
      });
  };
}

module.exports = Gui;
