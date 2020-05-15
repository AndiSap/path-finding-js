/*
 * Creates a node based on its coordinates.
 * Default: walkable = true & weight = 1
 */
export interface GridNode {
  x: number;
  y: number;
  walkable?: boolean;
  weight?: number | string;
}

export interface ListNode extends GridNode {
  fCost?: number;
  gCost?: number;
  hCost?: number;
  parent?: ListNode;
  opened?: boolean;
  closed?: boolean;
}
