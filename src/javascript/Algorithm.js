var Heap = require("heap");

/**
 * Algorithm class based on: https://github.com/bgrins/javascript-astar
 * Reused components and made modifications/adaptations to suit our use case.
 */
class Algorithm {
  /**
   * Javascript by default doesn't have abstract classes.
   * Heuristic-method must be implemented when extending this class.
   * If not, it will throw an error (clean way -> use TypeScript instead of JavaScript)
   */
  constructor() {
    if (this.heuristic === undefined)
      throw new Error(
        "Cannot extend Algorithms class, must implement heuristic method"
      );
  }

  /**
   * Find and returns the shortest path
   */
  findShortestPath = (grid, getVisitedElement) => {
    let startNode = grid.getNode(grid.startPoint);
    let endNode = grid.getNode(grid.endPoint);
    let node, allCurrentNeighbors, neighbor;
    let nodeList = new Heap((first, next) => first.fCost - next.fCost);

    startNode.gCost = 0;
    startNode.fCost = 0;

    nodeList.push(startNode);
    startNode.opened = true;

    while (!nodeList.empty()) {
      node = nodeList.pop(); // gets next node
      node.closed = true;

      // returns shortest path if end was reached
      if (node === endNode) return this.shortestPath(endNode);

      allCurrentNeighbors = grid.getNeighbors(node); // get neigbours of the current node
      for (let i = 0; i < allCurrentNeighbors.length; ++i) {
        neighbor = allCurrentNeighbors[i];
        if (neighbor.closed) continue;

        // get the distance between current node and the neighbor and calculate the next g score
        let nextGCost = (node.gCost + 1) * neighbor.weight; // only top/bottom/left/right movement

        // Check if neighbor was not visited yet and has smaller cost
        if (!neighbor.opened || nextGCost < neighbor.gCost) {
          neighbor.hCost = neighbor.hCost || this.heuristic(neighbor, endNode);

          neighbor.gCost = nextGCost;
          neighbor.fCost = neighbor.gCost + neighbor.hCost;
          neighbor.parent = node;

          nodeList.push(neighbor);
          getVisitedElement(neighbor);
          neighbor.opened = true;
        }
      }
    }

    return null; // if it cannot find any path, return empty list
  };

  /**
   * creates shortest path in right order (from start to end)
   */
  shortestPath = (endNode) => {
    let shortestPath = [{ x: endNode.x, y: endNode.y }];
    while (endNode.parent != null) {
      endNode = endNode.parent;
      shortestPath.push({ x: endNode.x, y: endNode.y });
    }
    let shortestPathReversed = shortestPath.reverse();
    return shortestPathReversed;
  };
}

module.exports = Algorithm;
