// テトリスゲームの型定義
export interface Position {
  x: number;
  y: number;
}

export interface Cell {
  filled: boolean;
  color: string;
}

export type GameBoard = Cell[][];

export interface Tetromino {
  shape: number[][];
  color: string;
  position: Position;
}

export interface GameState {
  board: GameBoard;
  currentPiece: Tetromino | null;
  nextPiece: Tetromino | null;
  score: number;
  level: number;
  lines: number;
  isPlaying: boolean;
  isPaused: boolean;
  gameOver: boolean;
}

export interface TetrisHookReturn {
  gameState: GameState;
  startGame: () => void;
  pauseGame: () => void;
  resetGame: () => void;
  movePiece: (direction: 'left' | 'right' | 'down') => void;
  rotatePiece: () => void;
  dropPiece: () => void;
}

export const TETROMINO_SHAPES = {
  I: {
    shape: [
      [0, 0, 0, 0],
      [1, 1, 1, 1],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ],
    color: '#00f0f0',
  },
  O: {
    shape: [
      [1, 1],
      [1, 1],
    ],
    color: '#f0f000',
  },
  T: {
    shape: [
      [0, 1, 0],
      [1, 1, 1],
      [0, 0, 0],
    ],
    color: '#a000f0',
  },
  S: {
    shape: [
      [0, 1, 1],
      [1, 1, 0],
      [0, 0, 0],
    ],
    color: '#00f000',
  },
  Z: {
    shape: [
      [1, 1, 0],
      [0, 1, 1],
      [0, 0, 0],
    ],
    color: '#f00000',
  },
  J: {
    shape: [
      [1, 0, 0],
      [1, 1, 1],
      [0, 0, 0],
    ],
    color: '#0000f0',
  },
  L: {
    shape: [
      [0, 0, 1],
      [1, 1, 1],
      [0, 0, 0],
    ],
    color: '#f0a000',
  },
} as const;

export const BOARD_WIDTH = 10;
export const BOARD_HEIGHT = 20;
export const EMPTY_CELL: Cell = { filled: false, color: '' };