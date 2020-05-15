import { Algorithm } from './Algorithm';
import { GridNode } from './Types.d';

/**
 * A* algorithm extending Algorithms class
 *
 * Reference for A* Algorithm and comparison to Dijkstra:
 * http://theory.stanford.edu/~amitp/GameProgramming/AStarComparison.html
 */
export class AStar extends Algorithm {
  /**
   * using manhattan distance for heuristic (for square grid without diagonal movement)
   * @param {GridNode} currentNode
   * @param {GridNode} endNode
   */
  public heuristic(currentNode: GridNode, endNode: GridNode): number {
    const xDiff = Math.abs(currentNode.x - endNode.x);
    const yDiff = Math.abs(currentNode.y - endNode.y);
    return xDiff + yDiff;
  }
}
