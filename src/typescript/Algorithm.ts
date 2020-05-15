import Heap from 'heap';
import { GridNode, ListNode } from './Types.d';
import { Grid } from './Grid';

/**
 * Algorithm class based on: https://github.com/bgrins/javascript-astar
 * Reused components and made modifications/adaptations to suit our use case.
 */
export abstract class Algorithm {
  private node: ListNode = { x: undefined!, y: undefined! };
  private allCurrentNeighbors: ListNode[] = [];
  private neighbor: ListNode = { x: undefined!, y: undefined! };


  /**
   * Find and returns the shortest path
   */
  public findShortestPath(grid: Grid, getVisitedElement: (node: GridNode) => void): GridNode[] | null {
    const startNode = grid.getNode(grid.startPoint) as ListNode;
    const endNode = grid.getNode(grid.endPoint) as ListNode;
    const nodeList = new Heap((first: ListNode, next: ListNode) => first.fCost! - next.fCost!);

    startNode.gCost = 0;
    startNode.fCost = 0;

    nodeList.push(startNode);
    startNode.opened = true;

    while (!nodeList.empty()) {
      this.node = nodeList.pop(); // gets next node
      this.node.closed = true;

      // returns shortest path if end was reached
      if (this.node === endNode) return this.shortestPath(endNode);

      this.allCurrentNeighbors = grid.getNeighbors(this.node) as ListNode[]; // get neigbours of the current node
      for (let i = 0; i < this.allCurrentNeighbors.length; ++i) {
        this.neighbor = this.allCurrentNeighbors[i];
        if (this.neighbor.closed) continue;

        // get the distance between current node and the neighbor and calculate the next g score
        const nextGCost = (this.node.gCost! + 1) * (this.neighbor.weight as number); // only top/bottom/left/right movement

        // Check if neighbor was not visited yet and has smaller cost
        if (!this.neighbor.opened || nextGCost < this.neighbor.gCost!) {
          this.neighbor.hCost = this.neighbor.hCost || this.heuristic(this.neighbor, endNode);

          this.neighbor.gCost = nextGCost;
          this.neighbor.fCost = this.neighbor.gCost + this.neighbor.hCost;
          this.neighbor.parent = this.node;

          nodeList.push(this.neighbor);
          getVisitedElement(this.neighbor);
          this.neighbor.opened = true;
        }
      }
    }

    return null; // if it cannot find any path, return empty list
  }

  /**
   * creates shortest path in right order (from start to end)
   */
  private shortestPath(endNode: ListNode): GridNode[] {
    const shortestPath = [{ x: endNode.x, y: endNode.y }];
    while (endNode.parent != null) {
      endNode = endNode.parent;
      shortestPath.push({ x: endNode.x, y: endNode.y });
    }
    const shortestPathReversed = shortestPath.reverse();
    return shortestPathReversed;
  }

  protected abstract heuristic(currentNode: GridNode, endNode: GridNode): number;
}
