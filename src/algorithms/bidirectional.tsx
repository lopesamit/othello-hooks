import { ROW, COL } from '../components/Board';
import { timer } from './bruteForce';

const directions = [
  [-1, 0], // up
  [0, 1], // right
  [1, 0], // down
  [0, -1], // left
];

interface Node {
  row: number;
  col: number;
  parent?: Node;
}

// Follows parent pointers from a node back to its search origin.
function chain(node: Node | undefined): number[][] {
  const cells: number[][] = [];
  while (node) {
    cells.push([node.row, node.col]);
    node = node.parent;
  }
  return cells;
}

export const bidirectional = async function (
  startPt: number[],
  endPt: number[],
  setBoard: Function,
  milliseconds: number,
) {
  const [startI, startJ] = startPt;
  const [endI, endJ] = endPt;

  // Visited-node maps for each direction so both parent chains survive
  // until the searches meet.
  const nodesForward: (Node | null)[][] = new Array(ROW)
    .fill(null)
    .map(() => new Array(COL).fill(null));
  const nodesBackward: (Node | null)[][] = new Array(ROW)
    .fill(null)
    .map(() => new Array(COL).fill(null));

  const startNode: Node = { row: startI, col: startJ };
  const endNode: Node = { row: endI, col: endJ };
  nodesForward[startI][startJ] = startNode;
  nodesBackward[endI][endJ] = endNode;

  const queueForward: Node[] = [startNode];
  const queueBackward: Node[] = [endNode];

  let meetForward: Node | null = null;
  let meetBackward: Node | null = null;

  async function step(
    queue: Node[],
    own: (Node | null)[][],
    other: (Node | null)[][],
  ): Promise<Node | null> {
    const current = queue.shift();
    if (!current) return null;
    const { row, col } = current;

    setBoard(row, col, 'primary');
    await timer(milliseconds);

    // The other search already reached this cell: both chains meet here.
    if (other[row][col]) return current;

    for (const [dx, dy] of directions) {
      const newRow = row + dx;
      const newCol = col + dy;
      if (
        newRow >= 0 &&
        newRow < ROW &&
        newCol >= 0 &&
        newCol < COL &&
        !own[newRow][newCol]
      ) {
        const newNode: Node = {
          row: newRow,
          col: newCol,
          parent: current,
        };
        own[newRow][newCol] = newNode;
        queue.push(newNode);
      }
    }
    return null;
  }

  while (queueForward.length > 0 && queueBackward.length > 0) {
    const hitF = await step(queueForward, nodesForward, nodesBackward);
    if (hitF) {
      meetForward = hitF;
      meetBackward = nodesBackward[hitF.row][hitF.col];
      break;
    }

    const hitB = await step(queueBackward, nodesBackward, nodesForward);
    if (hitB) {
      meetBackward = hitB;
      meetForward = nodesForward[hitB.row][hitB.col];
      break;
    }
  }

  if (meetForward && meetBackward) {
    // start -> meeting cell, then meeting cell -> end (skip the duplicate).
    const path = [
      ...chain(meetForward).reverse(),
      ...chain(meetBackward.parent),
    ];
    for (const [row, col] of path) {
      setBoard(row, col, 'success');
      await timer(milliseconds);
    }
    return path;
  }
  return null;
};
