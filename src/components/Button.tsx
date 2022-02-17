import React from 'react';
import { Button } from '@mui/material';
import { BtnColor } from './Board';

export const makeButton = (
  i: number,
  j: number,
  variant: 'text' | 'outlined' | 'contained' | undefined,
  setCoordinates: Function,
  color?: BtnColor,
) => {
  if (color) {
    return (
      <Button
        className="button"
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
      className="button"
      variant={variant}
      key={j}
      onClick={() => setCoordinates([i, j])}
    >
      {i}
      {j}
    </Button>
  );
};
