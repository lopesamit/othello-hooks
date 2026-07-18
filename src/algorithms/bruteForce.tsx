import { ROW, COL } from '../components/Board';
import { manhattanPath, paintPath, timer } from './path';

export { timer };

export const bruteForce = async (
  startPt: number[],
  endPt: number[],
  setBoard: Function,
  milliseconds: number,
) => {
  const [startI, startJ] = startPt;
  const [endI, endJ] = endPt;

  // Row-major scan starting at the cell after the start point.
  let i = startI;
  let j = startJ + 1;
  if (j >= COL) {
    i += 1;
    j = 0;
  }

  for (; i < ROW; i++) {
    for (; j < COL; j++) {
      if (i === endI && j === endJ) {
        setBoard(i, j, 'primary');
        await timer(milliseconds);
        await paintPath(
          manhattanPath(startPt, endPt),
          setBoard,
          milliseconds,
        );
        return;
      }
      setBoard(i, j, 'primary');
      await timer(milliseconds);
    }
    j = 0;
  }
};
