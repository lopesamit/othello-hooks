import React, { useState, useEffect } from 'react';
import { Button, Slider, MenuItem, TextField } from '@mui/material';
import { bruteForce } from '../algorithms/bruteForce';
import { traversalDFS } from '../algorithms/dfs';
import { traversalBFS } from '../algorithms/bfs';
import { makeButton } from './Button';
import { chessRookBfs } from '../algorithms/chessRookBfs';
import { chessRookDfs } from '../algorithms/chessRookDfs';

export type BtnColor =
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
  const [coordinates, setCoordinates] = useState([-1, -1]);
  const freshBoard = () => {
    const board2d = new Array(ROW)
      .fill(0)
      .map((a, i) =>
        new Array(COL)
          .fill(0)
          .map((b, j) =>
            makeButton(i, j, 'outlined', setCoordinates),
          ),
      );
    return board2d;
  };

  const board2d = freshBoard();

  const [board, setBoardState] = useState(board2d);
  const [startPt, setStart] = useState([-1, -1]);
  const [endPt, setEnd] = useState([-1, -1]);
  const [isReset, setReset] = useState(false);
  const [algorithm, setAlgorithm] = useState('brute');
  const [sliderValue, setSliderValue] = useState(0);
  let [steps, setSteps] = useState(0);

  function setBoard(i: number, j: number, color?: BtnColor) {
    board[i][j] = makeButton(i, j, 'contained', setCoordinates);
    setBoardState([...board]);

    if (startPt[0] === -1) {
      setStart([i, j]);
      board[i][j] = makeButton(
        i,
        j,
        'contained',
        setCoordinates,
        'success',
      );
      setBoardState([...board]);
    } else if (endPt[0] === -1) {
      setEnd([i, j]);
      let [startI, startJ] = startPt;
      if (i <= startI) {
        setStart([i, j]);
        setEnd([startI, startJ]);
      }

      board[i][j] = makeButton(
        i,
        j,
        'contained',
        setCoordinates,
        'success',
      );
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
    } else if (algorithm === 'dfs') {
      traversalDFS([startI, startJ], endPt, setBoard, sliderValue);
    } else if (algorithm === 'rookBfs') {
      chessRookBfs([startI, startJ], endPt, setBoard, sliderValue);
    } else if (algorithm === 'rookDfs') {
      chessRookDfs([startI, startJ], endPt, setBoard, sliderValue);
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
      <div className="algorithm">
        <h2>Algorithm</h2>
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
          <MenuItem value="rookBfs">Chess rook BFS</MenuItem>
          <MenuItem value="rookDfs">Chess rook DFS</MenuItem>
        </TextField>
      </div>

      <div className="startEndPoints">
        <h2>Select starting and ending box</h2>
        <div>
          Start: {startPt[0] !== -1 ? startPt : ''} End:{' '}
          {endPt[0] !== -1 ? endPt : ''}
        </div>
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
      </div>

      <div className="slider">
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
      </div>
      <div className="board">
        <p>Steps: {steps}</p>
        {board.map((a, i) => (
          <div key={i}>
            {a.map((b, j) => board[i][j])}
            <br />
          </div>
        ))}
      </div>
    </>
  );
};
