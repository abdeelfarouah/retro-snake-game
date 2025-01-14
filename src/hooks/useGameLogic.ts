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
    Array(BOARD_SIZE).fill(null).map(() => Array(BOARD_SIZE).fill('empty'))
  );
  const [snake, setSnake] = useState<Position[]>(INITIAL_SNAKE);
  const [direction, setDirection] = useState<Direction>(INITIAL_DIRECTION);
  const [food, setFood] = useState<Position>([5, 5]);
  const [score, setScore] = useState(0);
  const [isGameOver, setIsGameOver] = useState(false);
  const [isPaused, setIsPaused] = useState(true);

  const wrapPosition = (pos: number): number => {
    if (pos < 0) return BOARD_SIZE - 1;
    if (pos >= BOARD_SIZE) return 0;
    return pos;
  };

  const generateFood = useCallback((): Position => {
    let newFood: Position;
    do {
      newFood = [
        Math.floor(Math.random() * BOARD_SIZE),
        Math.floor(Math.random() * BOARD_SIZE),
      ];
    } while (
      snake.some(([x, y]) => x === newFood[0] && y === newFood[1])
    );
    return newFood;
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

  const checkCollision = useCallback(
    (head: Position): boolean => {
      // Only check for self-collision, not wall collision
      return snake.slice(1).some(([sx, sy]) => sx === head[0] && sy === head[1]);
    },
    [snake]
  );

  const moveSnake = useCallback(() => {
    if (isPaused || isGameOver) return;

    const [headX, headY] = snake[0];
    let newHead: Position;

    switch (direction) {
      case 'UP':
        newHead = [wrapPosition(headX - 1), headY];
        break;
      case 'DOWN':
        newHead = [wrapPosition(headX + 1), headY];
        break;
      case 'LEFT':
        newHead = [headX, wrapPosition(headY - 1)];
        break;
      case 'RIGHT':
        newHead = [headX, wrapPosition(headY + 1)];
        break;
    }

    if (checkCollision(newHead)) {
      setIsGameOver(true);
      return;
    }

    const newSnake = [newHead];
    const ateFood = newHead[0] === food[0] && newHead[1] === food[1];

    if (ateFood) {
      setScore((prev) => prev + 10);
      setFood(generateFood());
      newSnake.push(...snake);
    } else {
      newSnake.push(...snake.slice(0, -1));
    }

    setSnake(newSnake);
  }, [snake, direction, food, isPaused, isGameOver, checkCollision, generateFood]);

  const handleKeyPress = useCallback(
    (event: KeyboardEvent) => {
      if (isPaused || isGameOver) return;

      const keyDirections: { [key: string]: Direction } = {
        ArrowUp: 'UP',
        ArrowDown: 'DOWN',
        ArrowLeft: 'LEFT',
        ArrowRight: 'RIGHT',
      };

      const newDirection = keyDirections[event.key];
      if (!newDirection) return;

      const opposites = {
        UP: 'DOWN',
        DOWN: 'UP',
        LEFT: 'RIGHT',
        RIGHT: 'LEFT',
      };

      if (opposites[newDirection] !== direction) {
        setDirection(newDirection);
      }
    },
    [direction, isPaused, isGameOver]
  );

  const startGame = () => {
    setSnake(INITIAL_SNAKE);
    setDirection(INITIAL_DIRECTION);
    setFood(generateFood());
    setScore(0);
    setIsGameOver(false);
    setIsPaused(false);
  };

  const togglePause = () => {
    if (!isGameOver) {
      setIsPaused(!isPaused);
    }
  };

  useEffect(() => {
    const gameInterval = setInterval(moveSnake, GAME_SPEED);
    return () => clearInterval(gameInterval);
  }, [moveSnake]);

  useEffect(() => {
    updateBoard();
  }, [snake, food, updateBoard]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [handleKeyPress]);

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
