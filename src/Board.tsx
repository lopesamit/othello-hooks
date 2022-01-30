import React, { useState, useEffect } from 'react';
import { Button } from '@mui/material';
import { bruteForce } from './algorithms/bruteForce';
import { traversalDFS } from './algorithms/dfs';
import { traversalBFS } from './algorithms/bfs';

export const ROW = 10;
export const COL = 10;

export const Board = () => {
  const makeButton = (i: number, j: number, variant: string) => {
    return (
      <Button
        variant={variant as any}
        key={j}
        onClick={() => setCoordinates([i, j])}
      >
        {i}
        {j}
      </Button>
    );
  };

  const freshBoard = () => {
    const board2d = new Array(ROW)
      .fill(0)
      .map((a, i) =>
        new Array(COL)
          .fill(0)
          .map((b, j) => makeButton(i, j, 'outlined')),
      );
    return board2d;
  };

  const board2d = freshBoard();

  const [board, setBoardState] = useState(board2d);
  const [startPt, setStart] = useState([-1, -1]);
  const [endPt, setEnd] = useState([-1, -1]);
  const [coordinates, setCoordinates] = useState([-1, -1]);
  const [isReset, setReset] = useState(false);

  function setBoard(i: number, j: number) {
    board[i][j] = makeButton(i, j, 'contained');
    setBoardState([...board]);
    console.log(startPt);

    if (startPt[0] === -1) {
      setStart([i, j]);
    } else if (endPt[0] === -1) {
      setEnd([i, j]);
    }
  }

  useEffect(() => {
    const [i, j] = coordinates;
    if (i !== -1 && j !== -1) {
      setBoard(i, j);
    }
    console.log({ isReset });
    if (isReset) {
      setStart([-1, -1]);
      setEnd([-1, -1]);
      const board2d = freshBoard();
      setBoardState([...board2d]);
      setReset(false);
      setCoordinates([-1, -1]);
    }
  }, [coordinates, isReset]);

  return (
    <>
      <div>Start: {startPt}</div>
      <div>End: {endPt}</div>
      <Button variant="contained" onClick={() => setReset(true)}>
        Reset
      </Button>
      <Button
        variant="contained"
        // onClick={() => bruteForce(startPt, endPt, setBoard)}
        // onClick={() => traversalDFS(startPt, endPt, setBoard)}
        onClick={() => traversalBFS(startPt, endPt, setBoard)}
      >
        Start
      </Button>
      {board.map((a, i) => (
        <div key={i}>
          {a.map((b, j) => board[i][j])}
          <br />
        </div>
      ))}
    </>
  );
};
