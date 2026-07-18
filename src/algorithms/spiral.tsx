import { ROW, COL } from '../components/Board';
import { manhattanPath, paintPath, timer } from './path';

// Scans concentric square rings around the start until the target turns up,
// then paints a route from start to end.
export const spiral = async function (
  startPt: number[],
  endPt: number[],
  setBoard: Function,
  milliseconds: number,
) {
  const [startI, startJ] = startPt;
  const [endI, endJ] = endPt;

  setBoard(startI, startJ, 'primary');
  await timer(milliseconds);

  if (startI === endI && startJ === endJ) {
    await paintPath(manhattanPath(startPt, endPt), setBoard, milliseconds);
    return;
  }

  const maxRadius = Math.max(
    startI,
    ROW - 1 - startI,
    startJ,
    COL - 1 - startJ,
  );

  for (let radius = 1; radius <= maxRadius; radius++) {
    const top = startI - radius;
    const bottom = startI + radius;
    const left = startJ - radius;
    const right = startJ + radius;

    const ring: number[][] = [];
    for (let c = left; c <= right; c++) ring.push([top, c]);
    for (let r = top + 1; r <= bottom; r++) ring.push([r, right]);
    for (let c = right - 1; c >= left; c--) ring.push([bottom, c]);
    for (let r = bottom - 1; r >= top + 1; r--) ring.push([r, left]);

    for (const [row, col] of ring) {
      if (row < 0 || row >= ROW || col < 0 || col >= COL) continue;

      setBoard(row, col, 'primary');
      await timer(milliseconds);

      if (row === endI && col === endJ) {
        await paintPath(
          manhattanPath(startPt, endPt),
          setBoard,
          milliseconds,
        );
        return;
      }
    }
  }
};
