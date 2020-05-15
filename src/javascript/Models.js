/**
 * defines all colors currenlty used
 */
const colors = {
  start: "#82E0AA",
  end: "#D98880",
  visited: "#D6EAF8",
  wall: "#666666",
  shortestPath: "#FFEE58",
  plain: "white",
  obstacleLight: "#D9D9D9",
  obstacleMedium: "#B3B3B3",
  obstacleHeavy: "#8C8C8C",
  visitedLight: "#A8D2F0",
  visitedMedium: "#7CBCE9",
  visitedHeavy: "#51A5E1"
};

/**
 * defines all html methods used
 */
const htmlElement = {
  grid: "col-md-9",
  clearButton: "clearButton",
  startAlgorithmButton: "startAlgorithmButton",
  resetAlgorithmButton: "resetAlgorithmButton",
  startPointButton: "chooseStartButton",
  endPointButton: "chooseEndButton",
  dijkstra: "dijkstra",
  astar: "astart",
  other: "other",
  slowMotionNormal: "normal",
  slowMotionSlow: "twice",
  slowMotionVerySlow: "triple",
  obstacleWall: "one",
  obstacleLight: "two",
  obstacleMedium: "three",
  obstacleHeavy: "four",
  eraseButton: "erase"
};

/**
 * defines all possible cell types
 */
const cellTypes = {
  plain: "plain",
  start: "start",
  end: "end",
  wall: "wall",
  obstacleLight: "light",
  obstacleMedium: "medium",
  obstacleHeavy: "heavy",
  visitedCell: "visited",
  visitedLight: "visitedLight",
  visitedMedium: "visitedMedium",
  visitedHeavy: "visitedHeavy",
  shortestPathCell: "shortestPath"
};

/**
 * defines weight of obstacles
 */
const obstacleWeights = {
  wall: 1,
  light: 2,
  medium: 3,
  heavy: 4
};

/**
 * defines events used
 */
const events = {
  click: "click",
  load: "load"
};

/**
 * defines timeouts in ms for slow motion
 */
const timeouts = {
  default: 0.5,
  slow: 5,
  verySlow: 15
};

/**
 * defines size of grid/matrix
 */
const gridSize = {
  row: 24,
  column: 24
};

module.exports = {
  colors,
  htmlElement,
  events,
  timeouts,
  obstacleWeights,
  cellTypes,
  gridSize
};
