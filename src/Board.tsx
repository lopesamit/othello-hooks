import React from 'react';
import { Button } from '@mui/material';

export const Board = () => {
  const board2d = new Array(8).fill(0).map(a => new Array(8).fill(0))
  return (
    <>
      {
        board2d.map(a => {
          return (
            <>
              {a.map(b => <Button variant='contained'>0</Button>)}
              <br />
            </>
          )
        })
      }
    </>
  )
}