import React, { useRef, useState } from 'react';
import { bruteForce } from '../algorithms/bruteForce';
import { traversalDFS } from '../algorithms/dfs';
import { traversalBFS } from '../algorithms/bfs';
import { chessKnightBfs } from '../algorithms/chessKnightBfs';
import { chessKnightDfs } from '../algorithms/chessKnightDfs';
import { dijkstra } from '../algorithms/dijkstra';
import { astar } from '../algorithms/astar';
import { bidirectional } from '../algorithms/bidirectional';
import { greedyBestFirst } from '../algorithms/greedyBestFirst';
import { kingBfs } from '../algorithms/kingBfs';
import { spiral } from '../algorithms/spiral';
import { randomWalk } from '../algorithms/randomWalk';

// Kept for the algorithms' setBoard(i, j, color) call signature.
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

type CellState = 'empty' | 'visited' | 'path';

interface Cell {
  state: CellState;
  order: number;
}

type RunState = 'idle' | 'running' | 'done';

const ALGORITHMS = [
  { id: 'brute', name: 'Brute Force', tag: 'Row-by-row scan' },
  { id: 'bfs', name: 'Breadth-First', tag: 'Ripples outward' },
  { id: 'dfs', name: 'Depth-First', tag: 'Dives deep first' },
  { id: 'dijkstra', name: 'Dijkstra', tag: 'Cheapest first' },
  { id: 'astar', name: 'A* Search', tag: 'Heuristic guided' },
  { id: 'greedy', name: 'Greedy Best-First', tag: 'Beeline to target' },
  { id: 'bidirectional', name: 'Bidirectional', tag: 'Meets in middle' },
  { id: 'knightBfs', name: 'Knight BFS', tag: 'L-shaped ripples' },
  { id: 'knightDfs', name: 'Knight DFS', tag: 'L-shaped dives' },
  { id: 'kingBfs', name: 'King BFS', tag: '8-way ripples' },
  { id: 'spiral', name: 'Spiral Scan', tag: 'Rings outward' },
  { id: 'randomWalk', name: 'Random Walk', tag: 'Drunken wander' },
];

type AlgoFn = (
  startPt: number[],
  endPt: number[],
  setBoard: Function,
  milliseconds: number,
) => Promise<unknown>;

const ALGO_FNS: Record<string, AlgoFn> = {
  brute: bruteForce,
  bfs: traversalBFS,
  dfs: traversalDFS,
  dijkstra,
  astar,
  greedy: greedyBestFirst,
  bidirectional,
  knightBfs: chessKnightBfs,
  knightDfs: chessKnightDfs,
  kingBfs,
  spiral,
  randomWalk,
};

const freshGrid = (): Cell[][] =>
  new Array(ROW)
    .fill(0)
    .map(() =>
      new Array(COL).fill(0).map(() => ({ state: 'empty' as CellState, order: 0 })),
    );

export const Board = () => {
  const [grid, setGrid] = useState<Cell[][]>(freshGrid);
  const [startPt, setStart] = useState<number[]>([-1, -1]);
  const [endPt, setEnd] = useState<number[]>([-1, -1]);
  const [algorithm, setAlgorithm] = useState('bfs');
  const [delay, setDelay] = useState(50);
  const [steps, setSteps] = useState(0);
  const [runState, setRunState] = useState<RunState>('idle');
  const [boardEpoch, setBoardEpoch] = useState(0);
  const orderRef = useRef(0);

  const startSelected = startPt[0] !== -1;
  const endSelected = endPt[0] !== -1;

  // Passed to the algorithms as their `setBoard` callback.
  function paintCell(i: number, j: number, color: BtnColor = 'primary') {
    const state: CellState = color === 'success' ? 'path' : 'visited';
    const order = orderRef.current++;
    setSteps((s) => s + 1);
    setGrid((prev) => {
      const next = prev.map((row) => row.slice());
      next[i][j] = { state, order };
      return next;
    });
  }

  function clearWalk() {
    orderRef.current = 0;
    setSteps(0);
    setGrid(freshGrid());
  }

  function handleCellClick(i: number, j: number) {
    if (runState === 'running') return;
    if (!startSelected) {
      setStart([i, j]);
    } else if (!endSelected) {
      if (i === startPt[0] && j === startPt[1]) return;
      // Keep the start point on the earlier row so row-major scans can reach the end.
      if (i <= startPt[0]) {
        setEnd(startPt);
        setStart([i, j]);
      } else {
        setEnd([i, j]);
      }
    }
  }

  function reset() {
    clearWalk();
    setStart([-1, -1]);
    setEnd([-1, -1]);
    setRunState('idle');
    setBoardEpoch((e) => e + 1);
  }

  function pickAlgorithm(id: string) {
    if (runState === 'running') return;
    setAlgorithm(id);
    if (runState === 'done') {
      clearWalk();
      setRunState('idle');
    }
  }

  async function run() {
    if (!startSelected || !endSelected || runState === 'running') return;
    clearWalk();
    setRunState('running');
    try {
      const fn = ALGO_FNS[algorithm];
      if (fn) {
        await fn(startPt, endPt, paintCell, delay);
      }
    } finally {
      setRunState('done');
    }
  }

  const status = !startSelected
    ? 'Tap any cell to place the start point'
    : !endSelected
    ? 'Now tap a cell to place the target'
    : runState === 'running'
    ? 'Exploring the grid\u2026'
    : runState === 'done'
    ? `Search complete \u2014 ${steps} steps`
    : 'Ready \u2014 press Visualize';

  const canRun = startSelected && endSelected && runState !== 'running';
  const selectedAlgo = ALGORITHMS.find((a) => a.id === algorithm);

  return (
    <div className="shell">
      <div className="aurora" aria-hidden="true">
        <div className="blob blob-a" />
        <div className="blob blob-b" />
        <div className="blob blob-c" />
      </div>
      <div className="noise" aria-hidden="true" />

      <header className="hero">
        <span className="badge">10 &times; 10 grid playground</span>
        <h1>
          Path<span className="grad">finder</span>
        </h1>
        <p>
          Pick two points, choose an algorithm, and watch it carve a route
          across the board.
        </p>
      </header>

      <main className="layout">
        <aside className="panel">
          <section className="panel-section">
            <h2 className="section-label">Algorithm</h2>
            <div className="algo-grid" role="radiogroup" aria-label="Algorithm">
              {ALGORITHMS.map((a) => (
                <button
                  key={a.id}
                  role="radio"
                  aria-checked={algorithm === a.id}
                  className={`algo-pill${algorithm === a.id ? ' selected' : ''}`}
                  onClick={() => pickAlgorithm(a.id)}
                  disabled={runState === 'running'}
                >
                  <span className="algo-name">{a.name}</span>
                  <span className="algo-tag">{a.tag}</span>
                </button>
              ))}
            </div>
          </section>

          <section className="panel-section">
            <div className="section-row">
              <h2 className="section-label">Step delay</h2>
              <span className="delay-value">{delay} ms</span>
            </div>
            <input
              className="speed"
              type="range"
              min={0}
              max={500}
              step={50}
              value={delay}
              aria-label="Step delay in milliseconds"
              style={{ '--fill': `${(delay / 500) * 100}%` } as React.CSSProperties}
              onChange={(e) => setDelay(Number(e.target.value))}
            />
            <div className="speed-ends">
              <span>instant</span>
              <span>slow-mo</span>
            </div>
          </section>

          <section className="panel-section">
            <h2 className="section-label">Legend</h2>
            <ul className="legend">
              <li>
                <i className="swatch swatch-start" /> Start
              </li>
              <li>
                <i className="swatch swatch-end" /> Target
              </li>
              <li>
                <i className="swatch swatch-visited" /> Explored
              </li>
              <li>
                <i className="swatch swatch-path" /> Path
              </li>
            </ul>
          </section>

          <div className="actions">
            <button className="btn btn-primary" disabled={!canRun} onClick={run}>
              {runState === 'done' ? 'Run again' : 'Visualize'}
            </button>
            <button className="btn btn-ghost" onClick={reset}>
              Reset
            </button>
          </div>
        </aside>

        <section className={`board-card${runState === 'running' ? ' running' : ''}`}>
          <div className="board-top">
            <p className="status" role="status">
              <span
                className={`status-dot${runState === 'running' ? ' live' : ''}`}
              />
              {status}
            </p>
            <div className="chips">
              {startSelected && (
                <span className="chip chip-start">
                  A&nbsp;{startPt[0]},{startPt[1]}
                </span>
              )}
              {endSelected && (
                <span className="chip chip-end">
                  B&nbsp;{endPt[0]},{endPt[1]}
                </span>
              )}
              <span className="chip">{steps} steps</span>
            </div>
          </div>

          <div className="grid" key={boardEpoch}>
            {grid.map((row, i) =>
              row.map((cell, j) => {
                const isStart = i === startPt[0] && j === startPt[1];
                const isEnd = i === endPt[0] && j === endPt[1];
                let cls = 'cell';
                if (cell.state === 'visited') cls += ' visited';
                if (cell.state === 'path') cls += ' path';
                if (isStart) cls += ' start';
                if (isEnd) cls += ' end';
                return (
                  <button
                    key={`${i}-${j}`}
                    className={cls}
                    aria-label={`Cell ${i}, ${j}`}
                    style={
                      {
                        '--d': `${(i + j) * 22}ms`,
                        '--o': cell.order,
                      } as React.CSSProperties
                    }
                    onClick={() => handleCellClick(i, j)}
                  />
                );
              }),
            )}
          </div>

          <p className="board-footnote">
            {selectedAlgo ? selectedAlgo.name : ''} &middot;{' '}
            {selectedAlgo ? selectedAlgo.tag.toLowerCase() : ''}
          </p>
        </section>
      </main>
    </div>
  );
};
