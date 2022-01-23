import React, { useState, useEffect } from 'react';
import { Button } from '@mui/material';

export const Board = () => {
  const board2d = new Array(8)
    .fill(0)
    .map((a, i) =>
      new Array(8)
        .fill(0)
        .map((b, j) => makeButton(i, j, 'outlined', setBoard)),
    );

  const [board, setBoardState] = useState(board2d);

  function setBoard(i: number, j: number) {
    board2d[i][j] = makeButton(i, j, 'contained', setBoard);
    setBoardState([...board2d]);
  }

  return (
    <>
      {board.map((a, i) => (
        <div key={i}>
          {a.map((b, j) => board[i][j])}
          <br />
        </div>
      ))}
    </>
  );
};

const makeButton = (
  i: number,
  j: number,
  variant: string,
  setBoard: Function,
) => {
  return (
    <Button
      variant={variant as any}
      key={j}
      onClick={(a) => setBoard(i, j)}
    >
      {i}
      {j}
    </Button>
  );
};
