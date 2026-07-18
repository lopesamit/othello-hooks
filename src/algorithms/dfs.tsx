import { ROW, COL } from '../components/Board';
import { chainFrom, paintPath, timer } from './path';

const directions = [
  [-1, 0], //up
  [0, 1], //right
  [1, 0], //down
  [0, -1], //left
];

interface Node {
  row: number;
  col: number;
  parent?: Node;
}

export const traversalDFS = async function (
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

  let finalNode: Node | null = null;

  const dfs = async function (node: Node): Promise<boolean> {
    const { row, col } = node;
    if (
      row < 0 ||
      col < 0 ||
      row >= ROW ||
      col >= COL ||
      seen[row][col] ||
      finalNode
    ) {
      return false;
    }

    seen[row][col] = true;
    setBoard(row, col, 'primary');
    await timer(milliseconds);

    if (row === endI && col === endJ) {
      finalNode = node;
      return true;
    }

    for (const [dx, dy] of directions) {
      const found = await dfs({
        row: row + dx,
        col: col + dy,
        parent: node,
      });
      if (found) return true;
    }
    return false;
  };

  await dfs({ row: startI, col: startJ });

  if (finalNode) {
    const path = chainFrom(finalNode);
    await paintPath(path, setBoard, milliseconds);
    return path;
  }
  return null;
};
