'use client';

import React from 'react';
import { TetrisHookReturn, Cell, BOARD_WIDTH, BOARD_HEIGHT } from '@/types/tetris.type';

const TetrisPresentation: React.FC<TetrisHookReturn> = ({
  gameState,
  startGame,
  pauseGame,
  resetGame,
  movePiece,
  rotatePiece,
}) => {
  // ゲームボードに現在のピースを重ねて表示するための関数
  const getBoardWithCurrentPiece = (): Cell[][] => {
    const boardCopy = gameState.board.map(row => row.map(cell => ({ ...cell })));
    
    if (gameState.currentPiece) {
      for (let y = 0; y < gameState.currentPiece.shape.length; y++) {
        for (let x = 0; x < gameState.currentPiece.shape[y].length; x++) {
          if (gameState.currentPiece.shape[y][x]) {
            const boardX = gameState.currentPiece.position.x + x;
            const boardY = gameState.currentPiece.position.y + y;
            
            if (boardY >= 0 && boardY < BOARD_HEIGHT && boardX >= 0 && boardX < BOARD_WIDTH) {
              boardCopy[boardY][boardX] = {
                filled: true,
                color: gameState.currentPiece.color,
              };
            }
          }
        }
      }
    }
    
    return boardCopy;
  };

  const renderCell = (cell: Cell, key: string) => (
    <div
      key={key}
      style={{
        width: '20px',
        height: '20px',
        backgroundColor: cell.filled ? cell.color : '#000',
        border: '1px solid #666',
      }}
    />
  );

  const renderBoard = () => {
    const displayBoard = getBoardWithCurrentPiece();
    
    return (
      <div
        className="grid border-2 border-white bg-gray-700 p-1 mx-auto"
        style={{
          gridTemplateColumns: `repeat(${BOARD_WIDTH}, 20px)`,
          gridTemplateRows: `repeat(${BOARD_HEIGHT}, 20px)`,
          gap: '0px',
        }}
      >
        {displayBoard.map((row: Cell[], y: number) =>
          row.map((cell: Cell, x: number) => renderCell(cell, `${y}-${x}`))
        )}
      </div>
    );
  };

  const renderNextPiece = () => {
    if (!gameState.nextPiece) return null;

    return (
      <div className="mb-3">
        <h3 className="text-white mb-2 text-xs sm:text-sm">Next:</h3>
        <div
          className="grid border border-white bg-gray-700 p-1 mx-auto"
          style={{
            gridTemplateColumns: 'repeat(4, 15px)',
            gridTemplateRows: 'repeat(4, 15px)',
            gap: '0px',
            width: 'fit-content',
          }}
        >
          {Array(4).fill(null).map((_, y) =>
            Array(4).fill(null).map((_, x) => {
              const cell = gameState.nextPiece?.shape[y] && gameState.nextPiece.shape[y][x]
                ? { filled: true, color: gameState.nextPiece.color }
                : { filled: false, color: '' };
              return (
                <div
                  key={`next-${y}-${x}`}
                  style={{
                    width: '15px',
                    height: '15px',
                    backgroundColor: cell.filled ? cell.color : '#000',
                    border: '1px solid #666',
                  }}
                />
              );
            })
          )}
        </div>
      </div>
    );
  };

  const renderGameInfo = () => (
    <div className="text-white text-xs sm:text-sm">
      <div className="flex justify-center gap-4 mb-2 sm:block sm:space-y-1">
        <div>Score: {gameState.score}</div>
        <div>Level: {gameState.level}</div>
        <div>Lines: {gameState.lines}</div>
      </div>
      {renderNextPiece()}
    </div>
  );

  const renderControls = () => (
    <div className="mt-3 flex flex-wrap justify-center gap-2">
      {!gameState.isPlaying ? (
        <button
          onClick={startGame}
          className="control-button px-2 py-1 text-xs bg-green-500 text-white rounded"
        >
          Start
        </button>
      ) : (
        <button
          onClick={pauseGame}
          className={`control-button px-2 py-1 text-xs text-white rounded ${
            gameState.isPaused ? 'bg-green-500' : 'bg-orange-500'
          }`}
        >
          {gameState.isPaused ? 'Resume' : 'Pause'}
        </button>
      )}
      <button
        onClick={resetGame}
        className="control-button px-2 py-1 text-xs bg-red-500 text-white rounded"
      >
        Reset
      </button>
    </div>
  );

  const renderMobileControls = () => (
    <div className="mobile-controls mt-3 w-full max-w-xs mx-auto">
      <div className="grid grid-cols-3 gap-1 mb-2">
        <button
          onTouchStart={(e) => { e.preventDefault(); movePiece('left'); }}
          onClick={() => movePiece('left')}
          className="p-2 text-sm bg-blue-500 text-white rounded active:bg-blue-600"
        >
          ←
        </button>
        <button
          onTouchStart={(e) => { e.preventDefault(); rotatePiece(); }}
          onClick={rotatePiece}
          className="p-2 text-sm bg-blue-500 text-white rounded active:bg-blue-600"
        >
          ↻
        </button>
        <button
          onTouchStart={(e) => { e.preventDefault(); movePiece('right'); }}
          onClick={() => movePiece('right')}
          className="p-2 text-sm bg-blue-500 text-white rounded active:bg-blue-600"
        >
          →
        </button>
      </div>
      <div className="flex justify-center">
        <button
          onTouchStart={(e) => { e.preventDefault(); movePiece('down'); }}
          onClick={() => movePiece('down')}
          className="p-2 text-sm bg-blue-500 text-white rounded active:bg-blue-600 w-full"
        >
          ↓
        </button>
      </div>
    </div>
  );

  const renderInstructions = () => (
    <div className="instructions hidden md:block text-white text-xs mt-4">
      <h4 className="mb-1">Controls:</h4>
      <ul className="pl-4 text-xs space-y-0.5">
        <li>← → : Move</li>
        <li>↓ : Fast down</li>
        <li>↑ : Rotate</li>
        <li>P : Pause</li>
      </ul>
    </div>
  );

  const renderGameOverScreen = () => (
    <div
      className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-90 z-50"
    >
      <div className="bg-black bg-opacity-90 p-6 rounded-lg text-center text-white">
        <h2 className="mb-4 text-red-400 text-lg">Game Over!</h2>
        <p className="mb-2 text-sm">Score: {gameState.score}</p>
        <p className="mb-2 text-sm">Level: {gameState.level}</p>
        <p className="mb-4 text-sm">Lines: {gameState.lines}</p>
        <button
          onClick={startGame}
          className="px-4 py-2 bg-green-500 text-white rounded"
        >
          Play Again
        </button>
      </div>
    </div>
  );

  const renderPauseScreen = () => (
    <div
      className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-80 z-50"
    >
      <div className="bg-black bg-opacity-80 p-6 rounded-lg text-center text-white">
        <h2 className="mb-4 text-lg">Game Paused</h2>
        <p className="mb-4 text-sm">Press P or click Resume</p>
        <button
          onClick={pauseGame}
          className="px-4 py-2 bg-green-500 text-white rounded"
        >
          Resume
        </button>
      </div>
    </div>
  );

  return (
    <div className="tetris-container flex flex-col items-center px-2 py-4 bg-gray-900 min-h-screen font-sans overflow-x-hidden">
      <h1 className="tetris-title text-white mb-4 text-xl sm:text-2xl md:text-3xl">Tetris</h1>
      
      <div className="tetris-game-area w-full mx-auto">
        <div className="relative flex flex-col items-center">
          {renderBoard()}
          {gameState.gameOver && renderGameOverScreen()}
          {gameState.isPaused && gameState.isPlaying && renderPauseScreen()}
        </div>
        
        <div className="w-full text-center mt-3">
          {renderGameInfo()}
          {renderControls()}
          {renderMobileControls()}
          {renderInstructions()}
        </div>
      </div>
    </div>
  );
};

export default TetrisPresentation;