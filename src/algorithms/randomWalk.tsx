import { ROW, COL } from '../components/Board';
import { paintPath, timer } from './path';

const directions = [
  [-1, 0],
  [0, 1],
  [1, 0],
  [0, -1],
];

const MAX_STEPS = 400;

// A drunken walk: hops to a random neighbor until it stumbles onto the
// target or runs out of patience, then highlights the trail it took.
export const randomWalk = async function (
  startPt: number[],
  endPt: number[],
  setBoard: Function,
  milliseconds: number,
) {
  let [row, col] = startPt;
  const [endI, endJ] = endPt;
  const trail: number[][] = [[row, col]];

  setBoard(row, col, 'primary');
  await timer(milliseconds);

  if (row === endI && col === endJ) {
    await paintPath(trail, setBoard, milliseconds);
    return;
  }

  for (let step = 0; step < MAX_STEPS; step++) {
    const moves: number[][] = [];
    for (const [dx, dy] of directions) {
      const r = row + dx;
      const c = col + dy;
      if (r >= 0 && r < ROW && c >= 0 && c < COL) {
        moves.push([r, c]);
      }
    }

    [row, col] = moves[Math.floor(Math.random() * moves.length)];
    trail.push([row, col]);

    setBoard(row, col, 'primary');
    await timer(milliseconds);

    if (row === endI && col === endJ) {
      await paintPath(trail, setBoard, milliseconds);
      return;
    }
  }
};
