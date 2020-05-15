import { Algorithm } from './Algorithm';

/**
 * Dijkstra algorithm extending Algorithms class
 *
 * Reference for Dijkstra algorithm:
 * Introduction to Algorithms, Third Edition page 658
 *
 * Reference for comparison to A* Algorithm:
 * http://theory.stanford.edu/~amitp/GameProgramming/AStarComparison.html
 */
export class Dijkstra extends Algorithm {
  /**
   * heuristic returns 0 since Dijkstra's algorithm doesn't take shortest
   * x/y difference into account
   */
  public heuristic(): number {
    return 0;
  }
}
