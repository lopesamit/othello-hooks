import React, { useState, useEffect } from 'react';
import {
  Button,
  Slider,
  Select,
  MenuItem,
  TextField,
} from '@mui/material';
import { bruteForce } from './algorithms/bruteForce';
import { traversalDFS } from './algorithms/dfs';
import { traversalBFS } from './algorithms/bfs';

type BtnColor =
  | 'inherit'
  | 'primary'
  | 'secondary'
  | 'success'
  | 'error'
  | 'info'
  | 'warning'
  | undefined;

export const ROW = 10;
export const COL = 10;

export const Board = () => {
  const makeButton = (
    i: number,
    j: number,
    variant: 'text' | 'outlined' | 'contained' | undefined,
    color?: BtnColor,
  ) => {
    if (color) {
      return (
        <Button
          key={j}
          color={color as any}
          variant="contained"
          onClick={() => setCoordinates([i, j])}
        >
          {i}
          {j}
        </Button>
      );
    }
    return (
      <Button
        variant={variant}
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
  const [algorithm, setAlgorithm] = useState('brute');
  const [sliderValue, setSliderValue] = useState(0);
  let [steps, setSteps] = useState(0);

  function setBoard(i: number, j: number, color?: BtnColor) {
    board[i][j] = makeButton(i, j, 'contained');
    setBoardState([...board]);
    console.log(startPt);

    if (startPt[0] === -1) {
      setStart([i, j]);
      board[i][j] = makeButton(i, j, 'contained', 'success');
      setBoardState([...board]);
    } else if (endPt[0] === -1) {
      setEnd([i, j]);
      board[i][j] = makeButton(i, j, 'contained', 'success');
      setBoardState([...board]);
    }
    setSteps(steps++);
  }

  function callAlgo() {
    const [startI, startJ] = startPt;
    if (algorithm === 'brute') {
      bruteForce([startI, startJ + 1], endPt, setBoard, sliderValue);
    } else if (algorithm === 'bfs') {
      traversalBFS([startI, startJ], endPt, setBoard, sliderValue);
    } else {
      traversalDFS([startI, startJ], endPt, setBoard, sliderValue);
    }
  }

  useEffect(() => {
    const [i, j] = coordinates;
    if (i !== -1 && j !== -1) {
      setBoard(i, j);
    }
    if (isReset) {
      setStart([-1, -1]);
      setEnd([-1, -1]);
      const board2d = freshBoard();
      setBoardState([...board2d]);
      setReset(false);
      setCoordinates([-1, -1]);
      setSteps(0);
    }
  }, [coordinates, isReset]);

  const startSelected = !startPt.includes(-1);
  const endSelected = !endPt.includes(-1);

  const disabled = startSelected && endSelected;

  return (
    <>
      <h2>Select an algorithm</h2>
      <TextField
        label="Algorithm"
        value={algorithm}
        placeholder="Select"
        select
        onChange={(e) => setAlgorithm(e.target.value as string)}
      >
        <MenuItem value="brute">Brute force</MenuItem>
        <MenuItem value="bfs">Breath first search</MenuItem>
        <MenuItem value="dfs">Depth first search</MenuItem>
      </TextField>

      <h2>Select starting and ending box</h2>
      <div>Start: {startPt}</div>
      <div>End: {endPt}</div>
      <Button variant="contained" onClick={() => setReset(true)}>
        Reset
      </Button>
      <Button
        variant="contained"
        disabled={!disabled}
        onClick={() => callAlgo()}
      >
        Start
      </Button>

      <h2>Select time in ms </h2>

      <Slider
        aria-label="miliseconds"
        defaultValue={0}
        valueLabelDisplay={'auto'}
        step={50}
        marks
        min={0}
        max={500}
        value={sliderValue}
        getAriaValueText={() => `${sliderValue} ms`}
        onChange={(e, value: number | number[]) =>
          Array.isArray(value)
            ? setSliderValue(value[0])
            : setSliderValue(value)
        }
      />
      <div>
        <p>Steps: {steps}</p>
      </div>

      {board.map((a, i) => (
        <div key={i}>
          {a.map((b, j) => board[i][j])}
          <br />
        </div>
      ))}
    </>
  );
};
