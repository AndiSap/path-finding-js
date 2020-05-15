import {
  colors, htmlElement, cellTypes, events,
} from './Models.d';

export class HtmlActions {
  private grid: HTMLTableElement;

  constructor(grid: HTMLTableElement) {
    this.grid = grid;
  }

  /**
   * creates html representation of grid
   * @param {number} rows total number of grid rows
   * @param {number} cols total number of grid columns
   * @param {callback} callback which will be executed once a click event is recognized
   */
  public static createGrid(rows: number, cols: number, callback: (element: HTMLElement, row: number, col: number, index: number) => void): HTMLTableElement {
    const i = 0;
    const grid = document.createElement('table');
    grid.className = 'grid';
    for (let r = 0; r < rows; ++r) {
      const tr = grid.appendChild(document.createElement('tr'));
      for (let c = 0; c < cols; ++c) {
        const cell = tr.appendChild(document.createElement('td'));
        cell.addEventListener(
          events.click,
          (() => {
            const cb = (el: HTMLElement, row: number, col: number, idx: number) => () => {
              callback(el, row, col, idx);
            };
            cb(cell, r, c, i);
          }),
          false,
        );
      }
    }
    return grid;
  }

  /**
   * sets up grid html component
   */
  setGrid = () => {
    const htmlGridDiv = document.getElementsByClassName(htmlElement.grid);
    const putHere = htmlGridDiv.item(0);
    putHere!.appendChild(this.grid);
  };

  /**
   * Sets color of element depending on type
   * @param {number} x column value
   * @param {number} y row value
   * @param {cellType} type the element type (plain, start, end, wall or obstacle)
   */
  setElement = (x: number, y: number, type: cellTypes) => {
    const element = this.grid.rows[x].cells[y];

    switch (type) {
      case cellTypes.plain:
        element.style.backgroundColor = colors.plain;
        break;
      case cellTypes.wall:
        element.style.backgroundColor = colors.wall;
        break;
      case cellTypes.start:
        element.style.backgroundColor = colors.start;
        break;
      case cellTypes.end:
        element.style.backgroundColor = colors.end;
        break;
      case cellTypes.obstacleLight:
        element.style.backgroundColor = colors.obstacleLight;
        break;
      case cellTypes.obstacleMedium:
        element.style.backgroundColor = colors.obstacleMedium;
        break;
      case cellTypes.obstacleHeavy:
        element.style.backgroundColor = colors.obstacleHeavy;
        break;
      case cellTypes.visitedCell:
        element.style.backgroundColor = colors.visited;
        break;
      case cellTypes.visitedLight:
        element.style.backgroundColor = colors.visitedLight;
        break;
      case cellTypes.visitedMedium:
        element.style.backgroundColor = colors.visitedMedium;
        break;
      case cellTypes.visitedHeavy:
        element.style.backgroundColor = colors.visitedHeavy;
        break;
      case cellTypes.shortestPathCell:
        element.style.backgroundColor = colors.shortestPath;
        break;
      default:
        element.style.backgroundColor = colors.plain;
        break;
    }
  };

  /**
   * Resets element selection on clearGrid to default to start point
   */
  public resetElementsUi(): void {
    document.getElementById(htmlElement.startPointButton).click();
  }
}
