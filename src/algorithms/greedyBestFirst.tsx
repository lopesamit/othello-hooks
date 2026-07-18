import { ROW, COL } from '../components/Board';
import { timer } from './bruteForce';

const directions = [
  [-1, 0],
  [0, 1],
  [1, 0],
  [0, -1],
];

interface Node {
  row: number;
  col: number;
  h: number;
  parent?: Node;
}

// Expands whichever frontier cell looks closest to the target
// (Manhattan distance only — no path cost), so it beelines toward it.
export const greedyBestFirst = async function (
  startPt: number[],
  endPt: number[],
  setBoard: Function,
  milliseconds: number,
) {
  const [startI, startJ] = startPt;
  const [endI, endJ] = endPt;
  const heuristic = (r: number, c: number) =>
    Math.abs(r - endI) + Math.abs(c - endJ);

  const seen = new Array(ROW)
    .fill(false)
    .map(() => new Array(COL).fill(false));

  const open: Node[] = [
    { row: startI, col: startJ, h: heuristic(startI, startJ) },
  ];
  let finalNode: Node | null = null;

  while (open.length > 0) {
    open.sort((a, b) => a.h - b.h);
    const current = open.shift();
    if (!current) continue;
    const { row, col } = current;
    if (seen[row][col]) continue;
    seen[row][col] = true;

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
        open.push({
          row: newRow,
          col: newCol,
          h: heuristic(newRow, newCol),
          parent: current,
        });
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
