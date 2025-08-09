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
  dropPiece,
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
      className="tetris-cell"
      style={{
        width: '25px',
        height: '25px',
        border: '1px solid #333',
        backgroundColor: cell.filled ? cell.color : '#000',
        display: 'inline-block',
      }}
    />
  );

  const renderBoard = () => {
    const displayBoard = getBoardWithCurrentPiece();
    
    return (
      <div
        className="tetris-board"
        style={{
          display: 'grid',
          gridTemplateColumns: `repeat(${BOARD_WIDTH}, 25px)`,
          gridTemplateRows: `repeat(${BOARD_HEIGHT}, 25px)`,
          gap: '1px',
          border: '2px solid #fff',
          backgroundColor: '#333',
          padding: '4px',
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
      <div style={{ marginBottom: '20px' }}>
        <h3 style={{ color: '#fff', marginBottom: '10px' }}>Next:</h3>
        <div
          className="next-piece-grid"
          style={{
            display: 'grid',
            gridTemplateColumns: `repeat(4, 20px)`,
            gridTemplateRows: `repeat(4, 20px)`,
            gap: '1px',
            border: '1px solid #fff',
            backgroundColor: '#333',
            padding: '4px',
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
                  className="next-piece-cell"
                  style={{
                    width: '20px',
                    height: '20px',
                    border: '1px solid #333',
                    backgroundColor: cell.filled ? cell.color : '#000',
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
    <div className="game-info" style={{ color: '#fff', fontSize: '18px' }}>
      <div style={{ marginBottom: '10px' }}>Score: {gameState.score}</div>
      <div style={{ marginBottom: '10px' }}>Level: {gameState.level}</div>
      <div style={{ marginBottom: '20px' }}>Lines: {gameState.lines}</div>
      {renderNextPiece()}
    </div>
  );

  const renderControls = () => (
    <div style={{ marginTop: '20px' }}>
      {!gameState.isPlaying ? (
        <button
          onClick={startGame}
          className="control-button"
          style={{
            padding: '10px 20px',
            fontSize: '16px',
            backgroundColor: '#4CAF50',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            marginRight: '10px',
          }}
        >
          Start Game
        </button>
      ) : (
        <button
          onClick={pauseGame}
          className="control-button"
          style={{
            padding: '10px 20px',
            fontSize: '16px',
            backgroundColor: gameState.isPaused ? '#4CAF50' : '#FF9800',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            marginRight: '10px',
          }}
        >
          {gameState.isPaused ? 'Resume' : 'Pause'}
        </button>
      )}
      <button
        onClick={resetGame}
        className="control-button"
        style={{
          padding: '10px 20px',
          fontSize: '16px',
          backgroundColor: '#f44336',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer',
        }}
      >
        Reset
      </button>
    </div>
  );

  const renderMobileControls = () => (
    <div className="mobile-controls" style={{ marginTop: '20px', display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px', maxWidth: '200px' }}>
      <button
        onTouchStart={(e) => { e.preventDefault(); movePiece('left'); }}
        onClick={() => movePiece('left')}
        style={{
          padding: '15px',
          fontSize: '16px',
          backgroundColor: '#2196F3',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer',
        }}
      >
        ←
      </button>
      <button
        onTouchStart={(e) => { e.preventDefault(); rotatePiece(); }}
        onClick={rotatePiece}
        style={{
          padding: '15px',
          fontSize: '16px',
          backgroundColor: '#2196F3',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer',
        }}
      >
        ↻
      </button>
      <button
        onTouchStart={(e) => { e.preventDefault(); movePiece('right'); }}
        onClick={() => movePiece('right')}
        style={{
          padding: '15px',
          fontSize: '16px',
          backgroundColor: '#2196F3',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer',
        }}
      >
        →
      </button>
      <button
        onTouchStart={(e) => { e.preventDefault(); movePiece('down'); }}
        onClick={() => movePiece('down')}
        style={{
          padding: '15px',
          fontSize: '16px',
          backgroundColor: '#2196F3',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer',
          gridColumn: '1 / span 2',
        }}
      >
        ↓
      </button>
      <button
        onTouchStart={(e) => { e.preventDefault(); dropPiece(); }}
        onClick={dropPiece}
        style={{
          padding: '15px',
          fontSize: '16px',
          backgroundColor: '#FF5722',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer',
        }}
      >
        Drop
      </button>
    </div>
  );

  const renderInstructions = () => (
    <div className="instructions" style={{ color: '#fff', fontSize: '14px', marginTop: '20px', maxWidth: '250px' }}>
      <h4>Controls:</h4>
      <ul style={{ paddingLeft: '20px', lineHeight: '1.5' }}>
        <li>← → : Move left/right</li>
        <li>↓ : Move down faster</li>
        <li>↑ : Rotate piece</li>
        <li>Space : Drop piece</li>
        <li>P : Pause/Resume</li>
      </ul>
    </div>
  );

  const renderGameOverScreen = () => (
    <div
      style={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        backgroundColor: 'rgba(0, 0, 0, 0.9)',
        color: 'white',
        padding: '40px',
        borderRadius: '10px',
        textAlign: 'center',
        zIndex: 1000,
      }}
    >
      <h2 style={{ marginBottom: '20px', color: '#ff6b6b' }}>Game Over!</h2>
      <p style={{ marginBottom: '10px', fontSize: '18px' }}>Final Score: {gameState.score}</p>
      <p style={{ marginBottom: '10px' }}>Level: {gameState.level}</p>
      <p style={{ marginBottom: '30px' }}>Lines: {gameState.lines}</p>
      <button
        onClick={startGame}
        style={{
          padding: '15px 30px',
          fontSize: '18px',
          backgroundColor: '#4CAF50',
          color: 'white',
          border: 'none',
          borderRadius: '5px',
          cursor: 'pointer',
        }}
      >
        Play Again
      </button>
    </div>
  );

  const renderPauseScreen = () => (
    <div
      style={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        color: 'white',
        padding: '40px',
        borderRadius: '10px',
        textAlign: 'center',
        zIndex: 1000,
      }}
    >
      <h2 style={{ marginBottom: '20px' }}>Game Paused</h2>
      <p style={{ marginBottom: '30px' }}>Press P to continue or click Resume</p>
      <button
        onClick={pauseGame}
        style={{
          padding: '15px 30px',
          fontSize: '18px',
          backgroundColor: '#4CAF50',
          color: 'white',
          border: 'none',
          borderRadius: '5px',
          cursor: 'pointer',
        }}
      >
        Resume
      </button>
    </div>
  );

  return (
    <div
      className="tetris-container"
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: '20px',
        backgroundColor: '#1a1a1a',
        minHeight: '100vh',
        fontFamily: 'Arial, sans-serif',
      }}
    >
      <h1 className="tetris-title" style={{ color: '#fff', marginBottom: '20px', fontSize: '32px' }}>Tetris</h1>
      
      <div className="tetris-game-area" style={{ display: 'flex', gap: '40px', alignItems: 'flex-start', position: 'relative' }}>
        <div style={{ position: 'relative' }}>
          {renderBoard()}
          {gameState.gameOver && renderGameOverScreen()}
          {gameState.isPaused && gameState.isPlaying && renderPauseScreen()}
        </div>
        
        <div className="tetris-sidebar">
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