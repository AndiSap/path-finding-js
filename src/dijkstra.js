var Heap = require("heap");

/**
 * Dijkstra algorithm based on:  https://github.com/bgrins/javascript-astar
 */
class Dijkstra {
  constructor(weight) {
    this.weight = weight == null ? 1 : weight;
  }

  /**
   * Find and returns the shortest path.
   */
  findShortestPath = (start, end, grid, getVisitedElement) => {
    let startNode = grid.getNode(start.x, start.y);
    let endNode = grid.getNode(end.x, end.y);
    let node, allCurrentNeighbors, neighbor;
    let nodeList = new Heap((first, next) => first.fCost - next.fCost);

    startNode.gCost = 0;
    startNode.fCost = 0;

    nodeList.push(startNode);
    startNode.opened = true;

    while (!nodeList.empty()) {
      // console.log(nodeList.peek());
      node = nodeList.pop(); // gets next node
      node.closed = true;

      // returns shortest path if end was reached
      if (node === endNode) return this.shortestPath(endNode);

      allCurrentNeighbors = grid.getNeighbors(node); // get neigbours of the current node
      for (let i = 0; i < allCurrentNeighbors.length; ++i) {
        neighbor = allCurrentNeighbors[i];
        if (neighbor.closed) continue;

        // get the distance between current node and the neighbor and calculate the next g score
        let nextGCost = node.gCost + 1; // only top/bottom/left/right movement

        // Check if neighbor was not visited yet and has smaller cost
        if (!neighbor.opened || nextGCost < neighbor.gCost) {
          neighbor.hCost = this.weight;
          neighbor.gCost = nextGCost;
          neighbor.fCost = neighbor.gCost + neighbor.hCost;
          neighbor.parent = node;

          nodeList.push(neighbor);
          getVisitedElement(neighbor.x, neighbor.y);
          neighbor.opened = true;
        }
      }
    }

    return null; // if it cannot find any path, return empty list
  };

  shortestPath = endNode => {
    let shortestPath = [{ x: endNode.x, y: endNode.y }];
    while (endNode.parent != null) {
      endNode = endNode.parent;
      shortestPath.push({ x: endNode.x, y: endNode.y });
    }
    let shortestPathReversed = shortestPath.reverse();
    return shortestPathReversed;
  };
}

module.exports = Dijkstra;
