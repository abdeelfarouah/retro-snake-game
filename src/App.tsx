import React from 'react';
import GameBoard from './components/GameBoard';

function App() {
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="bg-white p-8 rounded-xl shadow-lg">
        <h1 className="text-3xl font-bold text-center mb-8">Snake Game</h1>
        <GameBoard />
        <div className="mt-6 text-center text-gray-600">
          <p className="mb-2">Use arrow keys to move</p>
          <p>Press space to pause/resume</p>
        </div>
      </div>
    </div>
  );
}

export default App;