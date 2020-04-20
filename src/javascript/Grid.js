/**
 *
 * Grid class based on: https://github.com/bgrins/javascript-astar
 * Reused components and made modifications/adaptations to suite our use case.
 *
 * The Grid class, encapsulates layout of nodes.
 * Converts 2d matrix into adjacency graph
 */
class Grid {
  constructor(input) {
    this.nodes = this.buildNodesFromMatrix(input);
  }

  /**
   * Build and return the nodes.
   */
  buildNodesFromMatrix = (matrix) => {
    this.height = matrix.length;
    this.width = matrix[0].length;
    let nodes = [];

    for (let i = 0; i < this.height; ++i) {
      nodes[i] = [];
      for (let j = 0; j < this.width; ++j) {
        nodes[i][j] = new Node(j, i);
      }
    }

    for (let i = 0; i < this.height; ++i) {
      for (let j = 0; j < this.width; ++j) {
        if (matrix[i][j] === 1) nodes[i][j].walkable = false;
      }
    }
    return nodes;
  };

  /**
   * Returns cell of matrix [row][column]
   */
  getNode = (x, y) => {
    return this.nodes[y][x];
  };

  /**
   * Sets weight of given node
   */
  setWeight = (x, y, weight) => {
    this.nodes[y][x].weight = weight;
  };

  /**
   * Gets weight given of node
   */
  getWeight = (x, y) => {
    return this.nodes[y][x].weight;
  };

  /**
   * Returns true if position is inside of the grid and walkable
   */
  reachable = (x, y) => {
    return this.insideGrid(x, y) && this.nodes[y][x].walkable;
  };

  /**
   * Determines whether position is inside grid.
   */
  insideGrid = (x, y) => {
    let withinXBorder = x >= 0 && x < this.width;
    let withinYBorder = y >= 0 && y < this.height;
    return withinXBorder && withinYBorder;
  };

  /**
   * Gets neighbors of node
   * @todo: add diagonal movement
   */
  getNeighbors = (node) => {
    let x = node.x;
    let y = node.y;
    let neighbors = [];
    let nodesList = this.nodes;

    // top
    let top = y - 1;
    if (this.reachable(x, top)) neighbors.push(nodesList[top][x]);

    // right
    let right = x + 1;
    if (this.reachable(right, y)) neighbors.push(nodesList[y][right]);

    // bottom
    let bottom = y + 1;
    if (this.reachable(x, bottom)) neighbors.push(nodesList[bottom][x]);

    // left
    let left = x - 1;
    if (this.reachable(left, y)) neighbors.push(nodesList[y][left]);

    return neighbors;
  };
}

/**
 * Creates a node based on its coordinates.
 * Default: walkable = true & weight = 1
 */
class Node {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.walkable = true;
    this.weight = 1;
  }
}

module.exports = Grid;
