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
  f: number; // f = g + h
  g: number; // Cost from start to current node
  h: number; // Heuristic (estimated cost from current to end)
  parent?: Node; // Reference to parent node for path reconstruction
}

// Manhattan distance heuristic
function heuristic(
  row: number,
  col: number,
  endI: number,
  endJ: number,
): number {
  return Math.abs(row - endI) + Math.abs(col - endJ);
}

// Function to reconstruct path from end to start
function getPath(endNode: Node): number[][] {
  const path: number[][] = [];
  let current: Node | undefined = endNode;

  while (current) {
    path.unshift([current.row, current.col]);
    current = current.parent;
  }

  return path;
}

export const astar = async function (
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

  const gScore = new Array(ROW)
    .fill(Infinity)
    .map(() => new Array(COL).fill(Infinity));

  gScore[startI][startJ] = 0;

  const startNode: Node = {
    row: startI,
    col: startJ,
    g: 0,
    h: heuristic(startI, startJ, endI, endJ),
    f: heuristic(startI, startJ, endI, endJ),
  };

  const openSet: Node[] = [startNode];
  let finalNode: Node | null = null;

  while (openSet.length > 0) {
    openSet.sort((a, b) => a.f - b.f);
    const current = openSet.shift();
    if (!current) continue;

    const { row, col, g } = current;

    if (seen[row][col]) continue;

    seen[row][col] = true;
    setBoard(
      row,
      col,
      row === startI && col === startJ
        ? 'success'
        : row === endI && col === endJ
        ? 'success'
        : 'primary',
    );
    await timer(milliseconds);

    if (row === endI && col === endJ) {
      finalNode = current;
      break;
    }

    for (const [dx, dy] of directions) {
      const newRow = row + dx;
      const newCol = col + dy;

      if (
        newRow < 0 ||
        newRow >= ROW ||
        newCol < 0 ||
        newCol >= COL ||
        seen[newRow][newCol]
      ) {
        continue;
      }

      const tentativeG = g + 1;
      if (tentativeG < gScore[newRow][newCol]) {
        gScore[newRow][newCol] = tentativeG;
        const h = heuristic(newRow, newCol, endI, endJ);
        const newNode: Node = {
          row: newRow,
          col: newCol,
          g: tentativeG,
          h: h,
          f: tentativeG + h,
          parent: current,
        };
        openSet.push(newNode);
      }
    }
  }

  // If path found, highlight it in green
  if (finalNode) {
    const path = getPath(finalNode);
    for (const [row, col] of path) {
      if (
        (row !== startI || col !== startJ) &&
        (row !== endI || col !== endJ)
      ) {
        setBoard(row, col, 'success');
        await timer(milliseconds);
      }
    }
  }

  return finalNode ? getPath(finalNode) : null;
};
