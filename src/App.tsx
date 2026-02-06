import { useState, useEffect, useCallback, useRef } from 'react';
import './App.css';

import { MineField } from './components/MineField';
import { game as gameEngine } from './game';
import { Timer } from './components/Timer';
import { Game, Mine } from './domain';

export interface AppProps {
  rows: number;
  columns: number;
}

function App({ rows, columns }: AppProps) {
  const [game, setGame] = useState<Game>(() => gameEngine.newGame(rows, columns));
  const [completed, setCompleted] = useState(false);
  const [flagged, setFlagged] = useState(0);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [controlDown, setControlDown] = useState(false);
  
  const startTimeRef = useRef<Date>(new Date());
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const isControlKey = useCallback((code: string): boolean => {
    return code === "ControlLeft" || code === "ControlRight";
  }, []);

  const startTimer = useCallback(() => {
    startTimeRef.current = new Date();
    timerRef.current = setInterval(() => {
      const now = new Date();
      const elapsedMs = now.getTime() - startTimeRef.current.getTime();
      setElapsedSeconds(Math.floor(elapsedMs / 1000));
    }, 1000);
  }, []);

  const stopTimer = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isControlKey(e.code)) {
        setControlDown(true);
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (isControlKey(e.code)) {
        setControlDown(false);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('keyup', handleKeyUp);
    startTimer();

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('keyup', handleKeyUp);
      stopTimer();
    };
  }, [isControlKey, startTimer, stopTimer]);

  const updateState = useCallback((field: Mine, updateFn: (game: Game, field: Mine) => Game) => {
    setGame(prevGame => {
      const updatedGame = updateFn(prevGame, field);
      const isCompleted = gameEngine.checkCompleted(updatedGame);
      if (isCompleted || updatedGame.exploded) {
        stopTimer();
      }
      setCompleted(isCompleted);
      setFlagged(gameEngine.countFlagged(updatedGame));
      return updatedGame;
    });
  }, [stopTimer]);

  const onSquareLeftClick = useCallback((field: Mine) => {
    if (controlDown) {
      updateState(field, gameEngine.openMine);
    } else {
      updateState(field, gameEngine.markMine);
    }
  }, [controlDown, updateState]);

  const startGame = useCallback((newRows: number, newColumns: number) => {
    stopTimer();
    startTimer();
    setGame(gameEngine.newGame(newRows, newColumns));
    setCompleted(false);
    setFlagged(0);
    setElapsedSeconds(0);
  }, [startTimer, stopTimer]);

  return (
    <div className="game">
      <div className="menu">
        <ul className="level-menu">
          <li onClick={() => startGame(6, 8)}>Easy</li>
          <li onClick={() => startGame(10, 14)}>Medium</li>
          <li onClick={() => startGame(20, 30)}>Hard</li>
        </ul>
      </div>
      <MineField
        game={game}
        onLeftClick={onSquareLeftClick}
      />
      <Timer elapsedSeconds={elapsedSeconds} />
      <div className='status'>Completed: {completed ? 'YES' : 'NO'}</div>
      <div className='status'>{flagged}/{game.totalBombs}</div>
      <div className='help'>
        <h3>How to play</h3>
        <ol>
          <li>Left Click to mark possible mine or to explore fields around opened field</li>
          <li>Ctrl + Left Click to open field</li>
        </ol>
      </div>
    </div>
  );
}

export default App;
