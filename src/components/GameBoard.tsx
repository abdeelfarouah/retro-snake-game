import React from 'react';
import { useGameLogic } from '../hooks/useGameLogic';
import { ArrowUp, ArrowDown, ArrowLeft, ArrowRight } from 'lucide-react';

const getSnakeColor = (score: number): string => {
  if (score >= 300) return 'bg-purple-500';
  if (score >= 200) return 'bg-yellow-500';
  if (score >= 100) return 'bg-blue-500';
  if (score >= 50) return 'bg-orange-500';
  return 'bg-green-500';
};

const GameBoard: React.FC = () => {
  const {
    gameBoard,
    score,
    isGameOver,
    direction,
    startGame,
    isPaused,
    togglePause,
  } = useGameLogic();

  const snakeColor = getSnakeColor(score);

  return (
    <div className="flex flex-col items-center gap-6">
      <div className="flex items-center gap-8">
        <div className="text-2xl font-bold">Score: {score}</div>
        <div className="flex gap-4">
          <button
            onClick={startGame}
            className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition"
          >
            New Game
          </button>
          <button
            onClick={togglePause}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
          >
            {isPaused ? 'Resume' : 'Pause'}
          </button>
        </div>
      </div>

      <div className="relative">
        <div 
          className="grid bg-gray-800 rounded-lg overflow-hidden"
          style={{
            gridTemplateColumns: `repeat(${gameBoard[0].length}, minmax(0, 1fr))`,
            gap: '1px',
          }}
        >
          {gameBoard.map((row, i) =>
            row.map((cell, j) => (
              <div
                key={`${i}-${j}`}
                className={`w-6 h-6 ${
                  cell === 'snake'
                    ? snakeColor
                    : cell === 'food'
                    ? 'bg-red-500'
                    : 'bg-gray-700'
                }`}
              />
            ))
          )}
        </div>

        {isGameOver && (
          <div className="absolute inset-0 bg-black/70 flex items-center justify-center rounded-lg">
            <div className="text-white text-2xl font-bold">Game Over!</div>
          </div>
        )}
      </div>

      <div className="flex flex-col items-center gap-2">
        <div className="flex justify-center">
          <button
            className={`p-3 rounded-full ${
              direction === 'UP' ? 'bg-gray-200' : 'bg-gray-100'
            } hover:bg-gray-200 transition`}
            aria-label="Move Up"
          >
            <ArrowUp className="w-6 h-6" />
          </button>
        </div>
        <div className="flex gap-2">
          <button
            className={`p-3 rounded-full ${
              direction === 'LEFT' ? 'bg-gray-200' : 'bg-gray-100'
            } hover:bg-gray-200 transition`}
            aria-label="Move Left"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          <button
            className={`p-3 rounded-full ${
              direction === 'DOWN' ? 'bg-gray-200' : 'bg-gray-100'
            } hover:bg-gray-200 transition`}
            aria-label="Move Down"
          >
            <ArrowDown className="w-6 h-6" />
          </button>
          <button
            className={`p-3 rounded-full ${
              direction === 'RIGHT' ? 'bg-gray-200' : 'bg-gray-100'
            } hover:bg-gray-200 transition`}
            aria-label="Move Right"
          >
            <ArrowRight className="w-6 h-6" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default GameBoard;
