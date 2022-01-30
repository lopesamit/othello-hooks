import { ROW, COL } from '../Board';
const timer = (ms: number) =>
  new Promise((res) => setTimeout(res, ms));

const directions = [
  [-1, 0], //up
  [0, 1], //right
  [1, 0], //down
  [0, -1], //left
];

export const traversalDFS = function (
  startPt: number[],
  endPt: number[],
  setBoard: Function,
) {
  const matrix = new Array(ROW)
    .fill(0)
    .map(() => new Array(COL).fill(1));

  const seen = new Array(ROW)
    .fill(0)
    .map(() => new Array(COL).fill(false));

  const values: number[] = [];
  let [startI, startJ] = startPt;

  dfs(matrix, startI, startJ, seen, values, setBoard);

  return values;
};

const dfs = async function (
  matrix: number[][],
  row: number,
  col: number,
  seen: boolean[][],
  values: number[],
  setBoard: Function,
) {
  if (
    row < 0 ||
    col < 0 ||
    row >= matrix.length ||
    col >= matrix[0].length ||
    seen[row][col]
  )
    return;

  setBoard(row, col);
  await timer(10);

  seen[row][col] = true;
  values.push(matrix[row][col]);

  for (let i = 0; i < directions.length; i++) {
    const currentDir = directions[i];
    const curRow = row + currentDir[0];
    const curCol = col + currentDir[1];
    dfs(matrix, curRow, curCol, seen, values, setBoard);
  }
};
