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
	this.onResetAlgorithmButtonClicked();
    this.onChooseStartPointButtonClicked();
    this.onChooseEndPointButtonClicked();
    this.onSetWeights();
    this.onAstartClicked();
    this.onDijkstraClicked();
    this.onOtherClicked();
    this.onSlowMotion();
    this.onEraseClicked();
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
   * Exectued once reset algorithm button is clicked
   */
  onResetAlgorithmButtonClicked = () => {
    document
      .getElementById(htmlElement.resetAlgorithmButton)
      .addEventListener(events.click, () => {
        console.log("Reset algorithm button clicked");
        if(this.guiController.alreadyExecuted){
          this.guiController.resetAlgorithm();
        } else {
          console.log("Algorithm not yet exectued");
        }
    });
  };

  /**
   * Executed once choose start point button is clicked
   */
  onChooseStartPointButtonClicked = () => {
    document
      .getElementById(htmlElement.startPointButton)
      .addEventListener(events.click, () => {
        console.log("Choosing start point");
        this.guiController.choosingStartPoint = true;
        this.guiController.choosingEndPoint = false;
        this.guiController.choosingObstacle = false;
        this.guiController.erasing = false;
      });
  };

  /**
   * Executed once choose end point button is clicked
   */
  onChooseEndPointButtonClicked = () => {
    document
      .getElementById(htmlElement.endPointButton)
      .addEventListener(events.click, () => {
        console.log("Choosing end point");
        this.guiController.choosingStartPoint = false;
        this.guiController.choosingEndPoint = true;
        this.guiController.choosingObstacle = false;
        this.guiController.erasing = false;
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
        this.guiController.erasing = false;
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
        this.guiController.erasing = false;
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
        this.guiController.erasing = false;
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
        this.guiController.erasing = false;
        this.guiController.weightsActive = true;
        console.log(`Setting obstacle to: ${cellTypes.obstacleHeavy}`);
        this.guiController.currentWeight = cellTypes.obstacleHeavy;
      });
  };
  
  /**
   * Exectued once erase button is clicked
   */
  onEraseClicked = () => {
    document
      .getElementById(htmlElement.eraseButton)
      .addEventListener(events.click, () => {
        console.log("Erase button clicked");
        this.guiController.choosingStartPoint = false;
        this.guiController.choosingEndPoint = false;
        this.guiController.choosingObstacle = false;
        this.guiController.erasing = true;
    });
  };
  
}

module.exports = EventListener;
