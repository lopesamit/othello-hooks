import { ROW, COL } from '../components/Board';
import { timer } from './bruteForce';

const directions = [
  [-2, -1],
  [-1, -2],
  [1, -2],
  [2, -1],
  [-2, 1],
  [-1, 2],
  [1, 2],
  [2, 1],
];

export const chessRookDfs = function (
  startPt: number[],
  endPt: number[],
  setBoard: Function,
  milliseconds: number,
) {
  const matrix = new Array(ROW)
    .fill(0)
    .map(() => new Array(COL).fill(1));

  const seen = new Array(ROW)
    .fill(0)
    .map(() => new Array(COL).fill(false));

  let [startI, startJ] = startPt;

  let shouldBreak = false;
  const [endI, endJ] = endPt;

  const dfs = async function (
    matrix: number[][],
    row: number,
    col: number,
    seen: boolean[][],
    setBoard: Function,
  ) {
    if (
      row < 0 ||
      col < 0 ||
      row >= matrix.length ||
      col >= matrix[0].length ||
      seen[row][col] ||
      shouldBreak
    ) {
      return;
    }

    seen[row][col] = true;
    setBoard(row, col);

    if (row === endI && col === endJ) {
      shouldBreak = true;
      return;
    }

    await timer(milliseconds);

    for (let i = 0; i < directions.length; i++) {
      const currentDir = directions[i];
      const curRow = row + currentDir[0];
      const curCol = col + currentDir[1];
      dfs(matrix, curRow, curCol, seen, setBoard);
    }
  };
  dfs(matrix, startI, startJ, seen, setBoard);
};
