import { ROW, COL } from '../components/Board';

export const timer = (ms: number) =>
  new Promise((res) => setTimeout(res, ms));

export const bruteForce = async (
  startPt: number[],
  endPt: number[],
  setBoard: Function,
  milliseconds: number,
) => {
  let [startI, startJ] = startPt;
  const [endI, endJ] = endPt;

  for (let i = 0; i < ROW; i++) {
    for (let j = 0; j < COL; j++) {
      let iStart = i + startI;
      let jStart = j + startJ;

      if (iStart === ROW || jStart === COL) {
        startJ = 0;
        continue;
      }

      if (iStart === endI && jStart === endJ) {
        return;
      }
      setBoard(iStart, jStart);
      await timer(milliseconds);
    }
  }
};
