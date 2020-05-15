import { GridNode } from './Types.d';
/**
 *
 * Grid class based on: https://github.com/bgrins/javascript-astar
 * Reused components and made modifications/adaptations to suit our use case.
 *
 * The Grid class, encapsulates layout of nodes.
 * Converts 2d matrix into adjacency graph
 */
export class Grid {
  public startPoint: GridNode;

  public endPoint: GridNode;

  private height: number = 0;

  private width: number = 0;

  private girdNodes: GridNode[][] = [];

  constructor() {
    this.startPoint = { x: 0, y: 0 };
    this.endPoint = { x: 0, y: 0 };
  }

  /**
   * Builds the nodes.
   */
  public buildNodesFromMatrix(matrix: number[][]): void {
    this.height = matrix.length;
    this.width = matrix[0].length;
    const nodes: GridNode[][] = [];

    for (let i = 0; i < this.height; ++i) {
      nodes[i] = [];
      for (let j = 0; j < this.width; ++j) {
        nodes[i][j] = { x: j, y: i };
      }
    }

    for (let i = 0; i < this.height; ++i) {
      for (let j = 0; j < this.width; ++j) {
        if (matrix[i][j] === 1) nodes[i][j].walkable = false;
      }
    }
    this.girdNodes = nodes;
  }

  /**
   * Returns cell of matrix [row][column]
   */
  public getNode(node: GridNode): GridNode {
    return this.girdNodes[node.y][node.x];
  }

  /**
   * Returns weight of given node
   */
  public getWeight(x: number, y: number): number {
    return this.girdNodes[y][x].weight as number;
  }

  /**
   * Sets weight of given node
   */
  public setWeight(x: number, y: number, weight: number): void {
    this.girdNodes[y][x].weight = weight;
  }

  /**
   * Returns true if position is inside of the grid and walkable
   */
  private reachable(x: number, y: number): boolean {
    return this.insideGrid(x, y) && this.girdNodes[y][x].walkable!;
  }

  /**
   * Determines whether position is inside grid.
   */
  private insideGrid(x: number, y: number): boolean {
    const withinXBorder = x >= 0 && x < this.width;
    const withinYBorder = y >= 0 && y < this.height;
    return withinXBorder && withinYBorder;
  }

  /**
   * Gets neighbors of node
   * @todo: add diagonal movement
   */
  public getNeighbors(node: GridNode): GridNode[] {
    const { x } = node;
    const { y } = node;
    const neighbors = [];
    const nodesList = this.girdNodes;

    // top
    const top = y - 1;
    if (this.reachable(x, top)) neighbors.push(nodesList[top][x]);

    // right
    const right = x + 1;
    if (this.reachable(right, y)) neighbors.push(nodesList[y][right]);

    // bottom
    const bottom = y + 1;
    if (this.reachable(x, bottom)) neighbors.push(nodesList[bottom][x]);

    // left
    const left = x - 1;
    if (this.reachable(left, y)) neighbors.push(nodesList[y][left]);

    return neighbors;
  }
}
