let Algorithm = require("./Algorithm");

/**
 * A* algorithm extending Algorithms class
 *
 * Reference for A* Algorithm and comparison to Dijkstra:
 * http://theory.stanford.edu/~amitp/GameProgramming/AStarComparison.html
 */
class AStar extends Algorithm {
  /**
   * using manhattan distance for heuristic (for square grid without diagonal movement)
   * @param {Node} currentNode
   * @param {Node} endNode
   */
  heuristic(currentNode, endNode) {
    let xDiff = Math.abs(currentNode.x - endNode.x);
    let yDiff = Math.abs(currentNode.y - endNode.y);
    return xDiff + yDiff;
  }
}

module.exports = AStar;
