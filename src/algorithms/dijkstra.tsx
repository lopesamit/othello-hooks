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
  distance: number;
  parent?: Node;
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

export const dijkstra = async function (
  startPt: number[],
  endPt: number[],
  setBoard: Function,
  milliseconds: number,
) {
  const distances = new Array(ROW)
    .fill(Infinity)
    .map(() => new Array(COL).fill(Infinity));

  const seen = new Array(ROW)
    .fill(false)
    .map(() => new Array(COL).fill(false));

  const [startI, startJ] = startPt;
  const [endI, endJ] = endPt;

  const startNode: Node = {
    row: startI,
    col: startJ,
    distance: 0,
  };

  const queue: Node[] = [startNode];
  distances[startI][startJ] = 0;
  let finalNode: Node | null = null;

  while (queue.length > 0) {
    queue.sort((a, b) => a.distance - b.distance);
    const current = queue.shift();
    if (!current) continue;

    const { row, col, distance } = current;

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

      const newDistance = distance + 1;
      if (newDistance < distances[newRow][newCol]) {
        distances[newRow][newCol] = newDistance;
        const newNode: Node = {
          row: newRow,
          col: newCol,
          distance: newDistance,
          parent: current,
        };
        queue.push(newNode);
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
