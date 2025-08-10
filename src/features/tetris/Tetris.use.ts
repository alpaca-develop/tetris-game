'use client';

import { useEffect, useCallback } from 'react';
import { create } from 'zustand';
import {
  GameState,
  TetrisHookReturn,
  Tetromino,
  Position,
  TETROMINO_SHAPES,
  BOARD_WIDTH,
  BOARD_HEIGHT,
  EMPTY_CELL,
  Cell,
} from '@/types/tetris.type';

// Zustand store
interface TetrisStore extends GameState {
  setGameState: (partial: Partial<GameState>) => void;
  resetGameState: () => void;
}

const createEmptyBoard = (): Cell[][] =>
  Array(BOARD_HEIGHT)
    .fill(null)
    .map(() => Array(BOARD_WIDTH).fill(null).map(() => ({ ...EMPTY_CELL })));

const initialGameState: GameState = {
  board: createEmptyBoard(),
  currentPiece: null,
  nextPiece: null,
  score: 0,
  level: 1,
  lines: 0,
  isPlaying: false,
  isPaused: false,
  gameOver: false,
};

const useTetrisStore = create<TetrisStore>((set) => ({
  ...initialGameState,
  setGameState: (partial) => set((state) => ({ ...state, ...partial })),
  resetGameState: () => set({ ...initialGameState, board: createEmptyBoard() }),
}));

// ヘルパー関数
const getRandomTetromino = (): Tetromino => {
  const shapes = Object.keys(TETROMINO_SHAPES) as Array<keyof typeof TETROMINO_SHAPES>;
  const randomShape = shapes[Math.floor(Math.random() * shapes.length)];
  const tetrominoData = TETROMINO_SHAPES[randomShape];
  
  return {
    shape: tetrominoData.shape.map(row => [...row]),
    color: tetrominoData.color,
    position: { x: Math.floor(BOARD_WIDTH / 2) - Math.floor(tetrominoData.shape[0].length / 2), y: 0 },
  };
};

const isValidPosition = (board: Cell[][], piece: Tetromino, newPos: Position): boolean => {
  for (let y = 0; y < piece.shape.length; y++) {
    for (let x = 0; x < piece.shape[y].length; x++) {
      if (piece.shape[y][x]) {
        const newX = newPos.x + x;
        const newY = newPos.y + y;
        
        if (newX < 0 || newX >= BOARD_WIDTH || newY >= BOARD_HEIGHT) {
          return false;
        }
        
        if (newY >= 0 && board[newY][newX].filled) {
          return false;
        }
      }
    }
  }
  return true;
};

const placePieceOnBoard = (board: Cell[][], piece: Tetromino): Cell[][] => {
  const newBoard = board.map(row => row.map(cell => ({ ...cell })));
  
  for (let y = 0; y < piece.shape.length; y++) {
    for (let x = 0; x < piece.shape[y].length; x++) {
      if (piece.shape[y][x]) {
        const boardX = piece.position.x + x;
        const boardY = piece.position.y + y;
        
        if (boardY >= 0 && boardY < BOARD_HEIGHT && boardX >= 0 && boardX < BOARD_WIDTH) {
          newBoard[boardY][boardX] = {
            filled: true,
            color: piece.color,
          };
        }
      }
    }
  }
  
  return newBoard;
};

const clearLines = (board: Cell[][]): { newBoard: Cell[][]; linesCleared: number } => {
  const newBoard = board.filter(row => !row.every(cell => cell.filled));
  const linesCleared = BOARD_HEIGHT - newBoard.length;
  
  // 新しい空の行を上に追加
  while (newBoard.length < BOARD_HEIGHT) {
    newBoard.unshift(Array(BOARD_WIDTH).fill(null).map(() => ({ ...EMPTY_CELL })));
  }
  
  return { newBoard, linesCleared };
};

const rotatePiece = (piece: Tetromino): Tetromino => {
  const rotated = piece.shape[0].map((_, index) =>
    piece.shape.map(row => row[index]).reverse()
  );
  
  return {
    ...piece,
    shape: rotated,
  };
};

const calculateScore = (linesCleared: number, level: number): number => {
  const baseScores = [0, 40, 100, 300, 1200];
  return baseScores[linesCleared] * level;
};

export const useTetris = (): TetrisHookReturn => {
  const gameState = useTetrisStore();
  const setGameState = useTetrisStore(state => state.setGameState);
  const resetGameState = useTetrisStore(state => state.resetGameState);
  
  const currentPiece = useTetrisStore(state => state.currentPiece);
  const nextPiece = useTetrisStore(state => state.nextPiece);
  const board = useTetrisStore(state => state.board);
  const isPlaying = useTetrisStore(state => state.isPlaying);
  const isPaused = useTetrisStore(state => state.isPaused);
  const score = useTetrisStore(state => state.score);
  const level = useTetrisStore(state => state.level);
  const lines = useTetrisStore(state => state.lines);

  const generateNewPiece = useCallback(() => {
    if (!nextPiece) {
      const current = getRandomTetromino();
      const next = getRandomTetromino();
      setGameState({
        currentPiece: current,
        nextPiece: next,
      });
    } else {
      const next = getRandomTetromino();
      setGameState({
        currentPiece: nextPiece,
        nextPiece: next,
      });
    }
  }, [nextPiece, setGameState]);

  const checkGameOver = useCallback((board: Cell[][], piece: Tetromino): boolean => {
    return !isValidPosition(board, piece, piece.position);
  }, []);

  const movePiece = useCallback((direction: 'left' | 'right' | 'down') => {
    if (!currentPiece || !isPlaying || isPaused) return;

    const deltaX = direction === 'left' ? -1 : direction === 'right' ? 1 : 0;
    const deltaY = direction === 'down' ? 1 : 0;
    
    const newPosition: Position = {
      x: currentPiece.position.x + deltaX,
      y: currentPiece.position.y + deltaY,
    };

    if (isValidPosition(board, currentPiece, newPosition)) {
      setGameState({
        currentPiece: {
          ...currentPiece,
          position: newPosition,
        },
      });
    } else if (direction === 'down') {
      // ピースを固定
      const newBoard = placePieceOnBoard(board, currentPiece);
      const { newBoard: clearedBoard, linesCleared } = clearLines(newBoard);
      const newScore = score + calculateScore(linesCleared, level);
      const newLines = lines + linesCleared;
      const newLevel = Math.floor(newLines / 10) + 1;

      const newNextPiece = getRandomTetromino();
      
      if (checkGameOver(clearedBoard, newNextPiece)) {
        setGameState({
          board: clearedBoard,
          gameOver: true,
          isPlaying: false,
        });
      } else {
        setGameState({
          board: clearedBoard,
          currentPiece: nextPiece,
          nextPiece: newNextPiece,
          score: newScore,
          level: newLevel,
          lines: newLines,
        });
      }
    }
  }, [currentPiece, isPlaying, isPaused, board, score, level, lines, nextPiece, setGameState, checkGameOver]);

  const rotatePieceHandler = useCallback(() => {
    if (!currentPiece || !isPlaying || isPaused) return;

    const rotatedPiece = rotatePiece(currentPiece);
    
    if (isValidPosition(board, rotatedPiece, rotatedPiece.position)) {
      setGameState({
        currentPiece: rotatedPiece,
      });
    }
  }, [currentPiece, isPlaying, isPaused, board, setGameState]);


  const startGame = useCallback(() => {
    resetGameState();
    generateNewPiece();
    setGameState({ isPlaying: true });
  }, [resetGameState, setGameState, generateNewPiece]);

  const pauseGame = useCallback(() => {
    setGameState({ isPaused: !isPaused });
  }, [isPaused, setGameState]);

  const resetGame = useCallback(() => {
    resetGameState();
  }, [resetGameState]);

  // ゲームループ
  useEffect(() => {
    if (!isPlaying || isPaused || gameState.gameOver || !currentPiece) return;

    const interval = setInterval(() => {
      movePiece('down');
    }, Math.max(50, 1000 - (level - 1) * 100));

    return () => clearInterval(interval);
  }, [isPlaying, isPaused, gameState.gameOver, level, movePiece, currentPiece]);

  // キーボード入力
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (!isPlaying) return;

      switch (e.key) {
        case 'ArrowLeft':
          e.preventDefault();
          movePiece('left');
          break;
        case 'ArrowRight':
          e.preventDefault();
          movePiece('right');
          break;
        case 'ArrowDown':
          e.preventDefault();
          movePiece('down');
          break;
        case 'ArrowUp':
          e.preventDefault();
          rotatePieceHandler();
          break;
        case 'p':
        case 'P':
          pauseGame();
          break;
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [isPlaying, movePiece, rotatePieceHandler, pauseGame]);

  return {
    gameState,
    startGame,
    pauseGame,
    resetGame,
    movePiece,
    rotatePiece: rotatePieceHandler,
  };
};