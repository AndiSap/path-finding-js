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
