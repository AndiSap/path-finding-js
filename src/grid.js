/**
 * The Grid class, encapsulates layout of nodes.
 * @param intput  0-1 matrix representing the walkable status of nodes ( 0 = walkable; 1 = blocked )
 */
class Grid {
  constructor(input) {
    this.height = input.length;
    this.width = input[0].length;

    this.nodes = this.buildNodesFromMatrix(input);
  }

  /**
   * Build and return the nodes.
   */
  buildNodesFromMatrix = matrix => {
    let nodes = new Array(this.height);

    for (let i = 0; i < this.height; ++i) {
      nodes[i] = new Array(this.width);
      for (let j = 0; j < this.width; ++j) {
        nodes[i][j] = new Node(j, i);
      }
    }

    for (let i = 0; i < this.height; ++i) {
      for (let j = 0; j < this.width; ++j) {
        if (matrix[i][j]) nodes[i][j].walkable = false; // everything != (0 || false) will be blocked
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
   * Returns true if position is inside of the grid and walkable
   */
  walkable = (x, y) => {
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
  getNeighbors = node => {
    let x = node.x;
    let y = node.y;
    let neighbors = [];
    let nodesList = this.nodes;

    // top
    let top = y - 1;
    if (this.walkable(x, top)) neighbors.push(nodesList[top][x]);

    // right
    let right = x + 1;
    if (this.walkable(right, y)) neighbors.push(nodesList[y][right]);

    // bottom
    let bottom = y + 1;
    if (this.walkable(x, bottom)) neighbors.push(nodesList[bottom][x]);

    // left
    let left = x - 1;
    if (this.walkable(left, y)) neighbors.push(nodesList[y][left]);

    return neighbors;
  };
}

function Node(x, y, walkable) {
  this.x = x;
  this.y = y;
  this.walkable = walkable === undefined ? true : walkable;
}

module.exports = Grid;
