import React, { useState, useEffect } from 'react';
import { Button } from '@mui/material';
const timer = (ms: number) =>
  new Promise((res) => setTimeout(res, ms));

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
    const board2d = new Array(8)
      .fill(0)
      .map((a, i) =>
        new Array(8)
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

  const bruteForce = async () => {
    const [startI, startJ] = startPt;
    const [endI, endJ] = endPt;

    for (let i = 0; i < 8; i++) {
      for (let j = 0; j < 8; j++) {
        const iStart = i + startI;
        const jStart = j + startJ;

        if (iStart === endI && jStart === endJ) {
          break;
        }

        setBoard(i, j);
        await timer(100);
      }
    }
  };

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
      <Button variant="contained" onClick={() => bruteForce()}>
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
