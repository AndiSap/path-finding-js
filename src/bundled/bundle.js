(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
module.exports = require('./lib/heap');

},{"./lib/heap":2}],2:[function(require,module,exports){
// Generated by CoffeeScript 1.8.0
(function() {
  var Heap, defaultCmp, floor, heapify, heappop, heappush, heappushpop, heapreplace, insort, min, nlargest, nsmallest, updateItem, _siftdown, _siftup;

  floor = Math.floor, min = Math.min;


  /*
  Default comparison function to be used
   */

  defaultCmp = function(x, y) {
    if (x < y) {
      return -1;
    }
    if (x > y) {
      return 1;
    }
    return 0;
  };


  /*
  Insert item x in list a, and keep it sorted assuming a is sorted.
  
  If x is already in a, insert it to the right of the rightmost x.
  
  Optional args lo (default 0) and hi (default a.length) bound the slice
  of a to be searched.
   */

  insort = function(a, x, lo, hi, cmp) {
    var mid;
    if (lo == null) {
      lo = 0;
    }
    if (cmp == null) {
      cmp = defaultCmp;
    }
    if (lo < 0) {
      throw new Error('lo must be non-negative');
    }
    if (hi == null) {
      hi = a.length;
    }
    while (lo < hi) {
      mid = floor((lo + hi) / 2);
      if (cmp(x, a[mid]) < 0) {
        hi = mid;
      } else {
        lo = mid + 1;
      }
    }
    return ([].splice.apply(a, [lo, lo - lo].concat(x)), x);
  };


  /*
  Push item onto heap, maintaining the heap invariant.
   */

  heappush = function(array, item, cmp) {
    if (cmp == null) {
      cmp = defaultCmp;
    }
    array.push(item);
    return _siftdown(array, 0, array.length - 1, cmp);
  };


  /*
  Pop the smallest item off the heap, maintaining the heap invariant.
   */

  heappop = function(array, cmp) {
    var lastelt, returnitem;
    if (cmp == null) {
      cmp = defaultCmp;
    }
    lastelt = array.pop();
    if (array.length) {
      returnitem = array[0];
      array[0] = lastelt;
      _siftup(array, 0, cmp);
    } else {
      returnitem = lastelt;
    }
    return returnitem;
  };


  /*
  Pop and return the current smallest value, and add the new item.
  
  This is more efficient than heappop() followed by heappush(), and can be
  more appropriate when using a fixed size heap. Note that the value
  returned may be larger than item! That constrains reasonable use of
  this routine unless written as part of a conditional replacement:
      if item > array[0]
        item = heapreplace(array, item)
   */

  heapreplace = function(array, item, cmp) {
    var returnitem;
    if (cmp == null) {
      cmp = defaultCmp;
    }
    returnitem = array[0];
    array[0] = item;
    _siftup(array, 0, cmp);
    return returnitem;
  };


  /*
  Fast version of a heappush followed by a heappop.
   */

  heappushpop = function(array, item, cmp) {
    var _ref;
    if (cmp == null) {
      cmp = defaultCmp;
    }
    if (array.length && cmp(array[0], item) < 0) {
      _ref = [array[0], item], item = _ref[0], array[0] = _ref[1];
      _siftup(array, 0, cmp);
    }
    return item;
  };


  /*
  Transform list into a heap, in-place, in O(array.length) time.
   */

  heapify = function(array, cmp) {
    var i, _i, _j, _len, _ref, _ref1, _results, _results1;
    if (cmp == null) {
      cmp = defaultCmp;
    }
    _ref1 = (function() {
      _results1 = [];
      for (var _j = 0, _ref = floor(array.length / 2); 0 <= _ref ? _j < _ref : _j > _ref; 0 <= _ref ? _j++ : _j--){ _results1.push(_j); }
      return _results1;
    }).apply(this).reverse();
    _results = [];
    for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
      i = _ref1[_i];
      _results.push(_siftup(array, i, cmp));
    }
    return _results;
  };


  /*
  Update the position of the given item in the heap.
  This function should be called every time the item is being modified.
   */

  updateItem = function(array, item, cmp) {
    var pos;
    if (cmp == null) {
      cmp = defaultCmp;
    }
    pos = array.indexOf(item);
    if (pos === -1) {
      return;
    }
    _siftdown(array, 0, pos, cmp);
    return _siftup(array, pos, cmp);
  };


  /*
  Find the n largest elements in a dataset.
   */

  nlargest = function(array, n, cmp) {
    var elem, result, _i, _len, _ref;
    if (cmp == null) {
      cmp = defaultCmp;
    }
    result = array.slice(0, n);
    if (!result.length) {
      return result;
    }
    heapify(result, cmp);
    _ref = array.slice(n);
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      elem = _ref[_i];
      heappushpop(result, elem, cmp);
    }
    return result.sort(cmp).reverse();
  };


  /*
  Find the n smallest elements in a dataset.
   */

  nsmallest = function(array, n, cmp) {
    var elem, i, los, result, _i, _j, _len, _ref, _ref1, _results;
    if (cmp == null) {
      cmp = defaultCmp;
    }
    if (n * 10 <= array.length) {
      result = array.slice(0, n).sort(cmp);
      if (!result.length) {
        return result;
      }
      los = result[result.length - 1];
      _ref = array.slice(n);
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        elem = _ref[_i];
        if (cmp(elem, los) < 0) {
          insort(result, elem, 0, null, cmp);
          result.pop();
          los = result[result.length - 1];
        }
      }
      return result;
    }
    heapify(array, cmp);
    _results = [];
    for (i = _j = 0, _ref1 = min(n, array.length); 0 <= _ref1 ? _j < _ref1 : _j > _ref1; i = 0 <= _ref1 ? ++_j : --_j) {
      _results.push(heappop(array, cmp));
    }
    return _results;
  };

  _siftdown = function(array, startpos, pos, cmp) {
    var newitem, parent, parentpos;
    if (cmp == null) {
      cmp = defaultCmp;
    }
    newitem = array[pos];
    while (pos > startpos) {
      parentpos = (pos - 1) >> 1;
      parent = array[parentpos];
      if (cmp(newitem, parent) < 0) {
        array[pos] = parent;
        pos = parentpos;
        continue;
      }
      break;
    }
    return array[pos] = newitem;
  };

  _siftup = function(array, pos, cmp) {
    var childpos, endpos, newitem, rightpos, startpos;
    if (cmp == null) {
      cmp = defaultCmp;
    }
    endpos = array.length;
    startpos = pos;
    newitem = array[pos];
    childpos = 2 * pos + 1;
    while (childpos < endpos) {
      rightpos = childpos + 1;
      if (rightpos < endpos && !(cmp(array[childpos], array[rightpos]) < 0)) {
        childpos = rightpos;
      }
      array[pos] = array[childpos];
      pos = childpos;
      childpos = 2 * pos + 1;
    }
    array[pos] = newitem;
    return _siftdown(array, startpos, pos, cmp);
  };

  Heap = (function() {
    Heap.push = heappush;

    Heap.pop = heappop;

    Heap.replace = heapreplace;

    Heap.pushpop = heappushpop;

    Heap.heapify = heapify;

    Heap.updateItem = updateItem;

    Heap.nlargest = nlargest;

    Heap.nsmallest = nsmallest;

    function Heap(cmp) {
      this.cmp = cmp != null ? cmp : defaultCmp;
      this.nodes = [];
    }

    Heap.prototype.push = function(x) {
      return heappush(this.nodes, x, this.cmp);
    };

    Heap.prototype.pop = function() {
      return heappop(this.nodes, this.cmp);
    };

    Heap.prototype.peek = function() {
      return this.nodes[0];
    };

    Heap.prototype.contains = function(x) {
      return this.nodes.indexOf(x) !== -1;
    };

    Heap.prototype.replace = function(x) {
      return heapreplace(this.nodes, x, this.cmp);
    };

    Heap.prototype.pushpop = function(x) {
      return heappushpop(this.nodes, x, this.cmp);
    };

    Heap.prototype.heapify = function() {
      return heapify(this.nodes, this.cmp);
    };

    Heap.prototype.updateItem = function(x) {
      return updateItem(this.nodes, x, this.cmp);
    };

    Heap.prototype.clear = function() {
      return this.nodes = [];
    };

    Heap.prototype.empty = function() {
      return this.nodes.length === 0;
    };

    Heap.prototype.size = function() {
      return this.nodes.length;
    };

    Heap.prototype.clone = function() {
      var heap;
      heap = new Heap();
      heap.nodes = this.nodes.slice(0);
      return heap;
    };

    Heap.prototype.toArray = function() {
      return this.nodes.slice(0);
    };

    Heap.prototype.insert = Heap.prototype.push;

    Heap.prototype.top = Heap.prototype.peek;

    Heap.prototype.front = Heap.prototype.peek;

    Heap.prototype.has = Heap.prototype.contains;

    Heap.prototype.copy = Heap.prototype.clone;

    return Heap;

  })();

  (function(root, factory) {
    if (typeof define === 'function' && define.amd) {
      return define([], factory);
    } else if (typeof exports === 'object') {
      return module.exports = factory();
    } else {
      return root.Heap = factory();
    }
  })(this, function() {
    return Heap;
  });

}).call(this);

},{}],3:[function(require,module,exports){
var Heap = require("heap");

/**
 * Dijkstra algorithm based on:  https://github.com/bgrins/javascript-astar
 */
class Dijkstra {
  constructor(weight) {
    this.weight = weight == null ? 1 : weight;
  }

  /**
   * Find and returns the shortest path
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

module.exports = Dijkstra;

},{"heap":1}],4:[function(require,module,exports){
/**
 * The Grid class, encapsulates layout of nodes.
 * Converts 2d matrix into adjacency graph
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
  buildNodesFromMatrix = (matrix) => {
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
  getNeighbors = (node) => {
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

},{}],5:[function(require,module,exports){
let Grid = require("./Grid");
let Dijkstra = require("./Dijkstra");
let { colors, events, htmlElement } = require("./Models");

class Gui {
  visited = new Array();
  timeout = 1; // in ms
  timeWaited = 0;
  startPoint = {
    x: undefined,
    y: undefined,
  };
  endPoint = {
    x: undefined,
    y: undefined,
  };
  walls = [];
  alreadyExecuted = false;

  /**
   * sets up Gui component
   */
  constructor() {
    console.log("Gui component created");
    this.matrix = this.createMatrix(24);
  }

  /**
   * sets up grid html component
   */
  setGrid = (grid) => {
    this.grid = grid;

    window.addEventListener(events.load, () => {
      let test = document.getElementsByClassName(htmlElement.grid);
      let putHere = test.item(0);
      putHere.appendChild(this.grid);
      this.onClearButtonClicked();
      this.onStartAlgorithmButtonClicked();
    });
  };

  /**
   * Adds visited element to list
   * @param {number} row represents y coord
   * @param {number} column represents x coord
   */
  getVisitedElement = (row, column) => {
    this.visited.push({ x: row, y: column });
  };

  /**
   * Sets color of element depending on type
   * @param {number} x column value
   * @param {number} y row value
   * @param {boolean} isStart is element startpoint
   * @param {boolean} isWall is element wall
   */
  setElement = (x, y, isStart, isWall) => {
    let element = this.grid.rows[x].cells[y];
    if (isWall) element.style.backgroundColor = colors.wall;
    if (isStart) element.style.backgroundColor = colors.start;
    if (!isStart && !isWall) element.style.backgroundColor = colors.end;
  };

  /**
   * creates matrix representation of grid with row and columns
   * @param {number} rows
   */
  createMatrix = (rows) => {
    /**
     * If walls are added, change matrix cell to 1
     */
    let matrix = new Array(rows);
    for (let i = 0; i < rows; i++) {
      matrix[i] = new Array(rows);
      for (let j = 0; j < rows; j++) {
        matrix[i][j] = 0;
      }
    }
    return matrix;
  };

  /**
   * sets startpoint
   * @param {number} row represents y coord
   * @param {number} col represents x coord
   */
  setStartPoint = (row, col) => {
    this.startPoint = { x: col, y: row };
    this.setElement(this.startPoint.x, this.startPoint.y, true);
    console.log(`startpoint: (${this.startPoint.x}, ${this.startPoint.y})`);
  };

  /**
   * sets endpoint
   * @param {number} row represents y coord
   * @param {number} col represents x coord
   */
  setEndPoint = (row, col) => {
    this.endPoint = { x: col, y: row };
    this.setElement(this.endPoint.x, this.endPoint.y, false);
    console.log(`endpoint: (${this.endPoint.x}, ${this.endPoint.y})`);
  };

  /**
   * sets wall
   * @param {number} row represents y coord
   * @param {number} col represents x coord
   */
  setWall = (row, col) => {
    console.log(`Wall: (${col}, ${row})`);
    this.walls.push({ x: col, y: row });
    this.matrix[row][col] = 1;
    this.setElement(col, row, false, true);
  };

  /**
   * clears grid from all ui changes and resets saved start/endpoint and walls
   */
  clearGrid = () => {
    console.log("Clearing grid");
    this.startPoint = { x: undefined, y: undefined };
    this.endPoint = { x: undefined, y: undefined };
    this.walls = [];
    this.visited = [];

    for (let x = 0; x < this.matrix.length; x++) {
      for (let y = 0; y < this.matrix[0].length; y++) {
        this.grid.rows[x].cells[y].style.backgroundColor = colors.plain;
      }
    }
    this.alreadyExecuted = false;
    this.matrix = this.createMatrix(24);
    this.timeWaited = 0;
  };

  /**
   * starts algorithms and draws shotest path and visited cells
   * @todo: modify this to add algorithm as parameter
   */
  startAlgorithm = () => {
    console.log("Starting algorithm");

    if (this.startPoint.x == null) {
      alert("Cannot start algorithm, choose startpoint first");
      return;
    }
    if (this.endPoint.x == null) {
      alert("Cannot start algorithm, choose endpoint first");
      return;
    }

    let intputGrid = new Grid(this.matrix);

    let dijkstra = new Dijkstra();
    let shortestPath = dijkstra.findShortestPath(
      this.startPoint,
      this.endPoint,
      intputGrid,
      this.getVisitedElement
    );

    /**
     * Animation for visited cells
     */
    this.visited.forEach((node, index) => {
      if (node.x == this.endPoint.x && node.y == this.endPoint.y) return;
      if (node.x == this.startPoint.x && node.y == this.startPoint.y) return;
      setTimeout(() => {
        let element = this.grid.rows[node.x].cells[node.y];
        element.style.backgroundColor = colors.visited;
      }, index * this.timeout);
      this.timeWaited++;
    });

    /**
     * Draws shortest path
     */
    setTimeout(() => {
      shortestPath.forEach((node) => {
        if (node.x == this.startPoint.x && node.y == this.startPoint.y) return;
        if (node.x == this.endPoint.x && node.y == this.endPoint.y) return;
        let element = this.grid.rows[node.x].cells[node.y];
        element.style.backgroundColor = colors.shortestPath;
      });
    }, this.timeWaited * this.timeout);

    this.alreadyExecuted = true;
  };

  /**
   * Executed once clear button is clicked
   */
  onClearButtonClicked = () => {
    document
      .getElementById(htmlElement.clearButton)
      .addEventListener(events.click, () => {
        console.log("Clear button clicked");
        this.clearGrid();
      });
  };

  /**
   * Executed once start algorithm button is clicked
   */
  onStartAlgorithmButtonClicked = () => {
    document
      .getElementById(htmlElement.startAlgorithmButton)
      .addEventListener(events.click, () => {
        console.log("Start algorithm button clicked");
        if (!this.alreadyExecuted) this.startAlgorithm();
      });
  };
}

module.exports = Gui;

},{"./Dijkstra":3,"./Grid":4,"./Models":6}],6:[function(require,module,exports){
/**
 * defines all colors currenlty used
 */
const colors = {
  start: "#82E0AA",
  end: "#D98880",
  visited: "#D6EAF8",
  wall: "#757575",
  shortestPath: "#FFEE58",
  plain: "white",
};

/**
 * defines all html methods used
 */
const htmlElement = {
  grid: "col-md-9",
  clearButton: "clearButton",
  startAlgorithmButton: "startAlgorithmButton",
  startPointButton: "chooseStartButton",
  endPointButton: "chooseEndButton",
};

/**
 * defines events used
 */
const events = {
  click: "click",
  load: "load",
};

module.exports = { colors, htmlElement, events };

},{}],7:[function(require,module,exports){
/**
 * executes all needed classes and functions for running the logic of path-finder
 */
let Gui = require("./Gui");

let gui = new Gui();

let grid = createGrid(24, 24, function (el, row, col, i) {
  el.className = "clicked";
  if (gui.startPoint.x == undefined) {
    gui.setStartPoint(col, row);
  } else if (gui.endPoint.x == undefined) {
    gui.setEndPoint(col, row);
  } else {
    gui.setWall(col, row);
  }
});

function createGrid(rows, cols, callback) {
  var i = 0;
  var grid = document.createElement("table");
  grid.className = "grid";
  for (var r = 0; r < rows; ++r) {
    var tr = grid.appendChild(document.createElement("tr"));
    for (var c = 0; c < cols; ++c) {
      var cell = tr.appendChild(document.createElement("td"));
      cell.addEventListener(
        "click",
        (function (el, r, c, i) {
          return function () {
            callback(el, r, c, i);
          };
        })(cell, r, c, i),
        false
      );
    }
  }
  return grid;
}

document.body.appendChild(grid);
gui.setGrid(grid);

},{"./Gui":5}]},{},[7]);
