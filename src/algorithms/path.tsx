let activeSignal: AbortSignal | null = null;

export function setActiveSignal(signal: AbortSignal | null) {
  activeSignal = signal;
}

export function isRunAborted() {
  return !!activeSignal?.aborted;
}

class AbortError extends Error {
  name = 'AbortError';
  constructor() {
    super('Algorithm aborted');
  }
}

export function throwIfAborted() {
  if (isRunAborted()) throw new AbortError();
}

export const timer = (ms: number) =>
  new Promise<void>((resolve, reject) => {
    if (isRunAborted()) {
      reject(new AbortError());
      return;
    }

    const signal = activeSignal;
    const onAbort = () => {
      clearTimeout(id);
      reject(new AbortError());
    };

    const id = setTimeout(() => {
      signal?.removeEventListener('abort', onAbort);
      if (signal?.aborted) reject(new AbortError());
      else resolve();
    }, ms);

    signal?.addEventListener('abort', onAbort, { once: true });
  });

// Walk parent pointers from the end node back to the start.
export function chainFrom(
  node: { row: number; col: number; parent?: any } | null | undefined,
): number[][] {
  const path: number[][] = [];
  let current = node;
  while (current) {
    path.unshift([current.row, current.col]);
    current = current.parent;
  }
  return path;
}

// Orthogonal staircase from start to end — used by scan algorithms
// that don't produce a graph path of their own.
export function manhattanPath(
  startPt: number[],
  endPt: number[],
): number[][] {
  const path: number[][] = [[startPt[0], startPt[1]]];
  let [r, c] = startPt;
  const [er, ec] = endPt;
  while (r !== er) {
    r += r < er ? 1 : -1;
    path.push([r, c]);
  }
  while (c !== ec) {
    c += c < ec ? 1 : -1;
    path.push([r, c]);
  }
  return path;
}

export async function paintPath(
  path: number[][],
  setBoard: Function,
  milliseconds: number,
) {
  for (const [row, col] of path) {
    throwIfAborted();
    setBoard(row, col, 'success');
    await timer(milliseconds);
  }
}
