import React from 'react';
import GameBoard from './components/GameBoard';
import { Gamepad2 } from 'lucide-react';

function App() {
  return (
    <div className="min-h-screen bg-gray-900 flex flex-col items-center py-8">
      <div className="text-center mb-8">
        <div className="flex items-center justify-center gap-3 mb-2">
          <Gamepad2 className="w-8 h-8 text-green-500" />
          <h1 className="text-4xl font-bold text-white">Snake Game Legacy</h1>
        </div>
        <p className="text-gray-400">Use arrow keys or buttons to control the snake</p>
      </div>
      
      <div className="bg-gray-800 p-8 rounded-xl shadow-2xl">
        <GameBoard />
      </div>
      
      <div className="mt-8 text-gray-400 text-sm">
        <p>Watch the snake change colors as your score increases!</p>
        <ul className="mt-2 text-center">
          <li>🟢 0-49 points: Green</li>
          <li>🟧 50+ points: Orange</li>
          <li>🔵 100+ points: Blue</li>
          <li>🟡 200+ points: Yellow</li>
          <li>🟣 300+ points: Purple</li>
        </ul>
      </div>
    </div>
  );
}

export default App;
