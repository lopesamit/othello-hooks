import { ROW, COL } from '../components/Board';
import { timer } from './bruteForce';

// A chess king moves one square in any of the 8 directions.
const directions = [
  [-1, -1],
  [-1, 0],
  [-1, 1],
  [0, -1],
  [0, 1],
  [1, -1],
  [1, 0],
  [1, 1],
];

interface Node {
  row: number;
  col: number;
  parent?: Node;
}

export const kingBfs = async function (
  startPt: number[],
  endPt: number[],
  setBoard: Function,
  milliseconds: number,
) {
  const [startI, startJ] = startPt;
  const [endI, endJ] = endPt;

  const seen = new Array(ROW)
    .fill(false)
    .map(() => new Array(COL).fill(false));

  const startNode: Node = { row: startI, col: startJ };
  const queue: Node[] = [startNode];
  seen[startI][startJ] = true;
  let finalNode: Node | null = null;

  while (queue.length > 0) {
    const current = queue.shift();
    if (!current) continue;
    const { row, col } = current;

    setBoard(row, col, 'primary');
    await timer(milliseconds);

    if (row === endI && col === endJ) {
      finalNode = current;
      break;
    }

    for (const [dx, dy] of directions) {
      const newRow = row + dx;
      const newCol = col + dy;
      if (
        newRow >= 0 &&
        newRow < ROW &&
        newCol >= 0 &&
        newCol < COL &&
        !seen[newRow][newCol]
      ) {
        seen[newRow][newCol] = true;
        queue.push({ row: newRow, col: newCol, parent: current });
      }
    }
  }

  if (finalNode) {
    const path: number[][] = [];
    let node: Node | undefined = finalNode;
    while (node) {
      path.unshift([node.row, node.col]);
      node = node.parent;
    }
    for (const [row, col] of path) {
      setBoard(row, col, 'success');
      await timer(milliseconds);
    }
    return path;
  }
  return null;
};
