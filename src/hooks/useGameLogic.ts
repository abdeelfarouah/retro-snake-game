import { useState, useEffect, useCallback } from 'react';

type Direction = 'UP' | 'DOWN' | 'LEFT' | 'RIGHT';
type Cell = 'empty' | 'snake' | 'food';
type Position = [number, number];

const BOARD_SIZE = 20;
const INITIAL_SNAKE: Position[] = [[10, 10]];
const INITIAL_DIRECTION: Direction = 'RIGHT';
const GAME_SPEED = 150;

export const useGameLogic = () => {
  const [gameBoard, setGameBoard] = useState<Cell[][]>(
    Array(BOARD_SIZE).fill(Array(BOARD_SIZE).fill('empty'))
  );
  const [snake, setSnake] = useState<Position[]>(INITIAL_SNAKE);
  const [direction, setDirection] = useState<Direction>(INITIAL_DIRECTION);
  const [food, setFood] = useState<Position>([5, 5]);
  const [score, setScore] = useState(0);
  const [isGameOver, setIsGameOver] = useState(false);
  const [isPaused, setIsPaused] = useState(true);

  const generateFood = useCallback(() => {
    let newFood: Position;
    do {
      newFood = [
        Math.floor(Math.random() * BOARD_SIZE),
        Math.floor(Math.random() * BOARD_SIZE),
      ];
    } while (
      snake.some(([x, y]) => x === newFood[0] && y === newFood[1])
    );
    setFood(newFood);
  }, [snake]);

  const updateBoard = useCallback(() => {
    const newBoard = Array(BOARD_SIZE)
      .fill(null)
      .map(() => Array(BOARD_SIZE).fill('empty'));

    snake.forEach(([x, y]) => {
      newBoard[x][y] = 'snake';
    });
    newBoard[food[0]][food[1]] = 'food';

    setGameBoard(newBoard);
  }, [snake, food]);

  const moveSnake = useCallback(() => {
    if (isPaused || isGameOver) return;

    const head = snake[0];
    let newHead: Position;

    switch (direction) {
      case 'UP':
        newHead = [(head[0] - 1 + BOARD_SIZE) % BOARD_SIZE, head[1]];
        break;
      case 'DOWN':
        newHead = [(head[0] + 1) % BOARD_SIZE, head[1]];
        break;
      case 'LEFT':
        newHead = [head[0], (head[1] - 1 + BOARD_SIZE) % BOARD_SIZE];
        break;
      case 'RIGHT':
        newHead = [head[0], (head[1] + 1) % BOARD_SIZE];
        break;
    }

    // Check collision with self
    if (snake.some(([x, y]) => x === newHead[0] && y === newHead[1])) {
      setIsGameOver(true);
      return;
    }

    const newSnake = [newHead];
    if (newHead[0] === food[0] && newHead[1] === food[1]) {
      // Snake ate food
      setScore(s => s + 1);
      generateFood();
      newSnake.push(...snake);
    } else {
      newSnake.push(...snake.slice(0, -1));
    }

    setSnake(newSnake);
  }, [direction, snake, food, isPaused, isGameOver, generateFood]);

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowUp':
          if (direction !== 'DOWN') setDirection('UP');
          break;
        case 'ArrowDown':
          if (direction !== 'UP') setDirection('DOWN');
          break;
        case 'ArrowLeft':
          if (direction !== 'RIGHT') setDirection('LEFT');
          break;
        case 'ArrowRight':
          if (direction !== 'LEFT') setDirection('RIGHT');
          break;
        case ' ':
          togglePause();
          break;
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [direction]);

  useEffect(() => {
    const gameLoop = setInterval(moveSnake, GAME_SPEED);
    return () => clearInterval(gameLoop);
  }, [moveSnake]);

  useEffect(() => {
    updateBoard();
  }, [snake, food, updateBoard]);

  const startGame = () => {
    setSnake(INITIAL_SNAKE);
    setDirection(INITIAL_DIRECTION);
    setScore(0);
    setIsGameOver(false);
    setIsPaused(false);
    generateFood();
  };

  const togglePause = () => {
    if (!isGameOver) {
      setIsPaused(p => !p);
    }
  };

  return {
    gameBoard,
    score,
    isGameOver,
    direction,
    startGame,
    isPaused,
    togglePause,
  };
};