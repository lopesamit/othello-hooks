import { ROW, COL } from '../Board';
const timer = (ms: number) =>
  new Promise((res) => setTimeout(res, ms));

const directions = [
  [-1, 0], //up
  [0, 1], //right
  [1, 0], //down
  [0, -1], //left
];

export const traversalBFS = async function (
  startPt: number[],
  endPt: number[],
  setBoard: Function,
) {
  const matrix = new Array(ROW)
    .fill(0)
    .map(() => new Array(COL).fill(1));

  const seen = new Array(matrix.length)
    .fill(0)
    .map(() => new Array(matrix[0].length).fill(false));

  const values = [];
  let [startI, startJ] = startPt;

  const queue = [startPt];

  while (queue.length) {
    const currentPos = queue.shift();
    if (!currentPos) continue;
    const row = currentPos[0];
    const col = currentPos[1];

    if (
      row < 0 ||
      row >= matrix.length ||
      col < 0 ||
      col >= matrix[0].length ||
      seen[row][col]
    ) {
      continue;
    }
    setBoard(row, col);
    await timer(10);

    seen[row][col] = true;
    values.push(matrix[row][col]);

    for (let i = 0; i < directions.length; i++) {
      const currentDir = directions[i];
      queue.push([row + currentDir[0], col + currentDir[1]]);
    }
  }

  return values;
};
