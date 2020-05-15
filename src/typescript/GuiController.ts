import { Grid } from './Grid';
import { Dijkstra } from './Dijkstra';
import { AStar } from './AStar';
import { HtmlActions } from './HTMLActions';
import { EventListener } from './EventListener';
import {
  timeouts, obstacleWeights, cellTypes, gridSize,
} from './Models.d';
import { GridNode } from './Types.d';

export class GuiController {
  private visited: GridNode[] = [];
  private weights: GridNode[] = [];
  private typeOfCell: string[][] = undefined!;
  public timeout = timeouts.default;
  private timeWaited: number = 0;
  public alreadyExecuted: boolean = false;
  public choosingStartPoint: boolean = true;
  public choosingEndPoint: boolean = false;
  public choosingObstacle: boolean = false;
  public erasing: boolean = false;
  public weightsActive: boolean = false;
  public currentWeight: number = 0;

  private matrix: number[][] = [];
  private dijkstra: Dijkstra;
  private astar: AStar;
  private algorithm: Dijkstra | AStar;
  private inputGrid: Grid;
  private grid: HTMLTableElement = undefined!;
  private htmlActions: HtmlActions = undefined!;
  private eventListener: EventListener = undefined!;


  /**
   * sets up Gui controller
   */
  constructor() {
    console.log('Gui controller created');
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
    this.grid = HtmlActions.createGrid(
      gridSize.row,
      gridSize.column,
      this.onGridClicked,
    );

    this.htmlActions = new HtmlActions(this.grid);
    this.eventListener = new EventListener(this);
  };

  onGridClicked = (element: HTMLElement, selectedRow: number, selectedColumn: number) => {
    element.className = 'clicked';
    if (this.choosingObstacle) {
      this.eraseElement(selectedColumn, selectedRow); // Erase element called to avoid duplicate weights and invisible walls
      this.setObstacle(selectedColumn, selectedRow);
    } else if (this.choosingEndPoint) {
      this.setEndPoint(selectedColumn, selectedRow);
    } else if (this.choosingStartPoint) {
      this.setStartPoint(selectedColumn, selectedRow);
    } else {
      this.eraseElement(selectedColumn, selectedRow);
    }
  };

  /**
   * Adds visited element to list
   * @param {number} row represents y coord
   * @param {number} column represents x coord
   */
  private getVisitedElement(node: GridNode): void {
    this.visited.push({ x: node.x, y: node.y });
  }

  /**
   * creates matrix representation of grid with row and columns
   * @param {number} rows
   */
  private createMatrix(rows: number): number[][] {
    /**
     * If walls are added, change matrix cell to 1
     */
    const matrix = new Array(rows);
    this.typeOfCell = new Array(rows) as string[][];
    for (let i = 0; i < rows; i++) {
      matrix[i] = new Array(rows);
      this.typeOfCell[i] = new Array(rows) as string[];
      for (let j = 0; j < rows; j++) {
        matrix[i][j] = 0;
        this.typeOfCell[i][j] = cellTypes.plain;
      }
    }
    return matrix;
  }

  /**
   * sets startpoint
   * @param {number} row represents y coord
   * @param {number} col represents x coord
   */
  public setStartPoint(row: number, col: number): void {
    if (this.inputGrid.startPoint.x !== undefined) {
      this.htmlActions.setElement(
        this.inputGrid.startPoint.x,
        this.inputGrid.startPoint.y,
        cellTypes.plain,
      );
      this.typeOfCell[this.inputGrid.startPoint.y][
        this.inputGrid.startPoint.x
      ] = cellTypes.plain;
    }
    this.inputGrid.startPoint = { x: col, y: row };
    this.htmlActions.setElement(
      this.inputGrid.startPoint.x,
      this.inputGrid.startPoint.y,
      cellTypes.start,
    );
    this.typeOfCell[row][col] = cellTypes.start;
    console.log(`startpoint: (${this.inputGrid.startPoint.x}, ${this.inputGrid.startPoint.y})`);
  }

  /**
   * sets endpoint
   * @param {number} row represents y coord
   * @param {number} col represents x coord
   */
  public setEndPoint(row: number, col: number): void {
    if (this.inputGrid.endPoint.x !== undefined) {
      this.htmlActions.setElement(
        this.inputGrid.endPoint.x,
        this.inputGrid.endPoint.y,
        cellTypes.plain,
      );
      this.typeOfCell[this.inputGrid.endPoint.y][this.inputGrid.endPoint.x] = cellTypes.plain;
    }
    this.inputGrid.endPoint = { x: col, y: row };
    this.htmlActions.setElement(
      this.inputGrid.endPoint.x,
      this.inputGrid.endPoint.y,
      cellTypes.end,
    );
    this.typeOfCell[row][col] = cellTypes.end;
    console.log(`endpoint: (${this.inputGrid.endPoint.x}, ${this.inputGrid.endPoint.y})`);
  }

  /**
   * sets obstacle (either wall or weights depending on user input)
   * @param {number} row represents y coord
   * @param {number} col represents x coord
   */
  public setObstacle(row: number, col: number): void {
    if (this.weightsActive === false) this.setWall(row, col);
    else this.setWeight(row, col);
  }

  /**
   * sets wall
   * @param {number} row represents y coord
   * @param {number} col represents x coord
   */
  public setWall(row: number, col: number): void {
    console.log(`Wall: (${col}, ${row})`);
    this.matrix[row][col] = 1;
    this.htmlActions.setElement(col, row, cellTypes.wall);
    this.typeOfCell[row][col] = cellTypes.wall;
  }

  /**
   * Sets weight
   * @param {number} row represents y coord
   * @param {number} col represents x coord
   */
  public setWeight(row: number, col: number): void {
    console.log(`Weight: (${col}, ${row}): ${this.currentWeight}`);
    this.weights.push({ x: col, y: row, weight: obstacleWeights[this.currentWeight] });
    this.htmlActions.setElement(col, row, this.currentWeight);
    this.typeOfCell[row][col] = `${this.currentWeight}`;
  }

  /**
   * Removes a weight
   * @param {number} row represents y coord
   * @param {number} col represents x coord
   */
  public removeWeight(row: number, col: number): void {
    for (let i = 0; i < this.weights.length; i++) {
      const point = this.weights[i];
      if (point.x === col && point.y === row) {
        this.weights.splice(i, 1);
        break;
      }
    }
  }

  /**
   * Erases an element
   * @param {number} row represents y coord
   * @param {number} col represents x coord
   */
  public eraseElement(row: number, col: number): void {
    const cellType = this.typeOfCell[row][col];
    switch (cellType) {
      case cellTypes.start:
        this.inputGrid.startPoint = { x: undefined!, y: undefined! };
        break;
      case cellTypes.end:
        this.inputGrid.endPoint = { x: undefined!, y: undefined! };
        break;
      case cellTypes.wall:
        this.matrix[row][col] = 0;
        break;
      default:
        if (
          cellType === cellTypes.obstacleLight
          || cellType === cellTypes.obstacleHeavy
          || cellType === cellTypes.obstacleMedium
        ) {
          this.removeWeight(row, col);
        }
    }
    this.htmlActions.setElement(col, row, cellTypes.plain);
    this.typeOfCell[row][col] = cellTypes.plain;
    console.log(`Erased: (${col}, ${row})`);
  }

  /**
   * resets the algorithm (erases visited cells and shortest path cells)
   */
  public resetAlgorithm(): void {
    console.log('Reseting algorithm');
    this.visited.forEach((data) => {
      this.htmlActions.setElement(data.x, data.y, this.typeOfCell[data.y][data.x]);
    });

    this.timeWaited = 0;
    this.visited = [];
    this.alreadyExecuted = false;
  }

  /**
   * clears grid from all ui changes and resets saved start/endpoint and walls
   */
  public clearGrid(): void {
    console.log('Clearing grid');
    this.inputGrid.startPoint = { x: undefined!, y: undefined! };
    this.inputGrid.endPoint = { x: undefined!, y: undefined! };
    this.visited = [];

    for (let x = 0; x < this.matrix.length; x++) {
      for (let y = 0; y < this.matrix[0].length; y++) {
        this.typeOfCell[x][y] = cellTypes.plain;
        this.htmlActions.setElement(x, y, cellTypes.plain);
      }
    }
    this.alreadyExecuted = false;
    this.matrix = this.createMatrix(24);
    this.timeWaited = 0;
    this.currentWeight = 0;
    this.weights = [];
    this.weightsActive = false;
    this.htmlActions.resetElementsUi();
  }

  /**
   * starts algorithms and draws shotest path and visited cells
   * @param {algorithm} algorithm which should be used for finding the shortest path
   */
  public startAlgorithm(algorithm: Dijkstra | AStar): void {
    console.log('Starting algorithm');

    if (this.inputGrid.startPoint.x == null) {
      alert('Cannot start algorithm, choose startpoint first');
      return;
    }
    if (this.inputGrid.endPoint.x == null) {
      alert('Cannot start algorithm, choose endpoint first');
      return;
    }

    this.inputGrid.buildNodesFromMatrix(this.matrix);

    this.weights.forEach((data: GridNode) => {
      this.inputGrid.setWeight(data.x, data.y, data.weight as number);
    });

    const shortestPath = algorithm.findShortestPath(
      this.inputGrid,
      this.getVisitedElement,
    );

    /**
     * Animation for visited cells
     */
    this.visited.forEach((node, index) => {
      if (
        node.x === this.inputGrid.endPoint.x
        && node.y === this.inputGrid.endPoint.y
      ) { return; }
      if (
        node.x === this.inputGrid.startPoint.x
        && node.y === this.inputGrid.startPoint.y
      ) { return; }
      setTimeout(() => {
        if (this.typeOfCell[node.y][node.x] === cellTypes.obstacleLight) {
          this.htmlActions.setElement(node.x, node.y, cellTypes.visitedLight);
        } else if (this.typeOfCell[node.y][node.x] === cellTypes.obstacleMedium) {
          this.htmlActions.setElement(node.x, node.y, cellTypes.visitedMedium);
        } else if (this.typeOfCell[node.y][node.x] === cellTypes.obstacleHeavy) {
          this.htmlActions.setElement(node.x, node.y, cellTypes.visitedHeavy);
        } else {
          this.htmlActions.setElement(node.x, node.y, cellTypes.visitedCell);
        }
      }, index * this.timeout);
      this.timeWaited++;
    });

    /**
     * Draws shortest path
     */
    setTimeout(() => {
      shortestPath!.forEach((node: GridNode) => {
        if (
          node.x === this.inputGrid.startPoint.x
          && node.y === this.inputGrid.startPoint.y
        ) { return; }
        if (
          node.x === this.inputGrid.endPoint.x
          && node.y === this.inputGrid.endPoint.y
        ) { return; }

        this.htmlActions.setElement(node.x, node.y, cellTypes.shortestPathCell);
      });
    }, this.timeWaited * this.timeout);

    this.alreadyExecuted = true;
  }
}
