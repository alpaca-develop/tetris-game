'use client';

import React from 'react';
import { useTetris } from './Tetris.use';
import TetrisPresentation from './Tetris.presentational';

export const TetrisContainer: React.FC = () => {
  const props = useTetris();
  
  return <TetrisPresentation {...props} />;
};