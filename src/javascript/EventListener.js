let { events, htmlElement, timeouts, cellTypes } = require("./Models");

class EventListener {
  callback = () => _;

  /**
   * Creates and calls all neccessary html events
   * @param {GuiController} guiController instance for manipulating grid data
   */
  constructor(guiController) {
    this.guiController = guiController;

    window.addEventListener(events.load, () => {
      this.guiController.htmlActions.setGrid();
      this.createListeners();
    });
  }

  /**
   * Creates all html button listeners
   */
  createListeners = () => {
    this.onClearButtonClicked();
    this.onStartAlgorithmButtonClicked();
    this.onChooseStartPointButtonClicked();
    this.onChooseEndPointButtonClicked();
    this.onSetWeights();
    this.onAstartClicked();
    this.onDijkstraClicked();
    this.onOtherClicked();
    this.onSlowMotion();
  };

  /**
   * Executed once clear button is clicked
   */
  onClearButtonClicked = () => {
    document
      .getElementById(htmlElement.clearButton)
      .addEventListener(events.click, () => {
        console.log("Clear button clicked");
        this.guiController.clearGrid();
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
        if (!this.guiController.alreadyExecuted)
          this.guiController.startAlgorithm(this.guiController.algorithm);
      });
  };

  /**
   * Executed once choose start point button is clicked
   */
  onChooseStartPointButtonClicked = () => {
    document
      .getElementById(htmlElement.startPointButton)
      .addEventListener(events.click, () => {
        console.log("Choose start point button clicked");
        this.guiController.choosingStartPoint = true;
        this.guiController.choosingEndPoint = false;
        this.guiController.choosingObstacle = false;
        console.log("choosingStart: " + this.guiController.choosingStartPoint);
      });
  };

  /**
   * Executed once choose end point button is clicked
   */
  onChooseEndPointButtonClicked = () => {
    document
      .getElementById(htmlElement.endPointButton)
      .addEventListener(events.click, () => {
        console.log("Choose end point button clicked");
        this.guiController.choosingStartPoint = false;
        this.guiController.choosingEndPoint = true;
        this.guiController.choosingObstacle = false;
        console.log("choosingEnd: " + this.guiController.choosingEndPoint);
      });
  };

  /**
   * Executed once A* Algorithm button is clicked
   */
  onAstartClicked = () => {
    document
      .getElementById(htmlElement.astar)
      .addEventListener(events.click, () => {
        console.log("Setting algorithm to AStart");
        this.guiController.algorithm = this.guiController.astar;
      });
  };

  /**
   * Executed once Dijkstra Algorithm button is clicked
   */
  onDijkstraClicked = () => {
    document
      .getElementById(htmlElement.dijkstra)
      .addEventListener(events.click, () => {
        console.log("Setting algorithm to Dijkstra");
        this.guiController.algorithm = this.guiController.dijkstra;
      });
  };

  /**
   * Executed once "other" button is clicked
   */
  onOtherClicked = () => {
    document
      .getElementById(htmlElement.other)
      .addEventListener(events.click, () => {
        alert("More algorithms comming soon!");
        if (this.guiController.algorithm == this.guiController.dijkstra)
          document.getElementById(htmlElement.dijkstra).checked = true;
        else document.getElementById(htmlElement.astar).checked = true;
      });
  };

  /**
   * Executed once one of the slow motion selection is clicked
   */
  onSlowMotion = () => {
    document
      .getElementById(htmlElement.slowMotionNormal)
      .addEventListener(
        events.click,
        () => (this.guiController.timeout = timeouts.default)
      );
    document
      .getElementById(htmlElement.slowMotionSlow)
      .addEventListener(
        events.click,
        () => (this.guiController.timeout = timeouts.slow)
      );
    document
      .getElementById(htmlElement.slowMotionVerySlow)
      .addEventListener(
        events.click,
        () => (this.guiController.timeout = timeouts.verySlow)
      );
  };

  /**
   * Executed once one of the elements selection is clicked
   */
  onSetWeights = () => {
    document
      .getElementById(htmlElement.obstacleWall)
      .addEventListener(events.click, () => {
        this.guiController.choosingStartPoint = false;
        this.guiController.choosingEndPoint = false;
        this.guiController.choosingObstacle = true;
        this.guiController.weightsActive = false;
        console.log(`Setting obstacle to: ${cellTypes.wall}`);
        this.guiController.currentWeight = cellTypes.wall;
      });
    document
      .getElementById(htmlElement.obstacleLight)
      .addEventListener(events.click, () => {
        this.guiController.choosingStartPoint = false;
        this.guiController.choosingEndPoint = false;
        this.guiController.choosingObstacle = true;
        this.guiController.weightsActive = true;
        console.log(`Setting obstacle to: ${cellTypes.obstacleLight}`);
        this.guiController.currentWeight = cellTypes.obstacleLight;
      });
    document
      .getElementById(htmlElement.obstacleMedium)
      .addEventListener(events.click, () => {
        this.guiController.choosingStartPoint = false;
        this.guiController.choosingEndPoint = false;
        this.guiController.choosingObstacle = true;
        this.guiController.weightsActive = true;
        console.log(`Setting obstacle to: ${cellTypes.obstacleMedium}`);
        this.guiController.currentWeight = cellTypes.obstacleMedium;
      });
    document
      .getElementById(htmlElement.obstacleHeavy)
      .addEventListener(events.click, () => {
        this.guiController.choosingStartPoint = false;
        this.guiController.choosingEndPoint = false;
        this.guiController.choosingObstacle = true;
        this.guiController.weightsActive = true;
        console.log(`Setting obstacle to: ${cellTypes.obstacleHeavy}`);
        this.guiController.currentWeight = cellTypes.obstacleHeavy;
      });
  };
}

module.exports = EventListener;